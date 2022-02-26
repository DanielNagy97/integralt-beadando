import { SocketMessage } from "../models/socketMessage";

export interface SocketConnectionInt {
  socket: WebSocket,
  send(request: SocketMessage): void
}