import { MessageType } from "../requestType";
import { SocketMessage } from "../socketMessage";
import { CreateResponsePayload, EndGameResponsePayLoad, JoinResponsePayload, MoveResponsePayLoad, NewPlayerResponsePayload, PlayerListResponsePayload } from "./payloads";


export interface newPlayerResponse extends SocketMessage {
  type: MessageType.newPlayer,
  payload: NewPlayerResponsePayload
}

export interface playerListResponse extends SocketMessage {
  type: MessageType.playerList,
  payload: PlayerListResponsePayload
}

export interface CreateResponse extends SocketMessage {
  type: MessageType.create,
  payload: CreateResponsePayload
}

export interface JoinResponse extends SocketMessage {
  type: MessageType.join,
  payload: JoinResponsePayload
}

export interface MoveResponse extends SocketMessage {
  type: MessageType.move,
  payload: MoveResponsePayLoad
}

export interface EndGameResponse extends SocketMessage {
  type: MessageType.endGame,
  payload: EndGameResponsePayLoad
}