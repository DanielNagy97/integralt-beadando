import { MessageType } from "../requestType";
import { SocketMessage } from "../socketMessage";
import { IdForAnotherMatchErrorPayload, IdNotExistsErrorPayload, NameExistsErrorPayload, NoSuchMatchErrorPayload, WrongGameTypeErrorPayload } from "./payloads";


export interface NameExistsError extends SocketMessage {
  type: MessageType.error,
  payload: NameExistsErrorPayload
}

export interface IdNotExistsError extends SocketMessage {
  type: MessageType.error,
  payload: IdNotExistsErrorPayload
}

export interface IdForAnotherMatchError extends SocketMessage {
  type: MessageType.error,
  payload: IdForAnotherMatchErrorPayload
}

export interface NoSuchMatchError extends SocketMessage {
  type: MessageType.error,
  payload: NoSuchMatchErrorPayload
}

export interface WrongGameTypeError extends SocketMessage {
  type: MessageType.error,
  payload: WrongGameTypeErrorPayload
}