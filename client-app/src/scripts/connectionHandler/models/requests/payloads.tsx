import { GameTypes } from "../../../../enums/game-types";
import { MoveAction } from "../custom-types";


export interface NewPlayerRequestPayload {
  name: String
}

export interface PlayerListRequestPayload {
  id: String
}

export interface LeavingRequestPayload {
  id: String
}

export interface JoinRequestPayload {
  gameType: GameTypes
}

export interface MoveRequestPayLoad {
  playerId: String,
  moveAction: MoveAction
}