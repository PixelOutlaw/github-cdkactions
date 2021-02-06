import { Job, Stack, Workflow } from "cdkactions";
import dedent from "ts-dedent";

export const createGradlePluginPullRequestWorkflow = (
  stack: Stack
): Workflow => {
  const workflow = new Workflow(stack, "pull-request", {
    name: "Pull Request",
    on: {
      pullRequest: { branches: ["main"] },
      push: { branchesIgnore: ["main"] },
    },
  });
  new Job(workflow, "pull-request", {
    name: "CI",
    runsOn: "ubuntu-latest",
    strategy: {
      matrix: {
        gradle: ["6.7.1", "6.8.2"],
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
        uses: "actions/setup-java@v1",
        with: { "java-version": `\${{ matrix.java }}` },
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
        workingDirectory: "pixeloutlaw-gradle-plugin",
      },
      {
        name: "Test Plugin Application with Gradle",
        run: dedent`./gradlew check`,
      },
    ],
  });
  return workflow;
};
