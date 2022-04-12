import React from 'react';
import * as BS from 'react-bootstrap';
import './game.css'
import { Player } from '../../models/player';
import { Pages } from '../../enums/pages';
import { GameTypes } from '../../enums/game-types';
import { PlayerSocketMessageHandler } from '../../scripts/connectionHandler/playerSocketMessageHandler';
import { EndGameResponsePayLoad, JoinResponsePayload, MoveResponsePayLoad } from '../../scripts/connectionHandler/models/responses/payloads';
import { MessageType } from '../../scripts/connectionHandler/models/requestType';
import { GameState } from '../../scripts/connectionHandler/models/custom-types';
import LoadingSpin from "react-loading-spin";

export interface Button {
  color: string,
  id: string,
  pos: [number, number]
}

export interface GameProps {
  onPageChange: Function;
  player: Player;
  joinPayload: JoinResponsePayload;
  gameId: string;
  messageHandler: PlayerSocketMessageHandler;
}

export interface GameStates {
  buttons: Button[];
  gameStates: Array<GameState>;
  loadedImageCounter: number;
}

class Game extends React.Component<GameProps, GameStates> {
  constructor(props: GameProps) {
    super(props)

    this.state = {
      buttons: this.props.joinPayload.gameState.buttons,
      gameStates: [],
      loadedImageCounter: 0
    }
  }

  setButtonsForFrame(newButtons: Button[], duration: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setState({
          buttons: newButtons
        })
        resolve("anything");
      }, duration);
    });
  }

  componentDidMount() {
    this.props.messageHandler.receiver.onMessages.set(MessageType.move,
      (payload: MoveResponsePayLoad) => {
        let framePromises: Promise<any>[] = [];
        payload.gameStates.forEach(gameState => {
          framePromises.push(this.setButtonsForFrame(gameState.gameState.buttons, gameState.timestamp))
        })

        Promise.all(framePromises).then(() => {
          // All frames were drawn, requesting a new move
          // Note: This will go on until thee is a move answer from the server!
          this.move();
        });
      }
    );
    // Sending an endGame message to the server:
    // this.props.messageHandler.sender.sendEndGameRequest(this.props.player.id, this.props.gameId);
    // The final message from the server (The response of the endGame)
    this.props.messageHandler.receiver.onMessages.set(MessageType.endGame,
      (payload: EndGameResponsePayLoad) => {
        console.log(payload.finalScore);
      }
    );
    
    this.preloadImages();
  }

  componentDidUpdate() {
    // Drawing on state change
    if (this.state.loadedImageCounter === 3) {
      this.draw();
    }
  }

  move() {
    this.props.messageHandler.sender.sendMoveRequest(
      this.props.player.id, this.props.gameId,
      {
        button: { color: "blue", id: "2" },
        direction: [100, 100]
      }
    )
  }

  leaveGame() {
    this.props.messageHandler.sender.sendLeavingRequest(this.props.player.id);
    this.props.onPageChange(Pages.CONNECT);
  }

  //Preloading images and counting how many is loaded. If we get all 3 we will draw the game. Until then a loading spin showed
  preloadImages = () => {
    let links = ["blue_ball.png", "red_ball.png", "white_ball.png"]

    links.forEach(link => {
      var img = new Image()
      img.onload = () => this.setState({ loadedImageCounter: this.state.loadedImageCounter + 1 })
      img.src = link
    });
  }

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
        ctx.drawImage(img, button.pos[0] - radius, button.pos[1] - radius)

        ctx.restore();
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.loadedImageCounter !== 3 &&
          <div style={{ margin: 'auto', padding: '15%', textAlign: 'center' }}>
            <LoadingSpin
              width={'10px'}
              size={'200px'}
              primaryColor={'#dc3545'}
              secondaryColor={'#dbadb1'}
            />
          </div>
        }
        {
          this.state.loadedImageCounter === 3 &&
          <div className={'gameComponent'}>
            <div className={'gameNameContainer'}>
              <div className={'gameFirstName'}>
                {this.props.player.gameType === GameTypes.AI_VS_AI ? "AI" : this.props.player.name}
              </div>
              <div className={'gameSecondName'}>
                {this.props.player.gameType === GameTypes.PLAYER_VS_PLAYER ? "Other player's name" : "AI"}
              </div>
            </div>
            <div className={'gameSpace'}>
              <div style={{ padding: '20px' }}>
                <canvas id="canvas" width={1000} height={500} />
              </div>
            </div>
            <div className={'gameLeaveButtonContainer'}>
              <BS.Button variant="primary" onClick={() => this.move()}>
                move
              </BS.Button>
              <BS.Button variant="danger" onClick={() => this.leaveGame()}>
                Leave game
              </BS.Button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Game;