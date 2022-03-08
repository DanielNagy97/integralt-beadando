import { RequestType } from "../requestType";
import { SocketMessage } from "../socketMessage";
import { JoinPayload, LeavingPayload, MovePayLoad, NewPlayerPayload, PlayerListPayload } from "./payloads";


export interface NewPlayerRequest extends SocketMessage {
  type: RequestType.newPlayer,
  payload: NewPlayerPayload
}

export interface PlayerListRequest extends SocketMessage {
  type: RequestType.playerList,
  payload: PlayerListPayload
}

export interface LeavingRequest extends SocketMessage {
  type: RequestType.leaving,
  payload: LeavingPayload
}

export interface JoinRequest extends SocketMessage {
  type: RequestType.join,
  payload: JoinPayload
}

export interface MoveRequest extends SocketMessage {
  type: RequestType.move,
  payload: MovePayLoad
}