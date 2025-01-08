export class UserSession {
  private phoneNumber: string | null = null;
  private sessionId: string;
  private sessionStart: number;
  private lastSentTime: number | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
  }

  private generateSessionId(): string {
    return "sess_" + Math.random().toString(36).substr(2, 9);
  }

  public setPhoneNumber(phone: string): void {
    this.phoneNumber = phone;
  }

  public getSessionData() {
    return {
      phoneNumber: this.phoneNumber,
      sessionId: this.sessionId,
      sessionStart: this.sessionStart,
      lastSentTime: this.lastSentTime,
    };
  }

  public updateLastSentTime(): void {
    this.lastSentTime = Date.now();
  }
}
