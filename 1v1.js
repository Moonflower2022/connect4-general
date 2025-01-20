function runMatchWithDraw(agent1, agent1Setting, agent2, agent2Setting) {
    game = new Connect4({ height: 6, width: 7 })
    game.setStartState()
    drawConnect4(game.state.board)

    while (true) {
        const agent1Move = agent1(game, agent1Setting)

        game.playMove(agent1Move)
        drawConnect4(game.state.board)

        if (game.getTerminated()) {
            if (game.getWinner() !== null) {
                drawWinLine(game.state.winningLine)
            }
            break
        }
        const agent2Move = agent2(game, agent2Setting)

        game.playMove(agent2Move)
        drawConnect4(game.state.board)

        if (game.getTerminated()) {
            if (game.getWinner() !== null) {
                drawWinLine(game.state.winningLine)
            }
            break
        }
    }
}

function runMatch(agent1, agent1Setting, agent2, agent2Setting) {
    game = new Connect4({ height: 6, width: 7 })
    game.setStartState()

    let agent1SpentTime = 0
    let agent2SpentTime = 0

    while (true) {
        agent1StartTime = Date.now()
        const agent1Move = agent1(game, agent1Setting)
        agent1SpentTime += Date.now() - agent1StartTime

        game.playMove(agent1Move)
        if (game.getTerminated()) {
            break
        }

        agent2StartTime = Date.now()
        const agent2Move = agent2(game, agent2Setting)
        agent2SpentTime += Date.now() - agent2StartTime

        game.playMove(agent2Move)
        if (game.getTerminated()) {
            break
        }
    }
    return [game.getWinner(), agent1SpentTime / 1000, agent2SpentTime / 1000]
}

const allAgents = [
    monteCarloTreeSearchTimeAgent,
    monteCarloTreeSearchIterationsAgent,
    minimaxAgent,
    randomAgent,
    copyCatAgent,
]
