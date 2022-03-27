import { Errorcode } from "../connectionHandler/models/errors/errorCodes";
import { ErrorPayload } from "../connectionHandler/models/errors/payloads";

export interface ErrorMessage {
  message: string,
  type: string,
  headerMessage: string
}

export class ErrorHandler {

  handleError = (payload: ErrorPayload): ErrorMessage => {
    let errorMessageObject: ErrorMessage = {
      message: '',
      type: '',
      headerMessage: ''
    }

    switch (payload.errorId) {
      case Errorcode.nameExists:
        errorMessageObject = {
          message: "The name: " + payload.errorDetails.name + " already exists!",
          type: "danger",
          headerMessage: "Error"
        }
        break;

      case Errorcode.idNotExists:
        errorMessageObject = {
          message: "The id: " + payload.errorDetails.id + " not exists!",
          type: "danger",
          headerMessage: "Error"
        }
        break;

      case Errorcode.idForAnotherMatch:
        errorMessageObject = {
          message: "The gameId: " + payload.errorDetails.gameId + " is for an another match!",
          type: "danger",
          headerMessage: "Error"
        }
        break;

      case Errorcode.noSuchMatch:
        errorMessageObject = {
          message: "There is no match with the id: " + payload.errorDetails.gameId + "!",
          type: "danger",
          headerMessage: "Error"
        }
        break;

      case Errorcode.wrongGameType:
        errorMessageObject = {
          message: "There selected gametype: " + payload.errorDetails.gameType + " is wrong!",
          type: "danger",
          headerMessage: "Error"
        }
        break;

      case Errorcode.onePlayerLeft:
        errorMessageObject = {
          message: "One player left from the game: " + payload.errorDetails.gameId + "!",
          type: "danger",
          headerMessage: "Error"
        }
        break;

      default:
        errorMessageObject = {
          message: "Unknown error: " + payload.errorId,
          type: "warning",
          headerMessage: "Unknown Error"
        }
        break;
    }
    return errorMessageObject;
  }
}