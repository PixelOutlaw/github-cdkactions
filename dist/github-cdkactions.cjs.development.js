'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cdkactions = require('cdkactions');
var dedent = _interopDefault(require('ts-dedent'));

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

var _templateObject, _templateObject2, _templateObject3, _templateObject4;
var GradlePluginPullRequestWorkflow = /*#__PURE__*/function (_Workflow) {
  _inheritsLoose(GradlePluginPullRequestWorkflow, _Workflow);

  function GradlePluginPullRequestWorkflow(scope) {
    var _this;

    _this = _Workflow.call(this, scope, "pull-request", {
      name: "Pull Request",
      on: {
        pullRequest: {
          branches: ["main"]
        },
        push: {
          branchesIgnore: ["main"]
        }
      }
    }) || this;
    new cdkactions.Job(_assertThisInitialized(_this), "pull-request", {
      name: "CI",
      runsOn: "ubuntu-latest",
      strategy: {
        matrix: {
          gradle: ["6.7.1", "6.8.2"],
          java: ["1.8", "11", "15"]
        }
      },
      steps: [{
        name: "Check-out Code",
        uses: "actions/checkout@v2",
        "with": {
          "fetch-depth": "0"
        }
      }, {
        name: "Set up JDK",
        uses: "actions/setup-java@v1",
        "with": {
          "java-version": "${{ matrix.java }}"
        }
      }, {
        name: "Make Gradle Wrapper Executable",
        run: dedent(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["chmod +x ./gradlew"])))
      }, {
        name: "Set Gradle Version",
        run: dedent(_templateObject2 || (_templateObject2 = _taggedTemplateLiteralLoose(["./gradlew wrapper --gradle-version ${{ matrix.gradle }}"], ["./gradlew wrapper --gradle-version \\${{ matrix.gradle }}"])))
      }, {
        name: "Test Plugin Directly with Gradle",
        run: dedent(_templateObject3 || (_templateObject3 = _taggedTemplateLiteralLoose(["../gradlew check"]))),
        workingDirectory: "pixeloutlaw-gradle-plugin"
      }, {
        name: "Test Plugin Application with Gradle",
        run: dedent(_templateObject4 || (_templateObject4 = _taggedTemplateLiteralLoose(["./gradlew check"])))
      }]
    });
    return _this;
  }

  return GradlePluginPullRequestWorkflow;
}(cdkactions.Workflow);

