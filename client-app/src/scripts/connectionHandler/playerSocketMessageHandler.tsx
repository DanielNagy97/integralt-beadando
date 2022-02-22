import { PlayerSocketMessageHandlerInt } from "./interfaces/playerSocketMessageHandlerInt";
import { leavingRequest, newPlayerRequest, playerListRequest } from "./messages/requests";
import { RequestType } from "./messages/requestType";
import { PlayerSocketConnection } from "./socketConnection";
import { NewPlayerPayload, PlayerListPayload } from "./messages/responses";


export class PlayerSocketMessageHandler implements PlayerSocketMessageHandlerInt {

  socketConnection: PlayerSocketConnection;

  constructor() {
    this.socketConnection = PlayerSocketConnection.getInstance();

    this.socketConnection.socket.onopen = () => {
      // TODO: Pass the result to the component!
      console.log("Connected to server!");
    };

    this.socketConnection.socket.onclose = () => {
      // TODO: Pass the result to the component!
      console.log("Disconected from server!");
    };
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
