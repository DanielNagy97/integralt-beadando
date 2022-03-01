import { leavingRequest, newPlayerRequest, playerListRequest } from "./models/requests";
import { RequestType } from "./models/requestType";
import { PlayerSocketConnection } from "./socketConnection";


export class MessageSender {
  socketConnection: PlayerSocketConnection;

  constructor(){
    this.socketConnection = PlayerSocketConnection.getInstance();
  }

  sendNewPlayerRequest(name: String): void {
    const message: newPlayerRequest = {
      type: RequestType.newPlayer,
      payload: {
        name: name
      }
    };
    this.socketConnection.send(message);
  }

  sendPlayerListRequest(id: String): void {
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
}