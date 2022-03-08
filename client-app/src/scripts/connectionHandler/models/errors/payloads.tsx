import { GameTypes } from "../../../../enums/game-types";
import { Errorcode } from "./errorCodes";

interface ErrorPayload {
  errorCode: Errorcode,
  errorDetails: any
}

export interface NameExistsErrorPayload extends ErrorPayload {
  errorCode: Errorcode.nameExists,
  errorDetails: {
    name: String
  }
}

export interface IdNotExistsErrorPayload extends ErrorPayload {
  errorCode: Errorcode.idNotExists,
  errorDetails: {
    id: String
  }
}

export interface IdForAnotherMatchErrorPayload extends ErrorPayload {
  errorCode: Errorcode.idForAnotherMatch,
  errorDetails: {
    gameid: String
  }
}

export interface NoSuchMatchErrorPayload extends ErrorPayload {
  errorCode: Errorcode.noSuchMatch,
  errorDetails: {
    gameid: String
  }
}

export interface WrongGameTypeErrorPayload extends ErrorPayload {
  errorCode: Errorcode.wrongGameType,
  errorDetails: {
    gameType: GameTypes
  }
}