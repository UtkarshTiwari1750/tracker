import { Base, Config } from "../../base";
import { UserType } from "./type";

export class User extends Base {
  private userData: UserType;

  constructor(config: Config, user?: UserType) {
    super(config);
    this.userData = {
      phoneNumber: user?.phoneNumber || null,
      sessionStart: user?.sessionStart || null,
      sessionId: user?.sessionId || null,
      pageVisits: user?.pageVisits || [],
      currentPage: user?.currentPage || null,
      currentPageStartTime: user?.currentPageStartTime || null,
      lastSentTime: user?.lastSentTime || null,
      capture: user?.capture || {},
    };
  }

  setPhoneNumber = (phoneNumber: string) => {
    this.userData.phoneNumber = phoneNumber;
  };

  protected getUser = () => {
    return this.userData;
  }

  
}
