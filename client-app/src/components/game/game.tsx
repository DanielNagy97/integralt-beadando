import React from 'react';
import * as BS from 'react-bootstrap';
import { Player } from '../../models/player';
import { Pages } from '../../enums/pages';

export interface GameProps{
  onPageChange: Function;
  player: Player;
}

export interface GameStates{}

class Game extends React.Component<GameProps, GameStates> {
  constructor(props: GameProps){
    super(props)
  }

  //TODO connecting the leaving action, sending message to the server
  leaveGame() {
    this.props.onPageChange(Pages.CONNECT);
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
            Game space
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