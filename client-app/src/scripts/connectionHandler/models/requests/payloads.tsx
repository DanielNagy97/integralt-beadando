import { GameTypes } from "../../../../enums/game-types";
import { MoveAction } from "../custom-types";


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

export interface MovePayLoad {
  playerId: String,
  moveAction: MoveAction
}