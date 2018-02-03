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
            </div>
        );
    }
}

export default App;
