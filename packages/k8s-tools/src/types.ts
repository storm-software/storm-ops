import { Options } from 'prettier';
/** Types for the core library */

/** Interface for objects that can be initialized */
export interface Initializable {
  initialized: boolean;
  initialize(): Promise<void>;
}

/** Options for packaging a chart */
export interface PackageOptions {
  chartFolder: string;
  outputFolder: string;
}

/** Options for pushing a chart */
export interface PushOptions {
  chartPath: string;
  remote: string;
}

/** Abstract class for Helm */
export abstract class AbstractHelmClient implements Initializable {
  initialized = false;

  abstract package(options: PackageOptions): Promise<string | undefined>;

  async initialize(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

/** Represents an Prettier ignore file. */
export interface PrettierConfig {
  sourceFilepath: string;
  config: Options;
}
