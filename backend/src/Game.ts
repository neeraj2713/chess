import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.player1.send(JSON.stringify({
      type: INIT_GAME,
      payload: {
        color: 'white',
      }
    }));
    this.player2.send(JSON.stringify({
      type: INIT_GAME,
      payload: {
        color: 'black', 
      }
    }));
  }

  makeMove(socket: WebSocket, move: {
    from: string,
    to: string
  }) {

    if(this.board.moves().length % 2 === 0 && socket !== this.player1) return;
    if(this.board.moves().length % 2 === 1 && socket !== this.player2) return;


    try {
      this.board.move(move)
    } catch (e) {
      console.log('Invalid move attempted:', move, 'Error:', e);
      return;
    }

    if(this.board.isGameOver()) {
      this.player1.send(JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner: this.board.turn() === 'w' ? 'black' : 'white'
        }
      }))
      return;
    }

    if(this.board.moves().length % 2 == 0) {
      this.player2.send(JSON.stringify({
        type: MOVE,
        payload: move
      }))
    } else {
      this.player1.send(JSON.stringify({
        type: MOVE,
        payload: move
      }))
    }

  }
}