var _templateObject$1, _templateObject2$1, _templateObject3$1, _templateObject4$1, _templateObject5;
var GradlePluginPrepareForReleaseWorkflow = /*#__PURE__*/function (_Workflow) {
  _inheritsLoose(GradlePluginPrepareForReleaseWorkflow, _Workflow);

  function GradlePluginPrepareForReleaseWorkflow(scope) {
    var _this;

    _this = _Workflow.call(this, scope, "prepare-for-release", {
      name: "Prepare For Release",
      on: {
        push: {
          branches: ["main"]
        }
      }
    }) || this;
    new cdkactions.Job(_assertThisInitialized(_this), "prepare-for-release", {
      name: "Prepare For Release",
      runsOn: "ubuntu-latest",
      steps: [{
        name: "Check-out Code",
        uses: "actions/checkout@v2",
        "with": {
          "fetch-depth": "0"
        }
      }, {
        name: "Install GitVersion",
        uses: "gittools/actions/gitversion/setup@v0.9.7",
        "with": {
          versionSpec: "5.x"
        }
      }, {
        name: "Determine Version",
        id: "gitversion",
        uses: "gittools/actions/gitversion/execute@v0.9.7"
      }, {
        name: "Display GitVersion Outputs",
        run: dedent(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteralLoose(["\n            echo \"Major: ${{ steps.gitversion.outputs.major }}\"\n            echo \"Minor: ${{ steps.gitversion.outputs.minor }}\"\n            echo \"Patch: ${{ steps.gitversion.outputs.patch }}\"\n            echo \"PreReleaseTag: ${{ steps.gitversion.outputs.preReleaseTag }}\"\n            echo \"PreReleaseTagWithDash: ${{ steps.gitversion.outputs.preReleaseTagWithDash }}\"\n            echo \"PreReleaseLabel: ${{ steps.gitversion.outputs.preReleaseLabel }}\"\n            echo \"PreReleaseNumber: ${{ steps.gitversion.outputs.preReleaseNumber }}\"\n            echo \"WeightedPreReleaseNumber: ${{ steps.gitversion.outputs.weightedPreReleaseNumber }}\"\n            echo \"BuildMetaData: ${{ steps.gitversion.outputs.buildMetaData }}\"\n            echo \"BuildMetaDataPadded: ${{ steps.gitversion.outputs.buildMetaDataPadded }}\"\n            echo \"FullBuildMetaData: ${{ steps.gitversion.outputs.fullBuildMetaData }}\"\n            echo \"MajorMinorPatch: ${{ steps.gitversion.outputs.majorMinorPatch }}\"\n            echo \"SemVer: ${{ steps.gitversion.outputs.semVer }}\"\n            echo \"LegacySemVer: ${{ steps.gitversion.outputs.legacySemVer }}\"\n            echo \"LegacySemVerPadded: ${{ steps.gitversion.outputs.legacySemVerPadded }}\"\n            echo \"AssemblySemVer: ${{ steps.gitversion.outputs.assemblySemVer }}\"\n            echo \"AssemblySemFileVer: ${{ steps.gitversion.outputs.assemblySemFileVer }}\"\n            echo \"FullSemVer: ${{ steps.gitversion.outputs.fullSemVer }}\"\n            echo \"InformationalVersion: ${{ steps.gitversion.outputs.informationalVersion }}\"\n            echo \"BranchName: ${{ steps.gitversion.outputs.branchName }}\"\n            echo \"EscapedBranchName: ${{ steps.gitversion.outputs.escapedBranchName }}\"\n            echo \"Sha: ${{ steps.gitversion.outputs.sha }}\"\n            echo \"ShortSha: ${{ steps.gitversion.outputs.shortSha }}\"\n            echo \"NuGetVersionV2: ${{ steps.gitversion.outputs.nuGetVersionV2 }}\"\n            echo \"NuGetVersion: ${{ steps.gitversion.outputs.nuGetVersion }}\"\n            echo \"NuGetPreReleaseTagV2: ${{ steps.gitversion.outputs.nuGetPreReleaseTagV2 }}\"\n            echo \"NuGetPreReleaseTag: ${{ steps.gitversion.outputs.nuGetPreReleaseTag }}\"\n            echo \"VersionSourceSha: ${{ steps.gitversion.outputs.versionSourceSha }}\"\n            echo \"CommitsSinceVersionSource: ${{ steps.gitversion.outputs.commitsSinceVersionSource }}\"\n            echo \"CommitsSinceVersionSourcePadded: ${{ steps.gitversion.outputs.commitsSinceVersionSourcePadded }}\"\n            echo \"UncommittedChanges: ${{ steps.gitversion.outputs.uncommittedChanges }}\"\n            echo \"CommitDate: ${{ steps.gitversion.outputs.commitDate }}\"\n          "], ["\n            echo \"Major: \\${{ steps.gitversion.outputs.major }}\"\n            echo \"Minor: \\${{ steps.gitversion.outputs.minor }}\"\n            echo \"Patch: \\${{ steps.gitversion.outputs.patch }}\"\n            echo \"PreReleaseTag: \\${{ steps.gitversion.outputs.preReleaseTag }}\"\n            echo \"PreReleaseTagWithDash: \\${{ steps.gitversion.outputs.preReleaseTagWithDash }}\"\n            echo \"PreReleaseLabel: \\${{ steps.gitversion.outputs.preReleaseLabel }}\"\n            echo \"PreReleaseNumber: \\${{ steps.gitversion.outputs.preReleaseNumber }}\"\n            echo \"WeightedPreReleaseNumber: \\${{ steps.gitversion.outputs.weightedPreReleaseNumber }}\"\n            echo \"BuildMetaData: \\${{ steps.gitversion.outputs.buildMetaData }}\"\n            echo \"BuildMetaDataPadded: \\${{ steps.gitversion.outputs.buildMetaDataPadded }}\"\n            echo \"FullBuildMetaData: \\${{ steps.gitversion.outputs.fullBuildMetaData }}\"\n            echo \"MajorMinorPatch: \\${{ steps.gitversion.outputs.majorMinorPatch }}\"\n            echo \"SemVer: \\${{ steps.gitversion.outputs.semVer }}\"\n            echo \"LegacySemVer: \\${{ steps.gitversion.outputs.legacySemVer }}\"\n            echo \"LegacySemVerPadded: \\${{ steps.gitversion.outputs.legacySemVerPadded }}\"\n            echo \"AssemblySemVer: \\${{ steps.gitversion.outputs.assemblySemVer }}\"\n            echo \"AssemblySemFileVer: \\${{ steps.gitversion.outputs.assemblySemFileVer }}\"\n            echo \"FullSemVer: \\${{ steps.gitversion.outputs.fullSemVer }}\"\n            echo \"InformationalVersion: \\${{ steps.gitversion.outputs.informationalVersion }}\"\n            echo \"BranchName: \\${{ steps.gitversion.outputs.branchName }}\"\n            echo \"EscapedBranchName: \\${{ steps.gitversion.outputs.escapedBranchName }}\"\n            echo \"Sha: \\${{ steps.gitversion.outputs.sha }}\"\n            echo \"ShortSha: \\${{ steps.gitversion.outputs.shortSha }}\"\n            echo \"NuGetVersionV2: \\${{ steps.gitversion.outputs.nuGetVersionV2 }}\"\n            echo \"NuGetVersion: \\${{ steps.gitversion.outputs.nuGetVersion }}\"\n            echo \"NuGetPreReleaseTagV2: \\${{ steps.gitversion.outputs.nuGetPreReleaseTagV2 }}\"\n            echo \"NuGetPreReleaseTag: \\${{ steps.gitversion.outputs.nuGetPreReleaseTag }}\"\n            echo \"VersionSourceSha: \\${{ steps.gitversion.outputs.versionSourceSha }}\"\n            echo \"CommitsSinceVersionSource: \\${{ steps.gitversion.outputs.commitsSinceVersionSource }}\"\n            echo \"CommitsSinceVersionSourcePadded: \\${{ steps.gitversion.outputs.commitsSinceVersionSourcePadded }}\"\n            echo \"UncommittedChanges: \\${{ steps.gitversion.outputs.uncommittedChanges }}\"\n            echo \"CommitDate: \\${{ steps.gitversion.outputs.commitDate }}\"\n          "])))
      }, {
        name: "Set up JDK",
        uses: "actions/setup-java@v1",
        "with": {
          "java-version": "1.8"
        }
      }, {
        name: "Set Gradle Version",
        run: dedent(_templateObject2$1 || (_templateObject2$1 = _taggedTemplateLiteralLoose(["./gradlew wrapper --gradle-version 6.8.2"])))
      }, {
        name: "Test Plugin Directly with Gradle",
        run: dedent(_templateObject3$1 || (_templateObject3$1 = _taggedTemplateLiteralLoose(["../gradlew check"]))),
        workingDirectory: "pixeloutlaw-gradle-plugin"
      }, {
        name: "Test Plugin Application with Gradle",
        run: dedent(_templateObject4$1 || (_templateObject4$1 = _taggedTemplateLiteralLoose(["./gradlew check"])))
      }, {
        name: "Push Tag",
        uses: "mathieudutour/github-tag-action@v5.1",
        "with": {
          custom_tag: "${{ steps.gitversion.outputs.semVer }}",
          github_token: "${{ secrets.ACTIONS_PAT }}",
          tag_prefix: "",
          create_annotated_tag: "true"
        }
      }, {
        name: "Publish Plugins to Gradle Plugin Portal",
        run: dedent(_templateObject5 || (_templateObject5 = _taggedTemplateLiteralLoose(["./gradlew :pixeloutlaw-gradle-plugin:publishPlugins           -Pversion=${{ steps.gitversion.outputs.semVer }}           -Pgradle.publish.key=${{ secrets.GRADLE_PUBLISH_KEY }}           -Pgradle.publish.secret=${{ secrets.GRADLE_PUBLISH_SECRET }}"], ["./gradlew :pixeloutlaw-gradle-plugin:publishPlugins \\\n          -Pversion=\\${{ steps.gitversion.outputs.semVer }} \\\n          -Pgradle.publish.key=\\${{ secrets.GRADLE_PUBLISH_KEY }} \\\n          -Pgradle.publish.secret=\\${{ secrets.GRADLE_PUBLISH_SECRET }}"])))
      }]
    });
    return _this;
  }

  return GradlePluginPrepareForReleaseWorkflow;
}(cdkactions.Workflow);

