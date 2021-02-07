import { StepsProps } from "cdkactions";

/**
 * Configuration for Gradle library workflows.
 */
export interface GradleLibraryConfig {
  gradleVersion?: string;

  preTestSteps?: StepsProps[];
}

/**
 * Configuration for Gradle plugin workflows.
 */
export interface GradlePluginConfig {
  pluginName: string;

  primaryGradleVersion?: string;

  supportedGradleVersions?: string[];
}
