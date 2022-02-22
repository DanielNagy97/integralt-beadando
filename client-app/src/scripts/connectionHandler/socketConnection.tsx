import { SocketConnectionInt } from "./interfaces/socketConnectionInt";
import { SocketMessage } from "./messages/socketMessage";


export class PlayerSocketConnection implements SocketConnectionInt {
  private static instance: PlayerSocketConnection;
  socket: WebSocket;

  private constructor() {
    this.socket = new WebSocket("ws://" + window.location.hostname + ":9000");
  }

  public static getInstance(): PlayerSocketConnection {
    if (this.instance == null) {
      this.instance = new PlayerSocketConnection();
    }
    return this.instance;
  }

  send(request: SocketMessage): void {
    this.socket.send(JSON.stringify(request));
  }

}