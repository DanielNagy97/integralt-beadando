import { RequestType } from "../requestType";
import { SocketMessage } from "../socketMessage";
import { JoinRequestPayload, LeavingRequestPayload, MoveRequestPayLoad, NewPlayerRequestPayload, PlayerListRequestPayload } from "./payloads";


export interface NewPlayerRequest extends SocketMessage {
  type: RequestType.newPlayer,
  payload: NewPlayerRequestPayload
}

export interface PlayerListRequest extends SocketMessage {
  type: RequestType.playerList,
  payload: PlayerListRequestPayload
}

export interface LeavingRequest extends SocketMessage {
  type: RequestType.leaving,
  payload: LeavingRequestPayload
}

export interface JoinRequest extends SocketMessage {
  type: RequestType.join,
  payload: JoinRequestPayload
}

export interface MoveRequest extends SocketMessage {
  type: RequestType.move,
  payload: MoveRequestPayLoad
}