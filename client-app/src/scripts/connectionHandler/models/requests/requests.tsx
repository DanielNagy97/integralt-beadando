import { MessageType } from "../requestType";
import { SocketMessage } from "../socketMessage";
import { CreateRequestPayload, JoinRequestPayload, LeavingRequestPayload, MoveRequestPayLoad, NewPlayerRequestPayload, PlayerListRequestPayload } from "./payloads";


export interface NewPlayerRequest extends SocketMessage {
  type: MessageType.newPlayer,
  payload: NewPlayerRequestPayload
}

export interface PlayerListRequest extends SocketMessage {
  type: MessageType.playerList,
  payload: PlayerListRequestPayload
}

export interface LeavingRequest extends SocketMessage {
  type: MessageType.leaving,
  payload: LeavingRequestPayload
}

export interface CreateRequest extends SocketMessage {
  type: MessageType.create,
  payload: CreateRequestPayload
}

export interface JoinRequest extends SocketMessage {
  type: MessageType.join,
  payload: JoinRequestPayload
}

export interface MoveRequest extends SocketMessage {
  type: MessageType.move,
  payload: MoveRequestPayLoad
}