import { GameTypes } from "../../../../enums/game-types";
import { Errorcode } from "./errorCodes";

export interface ErrorPayload {
  errorId: Errorcode,
  errorDetails: any
}

export interface NameExistsErrorPayload extends ErrorPayload {
  errorId: Errorcode.nameExists,
  errorDetails: {
    name: string
  }
}

export interface IdNotExistsErrorPayload extends ErrorPayload {
  errorId: Errorcode.idNotExists,
  errorDetails: {
    id: string
  }
}

export interface IdForAnotherMatchErrorPayload extends ErrorPayload {
  errorId: Errorcode.idForAnotherMatch,
  errorDetails: {
    gameid: string
  }
}

export interface NoSuchMatchErrorPayload extends ErrorPayload {
  errorId: Errorcode.noSuchMatch,
  errorDetails: {
    gameid: string
  }
}

export interface WrongGameTypeErrorPayload extends ErrorPayload {
  errorId: Errorcode.wrongGameType,
  errorDetails: {
    gameType: GameTypes
  }
}