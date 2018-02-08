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
        };
        this.ai_next_move = [];
    }

    componentDidUpdate() {
        console.log('compoent updated');
        /*if(this.state.runAI) {
            this.runAI();
        }*/
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
            //runAI: this.state.ai_player == this.state.players[new_player]
        });
    }

    runAI() {
        this.minimax(this.clone(this.state.board), this.state.current_player);
        this.updateBoard(this.ai_next_move[0], this.ai_next_move[1]);
        this.switchPlayer();
        this.setState({runAi: !this.state.runAi});
    }

    score(game, depth) {
        const result = this.checkWinner(game);
        let data = {
            game_over: result.game_over,
            score: 0
        };

        if (result.winner === this.state.ai_player) {
            data.score = 10 - depth;
        } else if (result.winner === this.state.human_player) {
            data.score = depth - 10
        }

        return data;
    }

    minimax(game, player, depth = 0) {
        const score = this.score(game, depth);
        let moves = [],
            scores = [];

        depth += 1;

        if (score.game_over) {
            return score.score;
        }

        for (let move of this.getPossibleMoves(game)) {
            const possible_board = this.getNewState(this.clone(game), move, player);
            scores.push(this.minimax(possible_board, Number(!player), depth));
            moves.push(move);
        }

        if (player === 0) {
            let max_index = this.getMaxIndex(scores);
            this.ai_next_move = moves[max_index];
            return scores[max_index];
        } else {
            let min_index = this.getMinIndex(scores);
            this.ai_next_move = moves[min_index];
            return scores[min_index];
        }
    }

    getNewState(game, move, player) {
        game[move[0]][move[1]] = this.state.players[player];
        return game;
    }

    getPossibleMoves(game) {
        let moves = [];
        game.map((row, rowIndex) => {
            row.map((cell, cellIndex) => {
                if (!cell) {
                    moves.push([rowIndex, cellIndex]);
                }
            })
        });
        return moves;
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
        return !board.some(x => x != 0);
    }

    getMaxIndex(arr) {
        let index = 0,
            max = arr[0];

        arr.map((v, i) => {
            if (v > max) {
                max = v;
                index = i;
            }
        });

        return index;
    }

    getMinIndex(arr) {
        let index = 0,
            min = arr[0];

        arr.map((v, i) => {
            if (v < min) {
                min = v;
                index = i;
            }
        });

        return index;
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
