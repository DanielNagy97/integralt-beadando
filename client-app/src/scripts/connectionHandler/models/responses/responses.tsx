import { RequestType } from "../requestType";
import { SocketMessage } from "../socketMessage";
import { JoinResponsePayload, MoveResponsePayLoad, NewPlayerResponsePayload, PlayerListResponsePayload } from "./payloads";


export interface newPlayerResponse extends SocketMessage {
  type: RequestType.newPlayer,
  payload: NewPlayerResponsePayload
}

export interface playerListResponse extends SocketMessage {
  type: RequestType.playerList,
  payload: PlayerListResponsePayload
}

export interface JoinResponse extends SocketMessage {
  type: RequestType.join,
  payload: JoinResponsePayload
}

export interface MoveResponse extends SocketMessage {
  type: RequestType.move,
  payload: MoveResponsePayLoad
}