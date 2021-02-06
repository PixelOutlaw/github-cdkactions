import { Job, Stack, Workflow } from "cdkactions";

export const createGradlePluginReleaseWorkflow = (stack: Stack): Workflow => {
  const workflow = new Workflow(stack, "release", {
    name: "Create Release",
    on: {
      push: { tags: ["*"] },
    },
  });
  new Job(workflow, "release", {
    name: "Release",
    runsOn: "ubuntu-latest",
    steps: [
      {
        name: "Check-out Code",
        uses: "actions/checkout@v2",
        with: { "fetch-depth": "0" },
      },
      {
        name: "Build Changelog",
        id: "github_release",
        uses: "mikepenz/release-changelog-builder-action@main",
        env: {
          GITHUB_TOKEN: `\${{ secrets.GITHUB_TOKEN }}`,
        },
      },
      {
        name: "Create GitHub Release",
        uses: "actions/create-release@v1",
        env: {
          GITHUB_TOKEN: `\${{ secrets.GITHUB_TOKEN }}`,
        },
        with: {
          body: `\${{ steps.github_release.outputs.changelog }}`,
          release_name: `\${{ github.ref }}`,
          tag_name: `\${{ github.ref }}`,
        },
      },
    ],
  });
  return workflow;
};
