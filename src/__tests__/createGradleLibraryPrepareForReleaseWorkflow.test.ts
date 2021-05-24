import { App, Stack } from "cdkactions";
import { createGradleLibraryPrepareForReleaseWorkflow } from "../createGradleLibraryPrepareForReleaseWorkflow";

describe("createGradleLibraryPrepareForReleaseWorkflow", () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, "cdk");
  });

  it("generates a GitHub Actions workflow", () => {
    expect(
      createGradleLibraryPrepareForReleaseWorkflow(stack).toGHAction()
    ).toMatchSnapshot();
  });
});
