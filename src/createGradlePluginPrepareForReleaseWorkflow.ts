import { Job, Stack, Workflow } from "cdkactions";
import dedent from "ts-dedent";
import { GradlePluginConfig } from "./types";

export const createGradlePluginPrepareForReleaseWorkflow = (
  stack: Stack,
  config: GradlePluginConfig
): Workflow => {
  const workflow = new Workflow(stack, "prepare-for-release", {
    name: "Prepare For Release",
    on: {
      push: { branches: ["main"] },
    },
  });

  const pluginName = config.pluginName;
  const primaryGradleVersion = config.primaryGradleVersion ?? "7.0.2";
  const timeoutMinutes = config?.timeoutMinutes ?? 10;

  new Job(workflow, "prepare-for-release", {
    name: "Prepare For Release",
    runsOn: "ubuntu-latest",
    timeoutMinutes,
    steps: [
      {
        name: "Check-out Code",
        uses: "actions/checkout@v2",
        with: { "fetch-depth": 0 },
      },
      {
        name: "Turnstyle",
        uses: "softprops/turnstyle@v1",
        env: {
          GITHUB_TOKEN: `\${{ secrets.GITHUB_TOKEN }}`,
        },
      },
      {
        name: "Install GitVersion",
        uses: "gittools/actions/gitversion/setup@v0.9.9",
        with: { versionSpec: "5.x" },
      },
      {
        name: "Determine Version",
        id: "gitversion",
        uses: "gittools/actions/gitversion/execute@v0.9.9",
      },
      {
        name: "Set up JDK",
        uses: "actions/setup-java@v2",
        with: {
          distribution: "adopt",
          "java-version": "1.8",
        },
      },
      {
        name: "Make Gradle Wrapper Executable",
        run: dedent`chmod +x ./gradlew`,
      },
      {
        name: "Set Gradle Version",
        run: dedent`./gradlew wrapper --gradle-version ${primaryGradleVersion}`,
      },
      {
        name: "Test Plugin Directly with Gradle",
        run: dedent`../gradlew check`,
        workingDirectory: pluginName,
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
          create_annotated_tag: true,
        },
      },
      {
        name: "Publish Plugins to Gradle Plugin Portal",
        run: dedent`./gradlew :${pluginName}:publishPlugins \
          -Pversion=\${{ steps.gitversion.outputs.semVer }} \
          -Pgradle.publish.key=\${{ secrets.GRADLE_PUBLISH_KEY }} \
          -Pgradle.publish.secret=\${{ secrets.GRADLE_PUBLISH_SECRET }}`,
      },
    ],
  });
  return workflow;
};
