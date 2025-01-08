import { EventCapture } from "./EventCapture";
import { OncoTracker } from "./OncoTracker";
import { PageTracker } from "./PageTracker";
import { TrackerConfig } from "./TrackerConfig";
import { UserSession } from "./UserSession";
import { applyMixins } from "./utils";

class RallybaseTracker extends OncoTracker {}
interface RallybaseTracker extends OncoTracker {}

applyMixins(RallybaseTracker, [OncoTracker, PageTracker, EventCapture, UserSession, TrackerConfig]);

export default RallybaseTracker;