export type Config = {
  siteId: string;
  baseUrl?: string;
  debugMode: boolean;
};

export abstract class Base {
  private siteId: string;
  private baseUrl: string;
  private debugMode: boolean;

  constructor(config: Config) {
    this.siteId = config.siteId;
    this.baseUrl = config.baseUrl || "http://localhost:3000/";
    this.debugMode = config.debugMode;
  }

  protected getConfig(): Config {
    return {
      siteId: this.siteId,
      baseUrl: this.baseUrl,
      debugMode: this.debugMode,
    };
  }

  protected setConfig(config: Config) {
    this.siteId = config.siteId;
    this.baseUrl = config.baseUrl || "http://localhost:3000/";
    this.debugMode = config.debugMode;
  }

  protected async invoke<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append('Authorization', `Bearer ${this.siteId}`);
    // headers.append('api-key', 'this.apiKey');

    const config = {
      ...options,
      headers,
    };

    return fetch(url, config)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} (${response.statusText})`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (this.debugMode) {
          console.log(`API Response: ${JSON.stringify(data)}`);
        }
        return data;
      })
      .catch((error) => {
        if (this.debugMode) {
          console.error(`API Error: ${error.message}`);
        }
        throw error;
      });
  }

}
