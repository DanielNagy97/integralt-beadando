import { RequestType } from "../requestType";
import { SocketMessage } from "../socketMessage";
import { JoinPayload, MovePayLoad, NewPlayerPayload, PlayerListPayload } from "./payloads";


export interface newPlayerResponse extends SocketMessage {
  type: RequestType.newPlayer,
  payload: NewPlayerPayload
}

export interface playerListResponse extends SocketMessage {
  type: RequestType.playerList,
  payload: PlayerListPayload
}

export interface JoinResponse extends SocketMessage {
  type: RequestType.join,
  payload: JoinPayload
}

export interface MoveResponse extends SocketMessage {
  type: RequestType.move,
  payload: MovePayLoad
}