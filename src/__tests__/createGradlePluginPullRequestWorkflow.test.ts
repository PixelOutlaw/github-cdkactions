import { App, Stack } from "cdkactions";
import { createGradlePluginPullRequestWorkflow } from "../createGradlePluginPullRequestWorkflow";

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
    ).toMatchSnapshot();
  });
});
