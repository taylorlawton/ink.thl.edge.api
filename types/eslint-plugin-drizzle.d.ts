declare module 'eslint-plugin-drizzle' {
  import type { Linter, Rule } from 'eslint';

  /**
   * Restricts which object names are treated as Drizzle query builders.
   */
  export interface DrizzleRuleOptions {
    drizzleObjectName?: string | string[];
  }

  export const rules: {
    'enforce-delete-with-where': Rule.RuleModule;
    'enforce-update-with-where': Rule.RuleModule;
  };

  export const configs: {
    all: Linter.LegacyConfig;
    recommended: Linter.LegacyConfig;
  };

  export const meta: {
    name: string;
    version: string;
  };
}
