import { App, Stack } from "cdkactions";
import { createGradlePluginPrepareForReleaseWorkflow } from "../createGradlePluginPrepareForReleaseWorkflow";

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
    ).toMatchSnapshot();
  });
});
