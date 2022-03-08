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

// Eddig jó

export interface CreateRequestPayload {
  id: String,
  gameType: GameTypes
}

export interface JoinRequestPayload {
  id: String,
  gameId: String
}

export interface MoveRequestPayLoad {
  id: String,
  moveAction: MoveAction
}