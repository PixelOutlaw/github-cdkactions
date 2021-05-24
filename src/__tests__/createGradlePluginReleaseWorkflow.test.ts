import { App, Stack } from "cdkactions";
import { createGradlePluginReleaseWorkflow } from "../createGradlePluginReleaseWorkflow";

describe("createGradlePluginReleaseWorkflow", () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, "cdk");
  });

  it("generates a GitHub Actions workflow", () => {
    expect(
      createGradlePluginReleaseWorkflow(stack).toGHAction()
    ).toMatchSnapshot();
  });
});
