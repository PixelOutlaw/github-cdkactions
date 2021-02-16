import { App, Stack } from "cdkactions";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { join } from "path";
import { createGradleLibraryPrepareForReleaseWorkflow } from "../createGradleLibraryPrepareForReleaseWorkflow";

const gradleLibraryPrepareForReleaseWorkflowRaw = readFileSync(
  join(__dirname, "gradleLibraryPrepareForReleaseWorkflow.fixture.yaml"),
  "utf-8"
);
const gradleLibraryPrepareForReleaseWorkflow = load(
  gradleLibraryPrepareForReleaseWorkflowRaw
);

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
    ).toEqual(gradleLibraryPrepareForReleaseWorkflow);
  });
});
