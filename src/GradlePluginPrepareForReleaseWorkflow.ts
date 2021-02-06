import { Job, Workflow } from "cdkactions";
import { Construct } from "constructs";
import dedent from "ts-dedent";

export class GradlePluginPrepareForReleaseWorkflow extends Workflow {
  constructor(scope: Construct) {
    super(scope, "prepare-for-release", {
      name: "Prepare For Release",
      on: {
        push: { branches: ["main"] },
      },
    });

    new Job(this, "prepare-for-release", {
      name: "Prepare For Release",
      runsOn: "ubuntu-latest",
      steps: [
        {
          name: "Check-out Code",
          uses: "actions/checkout@v2",
          with: { "fetch-depth": "0" },
        },
        {
          name: "Install GitVersion",
          uses: "gittools/actions/gitversion/setup@v0.9.7",
          with: { versionSpec: "5.x" },
        },
        {
          name: "Determine Version",
          id: "gitversion",
          uses: "gittools/actions/gitversion/execute@v0.9.7",
        },
        {
          name: "Display GitVersion Outputs",
          run: dedent`
            echo "Major: \${{ steps.gitversion.outputs.major }}"
            echo "Minor: \${{ steps.gitversion.outputs.minor }}"
            echo "Patch: \${{ steps.gitversion.outputs.patch }}"
            echo "PreReleaseTag: \${{ steps.gitversion.outputs.preReleaseTag }}"
            echo "PreReleaseTagWithDash: \${{ steps.gitversion.outputs.preReleaseTagWithDash }}"
            echo "PreReleaseLabel: \${{ steps.gitversion.outputs.preReleaseLabel }}"
            echo "PreReleaseNumber: \${{ steps.gitversion.outputs.preReleaseNumber }}"
            echo "WeightedPreReleaseNumber: \${{ steps.gitversion.outputs.weightedPreReleaseNumber }}"
            echo "BuildMetaData: \${{ steps.gitversion.outputs.buildMetaData }}"
            echo "BuildMetaDataPadded: \${{ steps.gitversion.outputs.buildMetaDataPadded }}"
            echo "FullBuildMetaData: \${{ steps.gitversion.outputs.fullBuildMetaData }}"
            echo "MajorMinorPatch: \${{ steps.gitversion.outputs.majorMinorPatch }}"
            echo "SemVer: \${{ steps.gitversion.outputs.semVer }}"
            echo "LegacySemVer: \${{ steps.gitversion.outputs.legacySemVer }}"
            echo "LegacySemVerPadded: \${{ steps.gitversion.outputs.legacySemVerPadded }}"
            echo "AssemblySemVer: \${{ steps.gitversion.outputs.assemblySemVer }}"
            echo "AssemblySemFileVer: \${{ steps.gitversion.outputs.assemblySemFileVer }}"
            echo "FullSemVer: \${{ steps.gitversion.outputs.fullSemVer }}"
            echo "InformationalVersion: \${{ steps.gitversion.outputs.informationalVersion }}"
            echo "BranchName: \${{ steps.gitversion.outputs.branchName }}"
            echo "EscapedBranchName: \${{ steps.gitversion.outputs.escapedBranchName }}"
            echo "Sha: \${{ steps.gitversion.outputs.sha }}"
            echo "ShortSha: \${{ steps.gitversion.outputs.shortSha }}"
            echo "NuGetVersionV2: \${{ steps.gitversion.outputs.nuGetVersionV2 }}"
            echo "NuGetVersion: \${{ steps.gitversion.outputs.nuGetVersion }}"
            echo "NuGetPreReleaseTagV2: \${{ steps.gitversion.outputs.nuGetPreReleaseTagV2 }}"
            echo "NuGetPreReleaseTag: \${{ steps.gitversion.outputs.nuGetPreReleaseTag }}"
            echo "VersionSourceSha: \${{ steps.gitversion.outputs.versionSourceSha }}"
            echo "CommitsSinceVersionSource: \${{ steps.gitversion.outputs.commitsSinceVersionSource }}"
            echo "CommitsSinceVersionSourcePadded: \${{ steps.gitversion.outputs.commitsSinceVersionSourcePadded }}"
            echo "UncommittedChanges: \${{ steps.gitversion.outputs.uncommittedChanges }}"
            echo "CommitDate: \${{ steps.gitversion.outputs.commitDate }}"
          `,
        },
        {
          name: "Set up JDK",
          uses: "actions/setup-java@v1",
          with: { "java-version": "1.8" },
        },
        {
          name: "Set Gradle Version",
          run: dedent`./gradlew wrapper --gradle-version 6.8.2`,
        },
        {
          name: "Test Plugin Directly with Gradle",
          run: dedent`../gradlew check`,
          workingDirectory: "pixeloutlaw-gradle-plugin",
        },
        {
          name: "Test Plugin Application with Gradle",
          run: dedent`./gradlew check`,
        },
        {
          name: "Push Tag",
          uses: "mathieudutour/github-tag-action@v5.1",
          with: {
            custom_tag: `\${{ steps.gitversion.outputs.semVer }}`,
            github_token: `\${{ secrets.ACTIONS_PAT }}`,
            tag_prefix: "",
            create_annotated_tag: "true",
          },
        },
        {
          name: "Publish Plugins to Gradle Plugin Portal",
          run: dedent`./gradlew :pixeloutlaw-gradle-plugin:publishPlugins \
          -Pversion=\${{ steps.gitversion.outputs.semVer }} \
          -Pgradle.publish.key=\${{ secrets.GRADLE_PUBLISH_KEY }} \
          -Pgradle.publish.secret=\${{ secrets.GRADLE_PUBLISH_SECRET }}`,
        },
      ],
    });
  }
}
