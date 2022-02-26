import { PlayerSocketMessageHandlerInt } from "./interfaces/playerSocketMessageHandlerInt";
import { leavingRequest, newPlayerRequest, playerListRequest } from "./models/requests";
import { RequestType } from "./models/requestType";
import { PlayerSocketConnection } from "./socketConnection";
import { NewPlayerPayload, PlayerListPayload } from "./models/responses";
import { SocketMessage } from "./models/socketMessage";


export class PlayerSocketMessageHandler implements PlayerSocketMessageHandlerInt {
  socketConnection: PlayerSocketConnection;

  constructor() {
    this.socketConnection = PlayerSocketConnection.getInstance();
    this.socketConnection.socket.onopen = this.onOpen;
    this.socketConnection.socket.onclose = this.onClose;
    this.socketConnection.socket.onmessage = this.onMessage;
  }

  onOpen() {
    // TODO: Pass the result to the component!
    console.log("Connected to server!");
  }

  onClose() {
    // TODO: Pass the result to the component!
    console.log("Disconected from server!");
  }

  onMessage(message: MessageEvent<any>) {
    const response: SocketMessage = JSON.parse(message.data);

    if (response.type === RequestType.newPlayer) {
      
      const payload: NewPlayerPayload = response.payload;
      /*
      this.setState({
        player: {
          ...this.state.player,
          id: payload.id
        }
      });
      */
      console.log(payload);
    }
    else if (response.type === RequestType.playerList) {
      const payload: PlayerListPayload = response.payload;
      console.log(payload);
    }
  }

  getSocket(): WebSocket {
    return this.socketConnection.socket;
  }

  newPlayer(name: String): void {
    const message: newPlayerRequest = {
      type: RequestType.newPlayer,
      payload: {
        name: name
      }
    };
    this.socketConnection.send(message);
  }

  playerList(id: String): void {
    const message: playerListRequest = {
      type: RequestType.playerList,
      payload: {
        id: id
      }
    };
    this.socketConnection.send(message);
  }

  leaving(id: String): void {
    const message: leavingRequest = {
      type: RequestType.leaving,
      payload: {
        id: id
      }
    };
    this.socketConnection.send(message);
  }

  onNewPlayer(payload: NewPlayerPayload): void {
    // TODO: Pass the result to the component!
    console.log("new player added with id:" + payload.id);
  }

  onPlayerList(payload: PlayerListPayload): void {
    // TODO: Pass the result to the component!
    console.log("list of players:" + payload.list);
  }
}
