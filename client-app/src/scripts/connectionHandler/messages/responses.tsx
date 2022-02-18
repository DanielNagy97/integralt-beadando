import { RequestType } from "./requestType";
import { SocketMessage } from "./socketMessage";


export interface NewPlayerPayload {
  id: String
}

export interface PlayerListPayload {
  list: Array<String>
}

export interface newPlayerResponse extends SocketMessage {
  type: RequestType.newPlayer,
  payload: NewPlayerPayload
}

export interface playerListResponse extends SocketMessage {
  type: RequestType.playerList,
  payload: PlayerListPayload
}
