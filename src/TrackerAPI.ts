import { ITrackingData } from "./types/tracker.types";

export class TrackerAPI {
  private apiEndpoint: string;

  constructor(apiEndpoint: string) {
    this.apiEndpoint = apiEndpoint;
  }

  public async sendTrackingData(data: ITrackingData): Promise<boolean> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.ok;
    } catch (error) {
      console.error("Error sending tracking data:", error);
      return false;
    }
  }
}
