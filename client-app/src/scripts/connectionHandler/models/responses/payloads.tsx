import { GameTypes } from "../../../../enums/game-types"
import { Button, GameState } from "../custom-types"


export interface NewPlayerResponsePayload {
  id: String
}

export interface PlayerListResponsePayload {
  list: Array<String>
}

// Eddig jó

export interface CreateResponsePayload {
  gameId: String
}

export interface JoinResponsePayload {
  gameType: GameTypes,
  gameState: {
    buttons: Array<Button>
  }
}

export interface MoveResponsePayLoad {
  playerId: String,
  gameStates: Array<GameState>
}
