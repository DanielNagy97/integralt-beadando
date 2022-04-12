

export interface Button {
  color: string,
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

export interface Score {
  red: number,
  blue: number
}