import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor() {

        super();
        this.state = {
            board: [
                ['O', null, 'X'],
                ['X', null, null],
                ['X', 'O', 'O']
            ],
            board_locked: false,
            game_over: false,
            current_player: 0,
            players: ['X', 'O'],
            ai_player: 'X',
            human_player: 'O',
        }
    }

    runAI() {
        let ai = this.minimax(this.clone(this.state.board));
        console.log(ai);
    }

    score(game) {
        const result = this.checkWinner(game);
        let data = {
            game_over: result.game_over,
            score: 0
        };

        if(result.winner === this.state.aiPlayer) {
            data.score = 10;
        } else if (result.winner === this.state.humanPlayer) {
            data.score = -10
        }

        return data;
    }

    minimax(game) {
        const score = this.score(game);
        if(score.game_over) {
            return score.score;
        }

        return score;
    }

    getNewState(game, move, player) {

    }

    getAvailableMoves(game) {

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
        for(let row of board) {
            const distinct = Array.from(new Set([...row]));
            if (distinct.length === 1 && distinct[0]) {
                winner = distinct[0];
            }
        }

        // check all columns
        for(let i = 0; i < 3; i++) {
            let values = [];
            for(let row of board) {
                values.push(row[i]);
            }
            const distinct = Array.from(new Set([...values]));
            if (distinct.length === 1 && distinct[0]) {
                winner = distinct[0];
            }
        }

        // check diagonals
        if(board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0]) {
            winner = board[0][0];
        }
        if(board[0][2] === board[1][1] && board[0][2] === board[2][0] && board[0][2]) {
            winner = board[0][2];
        }

        // check if tie
        let flattened = [].concat.apply([], board);
        if(!winner && !~flattened.indexOf(null)) {
            result.is_tie = true;
        }

        if(winner) {
            console.log(`Winner is: ${winner}`);
            result.winner = winner;
            result.game_over = true;
        }

        if(result.is_tie) {
            console.log(`Game ended with a tie!`);
            result.game_over = true;
        }

        return result;

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
