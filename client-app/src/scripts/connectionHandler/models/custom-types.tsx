

export interface Button {
  color: "red",
  id: String,
  pos: Float32Array
}

export interface MoveAction {
  button: { color: String, id: String },
  direction: Float32Array
}

export interface GameState {
  gameState: {
    buttons: Array<Button>
  },
  timestamp: Date
}
