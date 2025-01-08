import { ITrackerConfig } from "./types/tracker.types";

export class TrackerConfig {
  private config: ITrackerConfig;

  constructor() {
    this.config = {
      apiEndpoint: "",
      siteId: "",
      debugMode: false,
    };
  }

  public initialize(userConfig: Partial<ITrackerConfig>): void {
    this.config = { ...this.config, ...userConfig };
  }

  public getConfig(): ITrackerConfig {
    return { ...this.config };
  }

  public setDebugMode(mode: boolean): void {
    this.config.debugMode = mode;
  }

  public isDebugMode(): boolean {
    return this.config.debugMode;
  }
}
