import { GameTypes } from "../../../../enums/game-types";
import { Errorcode } from "./errorCodes";

export interface ErrorPayload {
  errorCode: Errorcode,
  errorDetails: any
}

export interface NameExistsErrorPayload extends ErrorPayload {
  errorCode: Errorcode.nameExists,
  errorDetails: {
    name: string
  }
}

export interface IdNotExistsErrorPayload extends ErrorPayload {
  errorCode: Errorcode.idNotExists,
  errorDetails: {
    id: string
  }
}

export interface IdForAnotherMatchErrorPayload extends ErrorPayload {
  errorCode: Errorcode.idForAnotherMatch,
  errorDetails: {
    gameid: string
  }
}

export interface NoSuchMatchErrorPayload extends ErrorPayload {
  errorCode: Errorcode.noSuchMatch,
  errorDetails: {
    gameid: string
  }
}

export interface WrongGameTypeErrorPayload extends ErrorPayload {
  errorCode: Errorcode.wrongGameType,
  errorDetails: {
    gameType: GameTypes
  }
}