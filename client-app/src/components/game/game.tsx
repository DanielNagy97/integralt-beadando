import React from 'react';
import * as BS from 'react-bootstrap';
import './game.css'
import { Player } from '../../models/player';
import { Pages } from '../../enums/pages';
import { PlayerSocketMessageHandler } from '../../scripts/connectionHandler/playerSocketMessageHandler';
import { JoinResponsePayload, MoveResponsePayLoad } from '../../scripts/connectionHandler/models/responses/payloads';
import { MessageType } from '../../scripts/connectionHandler/models/requestType';
import { GameState } from '../../scripts/connectionHandler/models/custom-types';

export interface Button {
  color: string,
  id: string,
  pos: [number, number],
  radius: number
}

export interface GameProps{
  onPageChange: Function;
  player: Player;
  joinPayload: JoinResponsePayload;
  gameId: string;
  messageHandler: PlayerSocketMessageHandler;
}

export interface GameStates{
  buttonsExample: Button[];
  gameStates: Array<GameState>;
}

class Game extends React.Component<GameProps, GameStates> {
  constructor(props: GameProps){
    super(props)

    this.state = {
      buttonsExample: [],
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
    this.makeInitialState();
    this.draw()
  }

  componentDidUpdate() {
    // Drawing on state change
    this.draw();
  }

  makeInitialState = () => {
    let buttonsExample: Button[] = this.props.joinPayload.gameState.buttons.map((button) => {
      return button.color === "red" || button.color === "blue" ? {...button, radius: 20} : {...button, radius: 10};
    });
    this.setState({
      buttonsExample: buttonsExample
    })
  }

  leaveGame() {
    this.props.messageHandler.sender.sendLeavingRequest(this.props.player.id);
    this.props.onPageChange(Pages.CONNECT);
  }

  draw = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    if (ctx !== null) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clearing the canvas
      for (let button of this.state.buttonsExample) {
        ctx.beginPath();
        ctx.fillStyle = button.color;
        ctx.arc(button.pos[0], button.pos[1],                        
                button.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
      
    }
  }

  render() {
    return (
        <div className={'gameComponent'}>
          <div className={'gameNameContainer'}>
            <div className={'gameFirstName'}>
              {this.props.player.name}
            </div>
            <div className={'gameSecondName'}>
              AI
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