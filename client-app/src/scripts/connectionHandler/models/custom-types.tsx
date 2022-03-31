

export interface Button {
  color: "red",
  id: string,
  pos: [number, number]
}

export interface MoveAction {
  button: { color: string, id: string },
  direction: [number, number]
}

export interface GameState {
  gameState: {
    buttons: Button[]
  },
  timestamp: number
}
