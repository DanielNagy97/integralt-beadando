import React from 'react';
import { RequestType } from '../../scripts/connectionHandler/messages/requestType';
import { NewPlayerPayload, PlayerListPayload } from '../../scripts/connectionHandler/messages/responses';
import { SocketMessage } from '../../scripts/connectionHandler/messages/socketMessage';
import { PlayerSocketMessageHandler } from '../../scripts/connectionHandler/playerSocketMessageHandler';
import { Player } from '../../models/player';

export interface ConnectProps {
  onPageChange: Function;
  onPlayerConnect: Function;
}

export interface ConnectStates { 
  messageHandler: PlayerSocketMessageHandler,
  player: Player 
}

class Connect extends React.Component<ConnectProps, ConnectStates> {
  constructor(props: ConnectProps) {
    super(props)
    
    this.state = {
      messageHandler: new PlayerSocketMessageHandler(),
      player: {
        id: "",
        name: ""
      }
    }
  }

  componentDidMount() {
    this.state.messageHandler.getSocket().onmessage = message => {
      const response: SocketMessage = JSON.parse(message.data);

      // Ez azért van itt, hogy ne kintről legyen módosítva a state,
      // ha meg lehet szépen oldani, majd bekerülne PlayerSocketMessageHandler-be!
      if (response.type === RequestType.newPlayer) {
        const payload: NewPlayerPayload = response.payload;
        this.setState({
          player: {
            ...this.state.player,
            id: payload.id
          }
        });
      }
      else if (response.type === RequestType.playerList) {
        const payload: PlayerListPayload = response.payload;
        console.log(payload);
      }
    }
  }

  connect() {
    const playerName = "test-name";
    this.setState({
      player: {
        ...this.state.player,
        name: playerName
      }
    });
    this.state.messageHandler.newPlayer("test-name");

    this.props.onPlayerConnect(this.state.player)
    this.props.onPageChange('game')
  }

  listPlayers() {
    this.state.messageHandler.playerList("1");
  }

  leave() {
    this.state.messageHandler.leaving("1");
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <p>Connect component works</p>
        <button onClick={() => this.connect()}>Connect with name</button>
        <button onClick={() => this.listPlayers()}>Player List</button>
        {/*<button onClick={() => this.leave()}>Leave</button>*/}
      </div>
    );
  }
}

export default Connect;