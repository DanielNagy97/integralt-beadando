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

    switch (payload.errorCode) {
      case Errorcode.nameExists:
        errorMessageObject = {
          message: "The name: " + payload.errorDetails.name + " already exists!",
          type: "danger",
          headerMessage: "Error"
        }
        break;

      default:
        errorMessageObject = {
          message: "Unknown error: " + payload.errorCode,
          type: "warning",
          headerMessage: "Unknown Error"
        }
        break;
    }
    return errorMessageObject;
  }
}