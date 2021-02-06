import { Job, Stack, Workflow } from "cdkactions";
import dedent from "ts-dedent";

export const createGradlePluginPrepareForReleaseWorkflow = (
  stack: Stack
): Workflow => {
  const workflow = new Workflow(stack, "prepare-for-release", {
    name: "Prepare For Release",
    on: {
      push: { branches: ["main"] },
    },
  });
  new Job(workflow, "prepare-for-release", {
    name: "Prepare For Release",
    runsOn: "ubuntu-latest",
    steps: [
      {
        name: "Check-out Code",
        uses: "actions/checkout@v2",
        with: { "fetch-depth": "0" },
      },
      {
        name: "Install GitVersion",
        uses: "gittools/actions/gitversion/setup@v0.9.7",
        with: { versionSpec: "5.x" },
      },
      {
        name: "Determine Version",
        id: "gitversion",
        uses: "gittools/actions/gitversion/execute@v0.9.7",
      },
      {
        name: "Set up JDK",
        uses: "actions/setup-java@v1",
        with: { "java-version": "1.8" },
      },
      {
        name: "Set Gradle Version",
        run: dedent`./gradlew wrapper --gradle-version 6.8.2`,
      },
      {
        name: "Test Plugin Directly with Gradle",
        run: dedent`../gradlew check`,
        workingDirectory: "pixeloutlaw-gradle-plugin",
      },
      {
        name: "Test Plugin Application with Gradle",
        run: dedent`./gradlew check`,
      },
      {
        name: "Push Tag",
        uses: "mathieudutour/github-tag-action@v5.1",
        with: {
          custom_tag: `\${{ steps.gitversion.outputs.semVer }}`,
          github_token: `\${{ secrets.ACTIONS_PAT }}`,
          tag_prefix: "",
          create_annotated_tag: "true",
        },
      },
      {
        name: "Publish Plugins to Gradle Plugin Portal",
        run: dedent`./gradlew :pixeloutlaw-gradle-plugin:publishPlugins \
          -Pversion=\${{ steps.gitversion.outputs.semVer }} \
          -Pgradle.publish.key=\${{ secrets.GRADLE_PUBLISH_KEY }} \
          -Pgradle.publish.secret=\${{ secrets.GRADLE_PUBLISH_SECRET }}`,
      },
    ],
  });
  return workflow;
};
