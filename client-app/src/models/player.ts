import { GameTypes } from "../enums/game-types";

export interface Player {
    id: string,
    name: string,
    gameType: GameTypes
  }