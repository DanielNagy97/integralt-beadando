import { Button, GameState } from "../custom-types"


export interface NewPlayerPayload {
  id: String
}

export interface PlayerListPayload {
  list: Array<String>
}

export interface JoinPayload {
  gameId: String,
  gameState: {
    buttons: Array<Button>
  }
}

export interface MovePayLoad {
  playerId: String,
  gameStates: Array<GameState>
}
