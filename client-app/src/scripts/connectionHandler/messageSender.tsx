import { GameTypes } from "../../enums/game-types";
import { MoveAction } from "./models/custom-types";
import { CreateRequest, JoinRequest, LeavingRequest, MoveRequest, NewPlayerRequest, PlayerListRequest } from "./models/requests/requests";
import { MessageType } from "./models/requestType";
import { PlayerSocketConnection } from "./socketConnection";


export class MessageSender {
  socketConnection: PlayerSocketConnection;

  constructor(){
    this.socketConnection = PlayerSocketConnection.getInstance();
  }

  sendNewPlayerRequest(name: String): void {
    const message: NewPlayerRequest = {
      type: MessageType.newPlayer,
      payload: {
        name: name
      }
    };
    this.socketConnection.send(message);
  }

  sendPlayerListRequest(id: String): void {
    const message: PlayerListRequest = {
      type: MessageType.playerList,
      payload: {
        id: id
      }
    };
    this.socketConnection.send(message);
  }

  sendLeavingRequest(id: String): void {
    const message: LeavingRequest = {
      type: MessageType.leaving,
      payload: {
        id: id
      }
    };
    this.socketConnection.send(message);
  }

  sendCreateRequest(id: String, gameType: GameTypes): void {
    const message: CreateRequest = {
      type: MessageType.create,
      payload: {
        id: id,
        gameType: gameType
      }
    };
    this.socketConnection.send(message);
  }

  sendJoinRequest(id: String, gameId: String): void {
    const message: JoinRequest = {
      type: MessageType.join,
      payload: {
        id: id,
        gameId: gameId
      }
    };
    this.socketConnection.send(message);
  }

  sendMoveRequest(id: String, moveAction: MoveAction) {
    const message: MoveRequest = {
      type: MessageType.move,
      payload: {
        id: id,
        moveAction: moveAction
      }
    }
    this.socketConnection.send(message);
  }
}