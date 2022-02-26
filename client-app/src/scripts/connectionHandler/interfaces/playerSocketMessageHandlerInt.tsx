import { PlayerListPayload } from "../models/responses";
import { NewPlayerPayload } from "../models/responses";

export interface PlayerSocketMessageHandlerInt {
  newPlayer(name: String): void,
  playerList(id: String): void,
  leaving(id: String): void,

  onNewPlayer(payload: NewPlayerPayload): void,
  onPlayerList(payload: PlayerListPayload): void
}