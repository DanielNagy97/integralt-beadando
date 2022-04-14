import { GameTypes } from "../../enums/game-types";
import { MoveAction } from "./models/custom-types";
import { CreateRequest, EndGameRequest, JoinRequest, LeavingRequest, MoveRequest, NewPlayerRequest, PlayerListRequest } from "./models/requests/requests";
import { MessageType } from "./models/requestType";
import { PlayerSocketConnection } from "./socketConnection";


export class MessageSender {
  socketConnection: PlayerSocketConnection;

  constructor(){
    this.socketConnection = PlayerSocketConnection.getInstance();
  }

  sendNewPlayerRequest(name: string): void {
    const message: NewPlayerRequest = {
      type: MessageType.newPlayer,
      payload: {
        name: name
      }
    };
    this.socketConnection.send(message);
  }

  sendPlayerListRequest(id: string): void {
    const message: PlayerListRequest = {
      type: MessageType.playerList,
      payload: {
        id: id
      }
    };
    this.socketConnection.send(message);
  }

  sendLeavingRequest(id: string): void {
    const message: LeavingRequest = {
      type: MessageType.leaving,
      payload: {
        id: id
      }
    };
    this.socketConnection.send(message);
  }

  sendCreateRequest(id: string, gameType: GameTypes): void {
    const message: CreateRequest = {
      type: MessageType.create,
      payload: {
        id: id,
        gameType: gameType
      }
    };
    this.socketConnection.send(message);
  }

  sendJoinRequest(id: string, gameId: string): void {
    const message: JoinRequest = {
      type: MessageType.join,
      payload: {
        id: id,
        gameId: gameId
      }
    };
    this.socketConnection.send(message);
  }

  sendMoveRequest(id: string, gameId: string, moveAction: MoveAction) {
    const message: MoveRequest = {
      type: MessageType.move,
      payload: {
        id: id,
        gameId: gameId,
        moveAction: moveAction
      }
    };
    this.socketConnection.send(message);
  }

  sendEndGameRequest(id: string) {
    const message: EndGameRequest = {
      type: MessageType.endGame,
      payload: {
        id: id
      }
    };
    this.socketConnection.send(message);
  }
}