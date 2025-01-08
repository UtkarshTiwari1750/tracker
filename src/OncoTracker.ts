import { TrackerConfig } from "./TrackerConfig";
import { UserSession } from "./UserSession";
import { PageTracker } from "./PageTracker";
import { EventCapture } from "./EventCapture";
import { TrackerAPI } from "./TrackerAPI";
import { ITrackerConfig, ITrackingData } from "./types/tracker.types";

export class OncoTracker {
  private config: TrackerConfig;
  private userSession: UserSession;
  private pageTracker: PageTracker;
  private eventCapture: EventCapture;
  private api: TrackerAPI;
  private trackingInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.config = new TrackerConfig();
    this.userSession = new UserSession();
    this.pageTracker = new PageTracker();
    this.eventCapture = new EventCapture();
    this.api = new TrackerAPI("");
  }

  public init(userConfig: Partial<ITrackerConfig>): void {
    this.config.initialize(userConfig);
    const config = this.config.getConfig();

    if (!config.apiEndpoint || !config.siteId) {
      console.error("OncoTracker: apiEndpoint and siteId are required");
      return;
    }

    this.api = new TrackerAPI(config.apiEndpoint);
    this.setupPhoneNumberTracking();
    this.startTracking(config.debugMode);

    window.addEventListener("beforeunload", () => this.sendTrackingData());
  }

  private setupPhoneNumberTracking(): void {
    document.addEventListener("change", (e: Event) => {
      const element = e.target as HTMLInputElement;
      if (
        element.tagName === "INPUT" &&
        (element.type === "tel" ||
          element.id.toLowerCase().includes("phone") ||
          element.name.toLowerCase().includes("phone"))
      ) {
        this.userSession.setPhoneNumber(element.value);
      }
    });
  }

  private startTracking(debugMode: boolean): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }

    const interval = debugMode ? 2000 : 30000;
    this.trackingInterval = setInterval(
      () => this.sendTrackingData(),
      interval
    );
    this.config.setDebugMode(debugMode);
  }

  private async sendTrackingData(): Promise<void> {
    const sessionData = this.userSession.getSessionData();
    if (!sessionData.phoneNumber) return;

    const trackingData: ITrackingData = {
      ...this.config.getConfig(),
      ...sessionData,
      ...this.pageTracker.getTrackingData(),
      sessionEnd: Date.now(),
      capture: this.eventCapture.getCapturedEvents(),
      timeSinceLastSent: sessionData.lastSentTime
        ? Date.now() - sessionData.lastSentTime
        : null,
      isDebugMode: this.config.isDebugMode(),
    };

    const success = await this.api.sendTrackingData(trackingData);
    if (success) {
      this.userSession.updateLastSentTime();
    }
  }

  public toggleDebugMode(): boolean {
    const newMode = !this.config.isDebugMode();
    this.startTracking(newMode);
    return newMode;
  }

  public capture(eventName: string, data: any): void {
    if (this.config.isDebugMode()) {
      this.eventCapture.capture(eventName, data);
    }
  }

  public setPhoneNumber(phone: string): void {
    this.userSession.setPhoneNumber(phone);
  }

  public debug(): any {
    return {
      config: this.config.getConfig(),
      userData: this.userSession.getSessionData(),
      currentTime: Date.now(),
    };
  }
}
