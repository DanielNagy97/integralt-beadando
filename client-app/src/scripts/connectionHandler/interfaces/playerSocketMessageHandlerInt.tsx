import { PlayerListPayload } from "../models/responses";
import { NewPlayerPayload } from "../models/responses";

export interface PlayerSocketMessageHandlerInt {
  newPlayer(name: String): void,
  playerList(id: String): void,
  leaving(id: String): void,

  onOpen(): void,
  onClose(): void,
  //onMessage(message: MessageEvent<any>): void,
  onNewPlayer(payload: NewPlayerPayload): void,
  onPlayerList(payload: PlayerListPayload): void
}