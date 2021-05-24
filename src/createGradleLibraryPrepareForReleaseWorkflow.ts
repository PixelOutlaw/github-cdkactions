import { Job, Stack, Workflow } from "cdkactions";
import dedent from "ts-dedent";
import { GradleLibraryConfig } from "./types";

export const createGradleLibraryPrepareForReleaseWorkflow = (
  stack: Stack,
  config?: GradleLibraryConfig
): Workflow => {
  const workflow = new Workflow(stack, "prepare-for-release", {
    name: "Prepare For Release",
    on: {
      push: { branches: ["main"] },
    },
  });

  const preTestSteps = config?.preTestSteps ?? [];
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
          "java-version": "8",
        },
      },
      {
        name: "Make Gradle Wrapper Executable",
        run: dedent`chmod +x ./gradlew`,
      },
      {
        name: "Set Gradle Version",
        run: dedent`./gradlew wrapper --gradle-version 7.0.2`,
      },
      ...preTestSteps, // expand preTestSteps
      {
        name: "Test Library with Gradle",
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
        name: "Publish Library to Maven Central",
        run: dedent`./gradlew publishToSonatype \
          -Pversion=\${{ steps.gitversion.outputs.semVer }}`,
        env: {
          ORG_GRADLE_PROJECT_signingKey: `\${{ secrets.GPG_PRIVATE_KEY }}`,
          ORG_GRADLE_PROJECT_signingPassword: `\${{ secrets.GPG_PASSWORD }}`,
          OSSRH_USERNAME: `\${{ secrets.OSSRH_USERNAME }}`,
          OSSRH_PASSWORD: `\${{ secrets.OSSRH_TOKEN }}`,
        },
      },
      {
        name: "Close and Release Repository on Maven Central",
        run: dedent`./gradlew closeAndReleaseRepository`,
        env: {
          OSSRH_USERNAME: `\${{ secrets.OSSRH_USERNAME }}`,
          OSSRH_PASSWORD: `\${{ secrets.OSSRH_TOKEN }}`,
        },
      },
    ],
  });
  return workflow;
};
