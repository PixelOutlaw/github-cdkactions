import { App, Stack } from "cdkactions";
import { createGradleLibraryPullRequestWorkflow } from "../createGradleLibraryPullRequestWorkflow";

describe("createGradleLibraryPullRequestWorkflow", () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, "cdk");
  });

  it("generates a GitHub Actions workflow", () => {
    expect(
      createGradleLibraryPullRequestWorkflow(stack).toGHAction()
    ).toMatchSnapshot();
  });
});
