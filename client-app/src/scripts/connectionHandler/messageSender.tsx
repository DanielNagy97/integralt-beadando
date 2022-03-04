import { GameTypes } from "../../enums/game-types";
import { JoinRequest, LeavingRequest, MoveAction, MoveRequest, NewPlayerRequest, PlayerListRequest } from "./models/requests";
import { RequestType } from "./models/requestType";
import { PlayerSocketConnection } from "./socketConnection";


export class MessageSender {
  socketConnection: PlayerSocketConnection;

  constructor(){
    this.socketConnection = PlayerSocketConnection.getInstance();
  }

  sendNewPlayerRequest(name: String): void {
    const message: NewPlayerRequest = {
      type: RequestType.newPlayer,
      payload: {
        name: name
      }
    };
    this.socketConnection.send(message);
  }

  sendPlayerListRequest(id: String): void {
    const message: PlayerListRequest = {
      type: RequestType.playerList,
      payload: {
        id: id
      }
    };
    this.socketConnection.send(message);
  }

  sendLeavingRequest(id: String): void {
    const message: LeavingRequest = {
      type: RequestType.leaving,
      payload: {
        id: id
      }
    };
    this.socketConnection.send(message);
  }

  sendJoinRequest(gameType: GameTypes): void {
    const message: JoinRequest = {
      type: RequestType.join,
      payload: {
        gameType: gameType
      }
    };
    this.socketConnection.send(message);
  }

  sendMoveRequest(id: String, moveAction: MoveAction) {
    const message: MoveRequest = {
      type: RequestType.move,
      payload: {
        playerId: id,
        moveAction: moveAction
      }
    }
    this.socketConnection.send(message);
  }
}