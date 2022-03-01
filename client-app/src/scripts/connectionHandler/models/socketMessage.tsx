import { RequestType } from "./requestType";


export interface SocketMessage {
  type: RequestType,
  payload: any
}