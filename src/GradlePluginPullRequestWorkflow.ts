import { Job, Workflow } from "cdkactions";
import { Construct } from "constructs";
import dedent from "ts-dedent";

export class GradlePluginPullRequestWorkflow extends Workflow {
  constructor(scope: Construct) {
    super(scope, "pull-request", {
      name: "Pull Request",
      on: {
        pullRequest: { branches: ["main"] },
        push: { branchesIgnore: ["main"] },
      },
    });

    new Job(this, "pull-request", {
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
          with: { "fetch-depth": "0" },
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
  }
}
