import { GameTypes } from "../../../../enums/game-types"
import { Button, GameState } from "../custom-types"


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
  gameStates: Array<GameState>
}
