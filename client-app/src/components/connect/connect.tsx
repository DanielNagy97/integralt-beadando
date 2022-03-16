import React from 'react';
import * as BS from 'react-bootstrap';
import './connect.css'
import { PlayerSocketMessageHandler } from '../../scripts/connectionHandler/playerSocketMessageHandler';
import { Player } from '../../models/player';
import { GameTypes } from '../../enums/game-types';
import { MessageType } from '../../scripts/connectionHandler/models/requestType';
import { CreateResponsePayload, NewPlayerResponsePayload } from '../../scripts/connectionHandler/models/responses/payloads';

export interface ConnectProps {
  onPageChange: Function;
  onPlayerConnect: Function;
  setGameId: Function;
  messageHandler: PlayerSocketMessageHandler;
}

export interface ConnectStates {
  player: Player,
  selectedGameType: GameTypes,
  isFormValidated: boolean,
  isNameInvalid: boolean,
  opponentButtons: {
    [GameTypes.AI_VS_AI]: string,
    [GameTypes.PLAYER_VS_AI]: string,
    [GameTypes.PLAYER_VS_PLAYER]: string
  },
  showGameList: boolean,
  testGameRoom: String[]
}

class Connect extends React.Component<ConnectProps, ConnectStates> {
  constructor(props: ConnectProps) {
    super(props)
    
    this.state = {
      player: {
        id: "",
        name: ""
      },
      selectedGameType: GameTypes.AI_VS_AI,
      isFormValidated: false,
      isNameInvalid: false,
      opponentButtons: {
        [GameTypes.AI_VS_AI]: "secondary",
        [GameTypes.PLAYER_VS_AI]: "outline-secondary",
        [GameTypes.PLAYER_VS_PLAYER]: "outline-secondary"
      },
      showGameList: false,
      testGameRoom: ["Room one", "Room two", "Room three"]
    }
  }

  componentDidMount(){
    this.props.messageHandler.receiver.onMessages.set(MessageType.newPlayer,
      (payload: NewPlayerResponsePayload) => {
        this.setState({
          player: {...this.state.player, id: payload.id}
        });

        this.props.onPlayerConnect(this.state.player);

        if(this.state.selectedGameType !== undefined){
          this.props.messageHandler.sender.sendCreateRequest(this.state.player.id, this.state.selectedGameType);
        }
      }
    );

    this.props.messageHandler.receiver.onMessages.set(MessageType.create,
      (payload: CreateResponsePayload) => {
        this.props.setGameId(payload.gameId);

        this.props.messageHandler.sender.sendJoinRequest(this.state.player.id, payload.gameId);
      }
    );
  }

  connect() {
    this.props.messageHandler.sender.sendNewPlayerRequest(this.state.player.name);
  }

  validateForm = () => {
    if (this.state.player.name !== '') {
      this.setState({
        isFormValidated: true
      })

      this.connect()
    } else {
      this.setState({
        isNameInvalid: true
      })
    }
  }

  onNameChange = (name: any) => {
     this.setState({
       player: {
         ...this.state.player,
         name: name
       }
     })
  }

  // NOTE: Unused function
  listPlayers() {
    this.props.messageHandler.sender.sendPlayerListRequest("1");
  }

  opponentChange(type: GameTypes) {
    if (this.state.opponentButtons[type] !== "secondary") {
      this.setState({
        opponentButtons: {
          [GameTypes.AI_VS_AI]: type === GameTypes.AI_VS_AI ? "secondary" : "outline-secondary",
          [GameTypes.PLAYER_VS_AI]: type === GameTypes.PLAYER_VS_AI ? "secondary" : "outline-secondary",
          [GameTypes.PLAYER_VS_PLAYER]: type === GameTypes.PLAYER_VS_PLAYER ? "secondary" : "outline-secondary"
        }
      })
    }

    this.setState({
      showGameList: type === GameTypes.PLAYER_VS_PLAYER ? true : false
    })

    this.setState({
      selectedGameType: type
    })
  }

  render() {
    return (
      <div className={'connectComponent'}>
        <div className={'connectBackground'}>
          <div className={'connectTitle'}>
            <h1>Button football</h1>
          </div>
          <div style={{textAlign: 'center'}}>
            <h3>Choose opponent</h3>
          <BS.ButtonGroup className={'opponentButtonContainer'}>
            <BS.Button 
              variant={this.state.opponentButtons[GameTypes.AI_VS_AI]}
              onClick={() => this.opponentChange(GameTypes.AI_VS_AI)}
              className={'opponentButton'}>
                AI vs AI
            </BS.Button>
            <BS.Button 
              variant={this.state.opponentButtons[GameTypes.PLAYER_VS_AI]}
              onClick={() => this.opponentChange(GameTypes.PLAYER_VS_AI)}
              className={'opponentButton'}>
                Player vs AI
            </BS.Button>
            <BS.Button
              variant={this.state.opponentButtons[GameTypes.PLAYER_VS_PLAYER]}
              onClick={() => this.opponentChange(GameTypes.PLAYER_VS_PLAYER)}
              className={'opponentButton'}>
                Player vs Player
            </BS.Button>
          </BS.ButtonGroup>
          </div>
          {
            this.state.showGameList &&
            <div className={'gameRoomListContainer'}>
              { this.state.testGameRoom &&
                <BS.Table striped bordered hover>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Room name</th>
                    </tr>
                  </thead>
                  <tbody>
                  { this.state.testGameRoom.map((room, index) =>
                    <tr key={index}>
                        <td>{index}</td>
                        <td>{room}</td>
                    </tr>
                  )}
                  </tbody>
                </BS.Table>
             }     
            </div>
          }
          <div className={'connectForm'}>
            <BS.Form validated={this.state.isFormValidated}>
              <BS.Form.Group className="mb-3" controlId="formName">
                <BS.Form.Label>Name</BS.Form.Label>
                <BS.Form.Control 
                  type="text"
                  placeholder="Enter your name"
                  onChange={e => this.onNameChange(e.target.value)}
                  isInvalid={this.state.isNameInvalid}
                />
                <BS.Form.Control.Feedback type="invalid">
                  Please choose a name.
                </BS.Form.Control.Feedback>
              </BS.Form.Group>
              <div style={{textAlign: 'center'}}>
                <BS.Button variant="secondary" size='lg' onClick={() => this.validateForm()}>
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