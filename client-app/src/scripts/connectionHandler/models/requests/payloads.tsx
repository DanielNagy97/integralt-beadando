import { GameTypes } from "../../../../enums/game-types";
import { MoveAction } from "../custom-types";


export interface NewPlayerRequestPayload {
  name: string
}

export interface PlayerListRequestPayload {
  id: string
}

export interface LeavingRequestPayload {
  id: string
}

export interface CreateRequestPayload {
  id: string,
  gameType: GameTypes
}

export interface JoinRequestPayload {
  id: string,
  gameId: string
}

export interface MoveRequestPayLoad {
  id: string,
  gameId: string,
  moveAction: MoveAction
}

export interface EndGameRequestPayLoad {
  id: string,
  gameId: string
}