import { Base } from "@/base";
import { Post, TrackingData } from "./type";

export class Posts extends Base {

  sendTrackingData(data: TrackingData): Promise<Post> {
    
    return this.invoke("/tracking", {
      method: "POST",
      body: JSON.stringify(data),
    }); 
  }
}
