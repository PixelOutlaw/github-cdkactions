import { App, Stack } from "cdkactions";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { join } from "path";
import { createGradlePluginPullRequestWorkflow } from "../createGradlePluginPullRequestWorkflow";

const gradlePluginPullRequestWorkflowRaw = readFileSync(
  join(__dirname, "gradlePluginPullRequestWorkflow.fixture.yaml"),
  "utf-8"
);
const gradlePluginPullRequestWorkflow = load(
  gradlePluginPullRequestWorkflowRaw
);

describe("createGradlePluginPullRequestWorkflow", () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, "cdk");
  });

  it("generates a GitHub Actions workflow", () => {
    const pluginName = "pixeloutlaw-gradle-plugin";
    expect(
      createGradlePluginPullRequestWorkflow(stack, {
        pluginName,
      }).toGHAction()
    ).toEqual(gradlePluginPullRequestWorkflow);
  });
});
