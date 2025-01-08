import { ICaptureEvent } from "./types/tracker.types";

export class EventCapture {
  private captures: Record<string, ICaptureEvent[]> = {};

  public capture(eventName: string, data: any): void {
    if (!this.captures[eventName]) {
      this.captures[eventName] = [];
    }

    this.captures[eventName].push({
      name: eventName,
      data,
      time: Date.now(),
    });
  }

  public getCapturedEvents(): Record<string, ICaptureEvent[]> {
    return { ...this.captures };
  }
}
