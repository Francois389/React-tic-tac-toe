import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


function Square(props) {
    const className = "square " + (props.isWinning ? 'winning-square' : '');
    return (
        <button
            className={className}
            onClick={() => props.onClick()}
        >
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                isWinning={this.props.winningSquares.includes(i)}
                value={this.props.squares[i]}
                onClick={() => {
                    this.props.onClick(i)
                }}
            />
        );
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastMove: null,
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (!calculateWinner(squares) && !squares[i]) {
            squares[i] = this.state.xIsNext ? "X" : "O";
            this.setState({
                history: history.concat([{
                    squares: squares,
                    lastMove: i,
                }]),
                xIsNext: !this.state.xIsNext,
                stepNumber: history.length,
            });
        }
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        console.log(history)

        const moves = history.map((step, move) => {
            console.log("setp : ", step)
            console.log("move : ", move)
            let colonne, ligne = 0;
            if (history[move].lastMove != null) {
                colonne = (history[move].lastMove % 3) + 1;
                ligne = Math.floor(history[move].lastMove / 3) + 1;
            }
            const desc = move ?
                "N° " + move + " -> " + ((move % 2) !== 0 ? 'X' : 'O') + " (Col. " + colonne + ", Lig. " + ligne + ")" :
                "Revenir au debut de partie";
            return (
                <li key={move}>
                    <button className="btn-time-travel" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        let className = "board";
        if (winner) {
            status = (!this.state.xIsNext ? 'X' : 'O') + ' a gagné';
        } else if (this.state.stepNumber === 9) {
            status = 'Match nul';
            className += " game-null";
        } else {
            status = 'Prochain joueur : ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board" id="board">
                    <Board
                        className={className}
                        winningSquares={winner ? winner : []}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}

                    />
                    <div className="status">{status}</div>
                </div>
                <div className="game-info">
                    <div>Historique des mouvements</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    jumpTo(move) {
        console.log(move)
        this.setState({
            stepNumber: move,
            xIsNext: (move % 2) === 0
        })
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);