var GradlePluginReleaseWorkflow = /*#__PURE__*/function (_Workflow) {
  _inheritsLoose(GradlePluginReleaseWorkflow, _Workflow);

  function GradlePluginReleaseWorkflow(scope) {
    var _this;

    _this = _Workflow.call(this, scope, "release", {
      name: "Create Release",
      on: {
        push: {
          tags: ["*"]
        }
      }
    }) || this;
    new cdkactions.Job(_assertThisInitialized(_this), "release", {
      name: "Release",
      runsOn: "ubuntu-latest",
      steps: [{
        name: "Check-out Code",
        uses: "actions/checkout@v2",
        "with": {
          "fetch-depth": "0"
        }
      }, {
        name: "Build Changelog",
        id: "github_release",
        uses: "mikepenz/release-changelog-builder-action@main",
        env: {
          GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
        }
      }, {
        name: "Create GitHub Release",
        uses: "actions/create-release@v1",
        env: {
          GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
        },
        "with": {
          body: "${{ steps.github_release.outputs.changelog }}",
          release_name: "${{ github.ref }}",
          tag_name: "${{ github.ref }}"
        }
      }]
    });
    return _this;
  }

  return GradlePluginReleaseWorkflow;
}(cdkactions.Workflow);

exports.GradlePluginPrepareForReleaseWorkflow = GradlePluginPrepareForReleaseWorkflow;
exports.GradlePluginPullRequestWorkflow = GradlePluginPullRequestWorkflow;
exports.GradlePluginReleaseWorkflow = GradlePluginReleaseWorkflow;
//# sourceMappingURL=github-cdkactions.cjs.development.js.map
