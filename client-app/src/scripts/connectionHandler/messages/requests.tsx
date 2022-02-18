import { RequestType } from "./requestType";
import { SocketMessage } from "./socketMessage";


export interface NewPlayerPayload {
  name: String
}

export interface PlayerListPayload {
  id: String
}

export interface LeavingPayload {
  id: String
}

export interface newPlayerRequest extends SocketMessage {
  type: RequestType.newPlayer,
  payload: NewPlayerPayload
}

export interface playerListRequest extends SocketMessage {
  type: RequestType.playerList,
  payload: PlayerListPayload
}

export interface leavingRequest extends SocketMessage {
  type: RequestType.leaving,
  payload: LeavingPayload
}