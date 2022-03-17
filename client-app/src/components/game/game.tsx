import React from 'react';
import * as BS from 'react-bootstrap';
import './game.css'
import { Player } from '../../models/player';
import { Pages } from '../../enums/pages';
import { PlayerSocketMessageHandler } from '../../scripts/connectionHandler/playerSocketMessageHandler';
import { JoinResponsePayload, MoveResponsePayLoad } from '../../scripts/connectionHandler/models/responses/payloads';
import { MessageType } from '../../scripts/connectionHandler/models/requestType';
import { GameState } from '../../scripts/connectionHandler/models/custom-types';
import { GameTypes } from '../../enums/game-types';

export interface Button {
  color: string,
  id: string,
  pos: [number, number]
}

export interface GameProps{
  onPageChange: Function;
  player: Player;
  joinPayload: JoinResponsePayload;
  gameId: string;
  messageHandler: PlayerSocketMessageHandler;
}

export interface GameStates{
  buttons: Button[];
  gameStates: Array<GameState>;
}

class Game extends React.Component<GameProps, GameStates> {
  constructor(props: GameProps){
    super(props)

    this.state = {
      buttons: this.props.joinPayload.gameState.buttons,
      gameStates: []
    }
  }

  componentDidMount() {
    this.props.messageHandler.receiver.onMessages.set(MessageType.move,
      (payload: MoveResponsePayLoad) => {
        this.setState({
          gameStates: payload.gameStates
        });
      }
    );
    this.draw()
  }

  componentDidUpdate() {
    // Drawing on state change
    this.draw();
  }

  leaveGame() {
    this.props.messageHandler.sender.sendLeavingRequest(this.props.player.id);
    this.props.onPageChange(Pages.CONNECT);
  }

  //TODO cache images
  draw = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    if (ctx !== null) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clearing the canvas
      for (let button of this.state.buttons) {
        let radius = button.color == 'white' ? 10 : 20;

        ctx.save();

        ctx.beginPath();
        ctx.arc(button.pos[0], button.pos[1], radius, 0, 2 * Math.PI);
        ctx.stroke()
        ctx.closePath();

        ctx.clip();

        var img = new Image();
        img.src = button.color === "blue" ? 'blue_ball.png' : button.color === "red" ? 'red_ball.png' : 'white_ball.png';
        ctx.drawImage(img, button.pos[0]-radius, button.pos[1]-radius)
        
        ctx.restore();
      }
    }
  }

  render() {
    return (
        <div className={'gameComponent'}>
          <div className={'gameNameContainer'}>
            <div className={'gameFirstName'}>
              {this.props.player.gameType === GameTypes.AI_VS_AI ? "AI": this.props.player.name}
            </div>
            <div className={'gameSecondName'}>
              {this.props.player.gameType === GameTypes.PLAYER_VS_PLAYER ? "Other player's name" : "AI"}
            </div>
          </div>
          <div className={'gameSpace'}>
            <div style={{padding: '20px'}}>
              <canvas id="canvas" width={1000} height={500} />
            </div>
          </div>
          <div className={'gameLeaveButtonContainer'}>
            <BS.Button variant="danger" onClick={() => this.leaveGame()}>
                  Leave game
            </BS.Button>
          </div>
        </div>
    );
  }
}

export default Game;