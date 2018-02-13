import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor() {

        super();
        this.state = {
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            board_locked: false,
            game_over: false,
            current_player: 1,
            runAI: false,
            minPlayer: 1,
            maxPlayer: 2,
            AiPlayer: 2,
            singlePlayerGame: false
        };
    }

    componentDidUpdate() {
        if(this.state.runAI) {
            this.runAI();
        }
    }

    updateBoard(index) {
        const board = [...this.state.board];
        board[index] = this.state.current_player;
        this.setState({
            board: board
        });
        return board;
    }

    handleClick(index) {
        let board = this.updateBoard(index);
        let w = this.checkWinner(this.state.current_player, board);
        if(w) {
            console.log(this.state.current_player + ' has won');
        }
        let t = this.checkTie(board);
        if(t) {
            console.log('its a tie');
        }
        this.switchPlayer();
    }

    switchPlayer() {
        const new_player = this.state.current_player == 1 ? 2 : 1;
        this.setState({
            current_player: new_player,
            runAI: this.state.AiPlayer == new_player && this.state.singlePlayerGame
        });
    }

    runAI() {
        let bestMove = -10;
        let move = 0;
        let depth = 0

        for(let i = 0; i < this.state.board.length; i++) {
            if(!this.state.board[i]) {
                let possibleBoard = this.getNewState(this.clone(this.state.board), i, this.state.maxPlayer);
                let possibleMoveValue = this.minMove(possibleBoard, depth);
                if (possibleMoveValue > bestMove) {
                    bestMove = possibleMoveValue;
                    move = i;
                }
            }
        }
        this.handleClick(move);
    }

    minMove(board, depth) {
        if(this.checkWinner(this.state.maxPlayer, board)) { return 10 }
        if(this.checkWinner(this.state.minPlayer, board)) { return -10 }
        if(this.checkTie(board)) { return 0 }

        let bestMoveValue = 10;

        for (let i = 0; i < board.length; i++) {
            if(!board[i]) {
                let possibleBoard = this.getNewState(this.clone(board), i, this.state.minPlayer);
                let possibleMoveValue = this.maxMove(possibleBoard, depth +1);
                if(possibleMoveValue < bestMoveValue) {
                    bestMoveValue = possibleMoveValue
                }
            }
        }
        return bestMoveValue
    }

    maxMove(board, depth) {
        if(this.checkWinner(this.state.maxPlayer, board)) { return 10 }
        if(this.checkWinner(this.state.minPlayer, board)) { return -10 }
        if(this.checkTie(board)) { return 0 }

        let bestMoveValue = -10;

        for (let i = 0; i < board.length; i++) {
            if(!board[i]) {
                let possibleBoard = this.getNewState(this.clone(board), i, this.state.maxPlayer);
                let possibleMoveValue = this.minMove(possibleBoard, depth + 1);
                if(possibleMoveValue > bestMoveValue) {
                    bestMoveValue = possibleMoveValue
                }
            }
        }

        return bestMoveValue
    }

    getNewState(board, index, player) {
        board[index] = player;
        return board;
    }

    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    checkWinner(player, board) {
        return (board[0] === player && board[1] === player && board[2] === player) ||
            (board[3] === player && board[4] === player && board[5] === player) ||
            (board[6] === player && board[7] === player && board[8] === player) ||
            (board[0] === player && board[3] === player && board[6] === player) ||
            (board[1] === player && board[4] === player && board[7] === player) ||
            (board[2] === player && board[5] === player && board[8] === player) ||
            (board[0] === player && board[4] === player && board[8] === player) ||
            (board[2] === player && board[4] === player && board[6] === player);
    }

    checkTie(board) {
        return !board.some(x => x == 0);
    }

    render() {
        return (
            <div id='game-board'>
                {this.state.board.map((cell, index) => {
                    return (
                        <div className="cell" key={index} onClick={() => this.handleClick(index)}>
                            {!cell ? '' : cell === 1 ? 'X' : 'O'}
                        </div>
                    );
                })}
                <p>Current player is {this.state.current_player}</p>

                <button onClick={() => this.runAI()}>Run AI</button>
            </div>
        );
    }
}

export default App;
