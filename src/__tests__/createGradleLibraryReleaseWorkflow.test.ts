import { App, Stack } from "cdkactions";
import { createGradleLibraryReleaseWorkflow } from "../createGradleLibraryReleaseWorkflow";

describe("createGradleLibraryReleaseWorkflow", () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, "cdk");
  });

  it("generates a GitHub Actions workflow", () => {
    expect(
      createGradleLibraryReleaseWorkflow(stack).toGHAction()
    ).toMatchSnapshot();
  });
});
