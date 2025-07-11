import { WebSocket } from "ws";

interface Game {
  id: number;
  name: string
}

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket;
  private users: WebSocket[];

  constructor() {
    this.games = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter(user => user !== socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on('message', (data) => {
      
    })
  }



}