export interface ITrackerConfig {
  apiEndpoint: string;
  siteId: string;
  debugMode: boolean;
}

export interface IPageVisit {
  path: string;
  startTime: number;
  duration: number;
}

export interface ITrackingData {
  siteId: string;
  sessionId: string;
  phoneNumber: string | null;
  sessionStart: number;
  sessionEnd: number;
  currentPage: {
    path: string | null;
    duration: number;
  };
  pageVisits: IPageVisit[];
  timeSinceLastSent: number | null;
  isDebugMode: boolean;
  capture: Record<string, any>;
}

export interface ICaptureEvent {
  name: string;
  data: any;
  time: number;
}
