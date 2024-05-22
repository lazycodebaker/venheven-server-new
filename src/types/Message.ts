import { AddressType, UserType } from "./User"

 

export interface IMessage {
      success: boolean,
      message: string,
      extras: UserType | AddressType | null
      token? : string,
      errorType: string | null
};
