import { App, Stack } from "cdkactions";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { join } from "path";
import { createGradleLibraryReleaseWorkflow } from "../createGradleLibraryReleaseWorkflow";

const gradleLibraryReleaseWorkflowRaw = readFileSync(
  join(__dirname, "gradleLibraryReleaseWorkflow.fixture.yaml"),
  "utf-8"
);
const gradleLibraryReleaseWorkflow = load(gradleLibraryReleaseWorkflowRaw);

describe("createGradleLibraryReleaseWorkflow", () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, "cdk");
  });

  it("generates a GitHub Actions workflow", () => {
    expect(createGradleLibraryReleaseWorkflow(stack).toGHAction()).toEqual(
      gradleLibraryReleaseWorkflow
    );
  });
});
