import { GameTypes } from "../../../enums/game-types";
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

export interface JoinPayload {
  gameType: GameTypes
}

export interface MoveAction {
  button: {color: String, id: String},
  direction: Float32Array
}

export interface MovePayLoad {
  playerId: String,
  moveAction: MoveAction
}

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