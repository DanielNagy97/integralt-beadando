import React from 'react';
import * as BS from 'react-bootstrap';
import './game.css'
import { Player } from '../../models/player';
import { Pages } from '../../enums/pages';
import { GameTypes } from '../../enums/game-types';
import { GameSetting } from '../../enums/game-setting';
import { PlayerSocketMessageHandler } from '../../scripts/connectionHandler/playerSocketMessageHandler';
import { EndGameResponsePayLoad, JoinResponsePayload, MoveResponsePayLoad } from '../../scripts/connectionHandler/models/responses/payloads';
import { MessageType } from '../../scripts/connectionHandler/models/requestType';
import { GameState } from '../../scripts/connectionHandler/models/custom-types';
import LoadingSpin from "react-loading-spin";
import Countdown, {zeroPad, CountdownApi} from "react-countdown";

export interface Button {
  color: string,
  id: string,
  pos: [number, number]
}

export interface GameProps {
  onPageChange: Function;
  player: Player;
  gameId: string;
  messageHandler: PlayerSocketMessageHandler;
}

export interface GameStates {
  buttons: Button[];
  gameStates: Array<GameState>;
  loadedImageCounter: number;
  score: {
    red: number,
    blue: number
  };
  gameSetting: GameSetting;
  date: number;
  isFirstGame: boolean;
}

class Game extends React.Component<GameProps, GameStates> {
  constructor(props: GameProps) {
    super(props)

    this.state = {
      buttons: [],
      gameStates: [],
      loadedImageCounter: 0,
      score: {red: 0, blue: 0},
      gameSetting: GameSetting.BASE,
      date: Date.now(),
      isFirstGame: true,
    }
  }

  //Variable and method to set the API and the reference to the countdown.
  //This way we can start the timer when we want (in our case in the move function)
  countdownApi: CountdownApi | null = null;

  setRef = (countdown: Countdown | null): void => {
    if (countdown) {
      this.countdownApi = countdown.getApi();
    }
  };

