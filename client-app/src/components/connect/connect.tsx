import React from 'react';
import * as BS from 'react-bootstrap';
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
  player: Player,
  validated: boolean,
  playerName: String,
  opponentButtons: {
    vs: string,
    ai: string
  }
}

class Connect extends React.Component<ConnectProps, ConnectStates> {
  constructor(props: ConnectProps) {
    super(props)
    
    this.state = {
      messageHandler: new PlayerSocketMessageHandler(),
      player: {
        id: "",
        name: ""
      },
      validated: false,
      playerName: '',
      opponentButtons: {
        ai: "outline-secondary",
        vs: "secondary"
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
        /*
        this.setState({
          player: {
            ...this.state.player,
            id: payload.id
          }
        });
        */
        console.log(payload);
      }
      else if (response.type === RequestType.playerList) {
        const payload: PlayerListPayload = response.payload;
        console.log(payload);
      }
    }
  }

  connect() {
    var playerName = this.state.playerName
    this.setState({
      player: {
        ...this.state.player,
        name: playerName
      }
    });
    //this.state.messageHandler.newPlayer(playerName);

    this.props.onPlayerConnect(this.state.player)
    this.props.onPageChange('game')
  }

  validateName = (event: any) => {
    this.state.messageHandler.newPlayer("Sanyi");
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.setState({
        validated: true
      })

      this.connect()
    }
  }

  listPlayers() {
    this.state.messageHandler.playerList("1");
  }

  leave() {
    this.state.messageHandler.leaving("1");
  }

  //TODO make it easier and prettier
  opponentChange(type: String) {
    switch (type) {
      case 'ai':
        if (this.state.opponentButtons.ai != 'secondary') {
          this.setState({
            opponentButtons: {
              ai: "secondary",
              vs: "outline-secondary"
            }
          })
        }
        break;
    
      case 'vs':
        if (this.state.opponentButtons.vs != 'secondary') {
          this.setState({
            opponentButtons: {
              ai: "outline-secondary",
              vs: "secondary"
            }
          })
        } 
        break;
    }
  }

  render() {
    console.log(this.state);

    
    return (
      <div className={'connectComponent'}>
        {/*
        <button onClick={() => this.listPlayers()}>Player List</button>
        <button onClick={() => this.leave()}>Leave</button>
        */}
        <div className={'connectBackground'}>
          <div className={'connectTitle'}>
            <h1>Button football</h1>
          </div>
          <div style={{textAlign: 'center'}}>
            <h3>Choose opponent</h3>
          <BS.ButtonGroup className={'opponentButtons'}>
            <BS.Button variant={this.state.opponentButtons.vs} onClick={() => this.opponentChange("vs")}>VS</BS.Button>
            <BS.Button variant={this.state.opponentButtons.ai} onClick={() => this.opponentChange("ai")}>AI</BS.Button>
          </BS.ButtonGroup>
          </div>
          <div className={'connectForm'}>
            <BS.Form noValidate validated={this.state.validated} onSubmit={this.validateName}>
              <BS.Form.Group className="mb-3" controlId="formBasicEmail">
                <BS.Form.Label>Name</BS.Form.Label>
                <BS.Form.Control required type="email" placeholder="Enter your name" />
                <BS.Form.Control.Feedback type="invalid">
                  Please choose a name.
                </BS.Form.Control.Feedback>
              </BS.Form.Group>
              <div style={{textAlign: 'center'}}>
                <BS.Button variant="primary" type="submit">
                  Connect with name
                </BS.Button>
              </div>
            </BS.Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Connect;