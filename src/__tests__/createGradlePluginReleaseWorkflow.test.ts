import { App, Stack } from "cdkactions";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { join } from "path";
import { createGradlePluginReleaseWorkflow } from "../createGradlePluginReleaseWorkflow";

const gradlePluginReleaseWorkflowRaw = readFileSync(
  join(__dirname, "gradlePluginReleaseWorkflow.fixture.yaml"),
  "utf-8"
);
const gradlePluginReleaseWorkflow = load(gradlePluginReleaseWorkflowRaw);

describe("createGradlePluginReleaseWorkflow", () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, "cdk");
  });

  it("generates a GitHub Actions workflow", () => {
    expect(createGradlePluginReleaseWorkflow(stack).toGHAction()).toEqual(
      gradlePluginReleaseWorkflow
    );
  });
});
