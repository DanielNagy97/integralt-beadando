import { SocketMessage } from "./models/socketMessage";


export class PlayerSocketConnection {
  private static instance: PlayerSocketConnection;
  socket: WebSocket;

  private constructor() {
    this.socket = new WebSocket("ws://" + window.location.hostname + ":9000");
  }

  connect = () => {
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