  setButtonsForFrame(newButtons: Button[], duration: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if(this.state.gameSetting !== GameSetting.ENDED){
          this.setState({
            buttons: newButtons
          })
        }
        resolve("anything");
      }, duration);
    });
  }

  componentDidMount() {
    this.props.messageHandler.receiver.onMessages.set(MessageType.join,
      (payload: JoinResponsePayload) => {
        this.onGameStart(payload.gameState.buttons);
      }
    );

    this.props.messageHandler.receiver.onMessages.set(MessageType.move,
      (payload: MoveResponsePayLoad) => {
        if(this.state.gameSetting !== GameSetting.ENDED){
          let framePromises: Promise<any>[] = [];

          payload.gameStates.forEach(gameState => {
            framePromises.push(this.setButtonsForFrame(gameState.gameState.buttons, gameState.timestamp))
          })

          Promise.all(framePromises).then(() => {
            this.setState({
              score: payload.score
            });
            // All frames were drawn, requesting a new move
            this.move();
          });
        }
      }
    );

    // The final message from the server (The response of the endGame)
    this.props.messageHandler.receiver.onMessages.set(MessageType.endGame,
      (payload: EndGameResponsePayLoad) => {
        this.setState({score: payload.finalScore});
      }
    );
    
    this.preloadImages();
  }

  componentDidUpdate(prevProps: GameProps, prevState: GameStates) {
    if(prevProps.gameId != this.props.gameId) {
      // Joining to the new game
      this.props.messageHandler.sender.sendJoinRequest(this.props.player.id, this.props.gameId);
    }
    // Drawing on state change
    if (this.state.loadedImageCounter === 3) {
      this.draw();
    }
  }

  onGameStart(buttonsStartingPositions: Button[]) {
    this.countdownApi && this.countdownApi.start();
    this.setState({
      buttons: buttonsStartingPositions,
      isFirstGame: false,
      gameSetting: GameSetting.STARTED,
      date: Date.now()
    })

    this.move()
  }

  reStartGame() {
    // Creating a whole new game
    this.props.messageHandler.sender.sendCreateRequest(this.props.player.id, this.props.player.gameType);
  }

  startGame() {
    if(this.state.isFirstGame) {
      this.props.messageHandler.sender.sendJoinRequest(this.props.player.id, this.props.gameId);
    }
    else {
      this.reStartGame();
    }
  }

  move() {
    if(this.state.gameSetting !== GameSetting.ENDED){
      this.props.messageHandler.sender.sendMoveRequest(
        this.props.player.id, this.props.gameId,
        {
          button: { color: "blue", id: "2" },
          direction: [100, 100]
        }
      )
    }
  }

  leaveGame() {
    this.setState({
      gameSetting: GameSetting.ENDED
    });
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

  timeIsUp() {
    this.setState({
      gameSetting: GameSetting.ENDED
    })

    this.props.messageHandler.sender.sendEndGameRequest(this.props.player.id);
  }

  render() {
    return (
      <div>
        {this.state.loadedImageCounter !== 3 && this.state.gameSetting !== GameSetting.STARTED &&
          <div style={{ margin: 'auto', padding: '15%', textAlign: 'center' }}>
            <LoadingSpin
              width={'10px'}
              size={'200px'}
              primaryColor={'#dc3545'}
              secondaryColor={'#dbadb1'}
            />
          </div>
        }
        {this.state.loadedImageCounter === 3 && this.state.gameSetting !== GameSetting.STARTED &&
          <div className={'startGameContainer'}>
            <div className={'startGameContent'}>
              <h2 style={{textAlign: 'center', padding: '10px'}}>
                {this.state.gameSetting === GameSetting.ENDED ? 'Time is up' : 'Hello! Ready to play?'}
              </h2>
              <div style={{width: '100%', padding: '20px'}}>
                <div style={{width: '50%', float: 'left', textAlign: 'center'}}> 
                    <h4>Red team score: {this.state.score.red}</h4>
                </div>
                <div style={{marginLeft: '50%', textAlign: 'center'}}> 
                    <h4>Blue team score: {this.state.score.blue}</h4>
                </div>
              </div>
              <div style={{textAlign: 'center', padding: '10px'}}>
                <BS.Button 
                  variant="primary" 
                  onClick={() => this.startGame()}
                  style={{padding: '10px'}}
                  size='lg'
                >
                    Start game
                </BS.Button>
                <BS.Button 
                  variant="danger"
                  onClick={() => this.leaveGame()}
                  style={{padding: '10px', marginLeft: '10px'}}
                  size='lg'
                >
                    Quit game
                </BS.Button>
              </div>
            </div>
          </div>
        }
        {
          this.state.loadedImageCounter === 3 &&
          <div className={'gameComponent'}>
            <div className={'gameNameContainer'}>
              <div className={'gameFirstName'}>
                 {this.props.player.gameType === GameTypes.AI_VS_AI ? "AI" : this.props.player.name} - {this.state.score.red}
              </div>
              <div className={'timer'} >
                <Countdown 
                  date={this.state.date + 300000}
                  onComplete={() =>this.timeIsUp()}
                  autoStart={false} 
                  ref={this.setRef}
                  renderer={props => <div>{zeroPad(props.minutes)} : {zeroPad(props.seconds)}</div>}
                  />
              </div>
              <div className={'gameSecondName'}>
                {this.props.player.gameType === GameTypes.PLAYER_VS_PLAYER ? "Other player's name" : "AI"} - {this.state.score.blue}
              </div>
            </div>
            <div className={'gameSpace'}>
              <div style={{ padding: '20px' }}>
                <canvas id="canvas" width={1000} height={500} />
              </div>
            </div>
            <div className={'gameLeaveButtonContainer'}>
              <BS.Button variant="danger" onClick={() => this.leaveGame()}>
                Quit game
              </BS.Button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Game;