import { IPageVisit } from "./types/tracker.types";

export class PageTracker {
  private pageVisits: IPageVisit[] = [];
  private currentPage: string | null = null;
  private currentPageStartTime: number | null = null;

  constructor() {
    this.setupPageTracking();
  }

  private setupPageTracking(): void {
    this.trackPageVisit();
    this.setupSPATracking();
    window.addEventListener("popstate", () => this.trackPageVisit());
  }

  private setupSPATracking(): void {
    let lastUrl = window.location.href;
    new MutationObserver(() => {
      const url = window.location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this.trackPageVisit();
      }
    }).observe(document, { subtree: true, childList: true });
  }

  public trackPageVisit(): void {
    if (this.currentPage) {
      const duration = Date.now() - (this.currentPageStartTime || 0);
      this.pageVisits.push({
        path: this.currentPage,
        startTime: this.currentPageStartTime || 0,
        duration,
      });
    }

    this.currentPage = window.location.pathname + window.location.hash;
    this.currentPageStartTime = Date.now();
  }

  public getTrackingData() {
    return {
      currentPage: {
        path: this.currentPage,
        duration: this.currentPageStartTime
          ? Date.now() - this.currentPageStartTime
          : 0,
      },
      pageVisits: [...this.pageVisits],
    };
  }
}
