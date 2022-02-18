import { SocketMessage } from "../messages/socketMessage";

export interface SocketConnectionInt {
  socket: WebSocket,
  send(request: SocketMessage): void
}