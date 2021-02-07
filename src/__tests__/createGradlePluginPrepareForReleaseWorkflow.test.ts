import { App, Stack } from "cdkactions";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { join } from "path";

import { createGradlePluginPrepareForReleaseWorkflow } from "../createGradlePluginPrepareForReleaseWorkflow";

const gradlePluginPrepareForReleaseWorkflowRaw = readFileSync(
  join(__dirname, "gradlePluginPrepareForReleaseWorkflow.fixture.yaml"),
  "utf-8"
);
const gradlePluginPrepareForReleaseWorkflow = load(
  gradlePluginPrepareForReleaseWorkflowRaw
);

describe("createGradlePluginPrepareForReleaseWorkflow", () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, "cdk");
  });

  it("generates a GitHub Actions workflow", () => {
    const pluginName = "pixeloutlaw-gradle-plugin";
    expect(
      createGradlePluginPrepareForReleaseWorkflow(stack, {
        pluginName,
      }).toGHAction()
    ).toEqual(gradlePluginPrepareForReleaseWorkflow);
  });
});
