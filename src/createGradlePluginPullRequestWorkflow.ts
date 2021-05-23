import { Job, Stack, Workflow } from "cdkactions";
import dedent from "ts-dedent";
import { GradlePluginConfig } from "./types";

export const createGradlePluginPullRequestWorkflow = (
  stack: Stack,
  config: GradlePluginConfig
): Workflow => {
  const workflow = new Workflow(stack, "pull-request", {
    name: "Pull Request",
    on: {
      pullRequest: { branches: ["main"] },
      push: { branchesIgnore: ["main"] },
    },
  });

  const pluginName = config.pluginName;
  const supportedGradleVersions = config.supportedGradleVersions ?? ["7.0.2"];

  new Job(workflow, "pull-request", {
    name: "CI",
    runsOn: "ubuntu-latest",
    strategy: {
      matrix: {
        gradle: supportedGradleVersions,
        java: ["1.8", "11", "15"],
      },
    },
    steps: [
      {
        name: "Check-out Code",
        uses: "actions/checkout@v2",
        with: { "fetch-depth": 0 },
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
        run: dedent`./gradlew wrapper --gradle-version \${{ matrix.gradle }}`,
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
    ],
  });
  return workflow;
};
