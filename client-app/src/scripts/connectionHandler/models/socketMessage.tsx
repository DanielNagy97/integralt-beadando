import { MessageType } from "./requestType";


export interface SocketMessage {
  type: MessageType,
  payload: any
}