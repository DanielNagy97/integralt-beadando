import { GameTypes } from "../../../../enums/game-types"
import { Button, GameState, Score } from "../custom-types"


export interface NewPlayerResponsePayload {
  id: string
}

export interface PlayerListResponsePayload {
  list: Array<string>
}

export interface CreateResponsePayload {
  gameId: string
}

export interface JoinResponsePayload {
  gameType: GameTypes,
  gameState: {
    buttons: Array<Button>
  }
}

export interface MoveResponsePayLoad {
  playerId: string,
  gameStates: Array<GameState>,
  score: Score
}

export interface EndGameResponsePayLoad {
  gameId: number,
  finalScore: Score
}
