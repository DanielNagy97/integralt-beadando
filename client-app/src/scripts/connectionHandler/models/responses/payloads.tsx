import { Button, GameState } from "../custom-types"


export interface NewPlayerResponsePayload {
  id: String
}

export interface PlayerListResponsePayload {
  list: Array<String>
}

export interface JoinResponsePayload {
  gameId: String,
  gameState: {
    buttons: Array<Button>
  }
}

export interface MoveResponsePayLoad {
  playerId: String,
  gameStates: Array<GameState>
}
