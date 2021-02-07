import { App, Stack } from "cdkactions";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { join } from "path";

import { createGradleLibraryPullRequestWorkflow } from "../createGradleLibraryPullRequestWorkflow";

const gradleLibraryPullRequestWorkflowRaw = readFileSync(
  join(__dirname, "gradleLibraryPullRequestWorkflow.fixture.yaml"),
  "utf-8"
);
const gradleLibraryPullRequestWorkflow = load(
  gradleLibraryPullRequestWorkflowRaw
);

describe("createGradleLibraryPullRequestWorkflow", () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, "cdk");
  });

  it("generates a GitHub Actions workflow", () => {
    expect(createGradleLibraryPullRequestWorkflow(stack).toGHAction()).toEqual(
      gradleLibraryPullRequestWorkflow
    );
  });
});
