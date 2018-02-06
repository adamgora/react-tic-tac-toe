import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor() {

        super();
        this.state = {
            board: [
                ['X', null, null],
                [null, null, null],
                ['X', 'O', 'O']
            ],
            board_locked: false,
            game_over: false,
            current_player: 0,
            players: ['X', 'O'],
            ai_player: 'X',
            human_player: 'O',
        };
        this.ai_next_move = [];
    }

    updateBoard(row, cell) {
        const board = [...this.state.board];
        if(board[row][cell]) {return false}
        board[row][cell] = this.state.players[this.state.current_player];
        this.setState({
            board: board
        });
    }

    runAI() {
        let a = this.minimax(this.clone(this.state.board), this.state.current_player);
        this.updateBoard(this.ai_next_move[0], this.ai_next_move[1]);
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

    handleCellClick() {

    }

    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    checkWinner(board) {
        let winner = '';
        let result = {
            winner: '',
            game_over: false,
            is_tie: false,
        };

        // check all rows
        for (let row of board) {
            const distinct = Array.from(new Set([...row]));
            if (distinct.length === 1 && distinct[0]) {
                winner = distinct[0];
            }
        }

        // check all columns
        for (let i = 0; i < 3; i++) {
            let values = [];
            for (let row of board) {
                values.push(row[i]);
            }
            const distinct = Array.from(new Set([...values]));
            if (distinct.length === 1 && distinct[0]) {
                winner = distinct[0];
            }
        }

        // check diagonals
        if (board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0]) {
            winner = board[0][0];
        }
        if (board[0][2] === board[1][1] && board[0][2] === board[2][0] && board[0][2]) {
            winner = board[0][2];
        }

        // check if tie
        let flattened = [].concat.apply([], board);
        if (!winner && !~flattened.indexOf(null)) {
            result.is_tie = true;
        }

        if (winner) {
            console.log(`Winner is: ${winner}`);
            result.winner = winner;
            result.game_over = true;
        }

        if (result.is_tie) {
            console.log(`Game ended with a tie!`);
            result.game_over = true;
        }

        return result;

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
                {this.state.board.map((row, rindex) => {
                    return (
                        <div className="row" key={rindex}>
                            {row.map((cell, cindex) => {
                                return (
                                    <div className="cell"
                                         key={cindex}
                                         onClick={() => this.handleCellClick(rindex, cindex)}
                                    >
                                        {cell}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
                <p>Current player is {this.state.players[this.state.current_player]}</p>

                <button onClick={() => this.runAI()}>Run AI</button>
            </div>
        );
    }
}

export default App;
