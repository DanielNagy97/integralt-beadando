import React from 'react';
import * as BS from 'react-bootstrap';
import './game.css'
import { Player } from '../../models/player';
import { Pages } from '../../enums/pages';
import { PlayerSocketMessageHandler } from '../../scripts/connectionHandler/playerSocketMessageHandler';

export interface Button {
  color: string,
  id: string,
  pos: [number, number],
  radius: number
}

export interface GameProps{
  onPageChange: Function;
  player: Player;
  messageHandler: PlayerSocketMessageHandler;
}

export interface GameStates{
  buttonsExample: Button[];
}

class Game extends React.Component<GameProps, GameStates> {
  constructor(props: GameProps){
    super(props)

    this.state = {
      buttonsExample: [
        {color: "red", id: "0", pos: [70, 250], radius: 20},
        {color: "red", id: "1", pos: [250, 160], radius: 20},
        {color: "red", id: "2", pos: [250, 340], radius: 20},
        {color: "red", id: "3", pos: [430, 70], radius: 20},
        {color: "red", id: "4", pos: [430, 250], radius: 20},
        {color: "red", id: "5", pos: [430, 430], radius: 20},
        {color: "blue", id: "6", pos: [930, 250], radius: 20},
        {color: "blue", id: "7", pos: [750, 160], radius: 20},
        {color: "blue", id: "8", pos: [750, 340], radius: 20},
        {color: "blue", id: "9", pos: [570, 70], radius: 20},
        {color: "blue", id: "10", pos: [570, 250], radius: 20},
        {color: "blue", id: "11", pos: [570, 430], radius: 20},
        {color: "white", id: "-1", pos: [500, 250], radius: 10}
      ]
    }
  }

  componentDidMount() {
    this.draw()
  }

  leaveGame() {
    this.props.messageHandler.sender.leaving(this.props.player.id);
    this.props.onPageChange(Pages.CONNECT);
  }

  draw = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    if (ctx !== null) {
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
    console.log(this.props.player)
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