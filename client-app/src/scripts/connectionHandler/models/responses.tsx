import { RequestType } from "./requestType";
import { SocketMessage } from "./socketMessage";


export interface NewPlayerPayload {
  id: String
}

export interface PlayerListPayload {
  list: Array<String>
}

export interface Button {
  color: "red",
  id: String,
  pos: Float32Array
}

export interface JoinPayload {
  gameId: String,
  gameState: {
    buttons: Array<Button>
  }
}

export interface GameState {
  gameState: {
    buttons: Array<Button>
  },
  timestamp: Date
}

export interface MovePayLoad {
  playerId: String,
  gameStates: Array<GameState>
}

export interface newPlayerResponse extends SocketMessage {
  type: RequestType.newPlayer,
  payload: NewPlayerPayload
}

export interface playerListResponse extends SocketMessage {
  type: RequestType.playerList,
  payload: PlayerListPayload
}

export interface JoinResponse extends SocketMessage {
  type: RequestType.join,
  payload: JoinPayload
}

export interface MoveResponse extends SocketMessage {
  type: RequestType.move,
  payload: MovePayLoad
}