import { Post } from "@/post/type";
import { Base, Config } from "../../base";
import { UserType } from "../user/type";
import { User } from "../user/user";

export class Tracker extends User {
  private trackingInterval: NodeJS.Timeout | undefined;

  constructor(config: Config, userData: UserType) {
    super(config, userData);
    this.trackingInterval = undefined;
  }

  async sendTrackingData() {
    
    const userData: UserType = this.getUser();
    const config:Config = this.getConfig()
    if (!userData.phoneNumber || !userData.currentPageStartTime || !userData.lastSentTime) return; // Only send data if we have a phone number

    // Add the last page visit duration
    const currentPageDuration = Date.now() - userData.currentPageStartTime;
    const trackingData = {
      siteId: config.siteId,
      sessionId: userData.sessionId,
      phoneNumber: userData.phoneNumber,
      sessionStart: userData.sessionStart,
      sessionEnd: Date.now(),
      currentPage: {
        path: userData.currentPage,
        duration: currentPageDuration,
      },
      pageVisits: [...userData.pageVisits],
      timeSinceLastSent: userData.lastSentTime
        ? Date.now() - userData.lastSentTime
        : null,
      isDebugMode: config.debugMode,
      capture: userData.capture,
    };


    try {
      const response = await this.invoke("/tracking", {
        method: "POST",
        body: JSON.stringify(trackingData),
      }); 
      
      // if (!response.ok) {
      //   console.error("Failed to send tracking data");
      // } else {
      //   userData.lastSentTime = Date.now();
      // }
    } catch (error) {
      console.error("Error sending tracking data:", error);
    }
  }

  startTracking(debugMode: boolean) {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }

    // Set interval based on mode
    const interval = debugMode ? 2000 : 30000;
    this.trackingInterval = setInterval(this.sendTrackingData, interval);

    // Update config
    this.setConfig({ ...this.getConfig(), debugMode });
  }

  


  
}
