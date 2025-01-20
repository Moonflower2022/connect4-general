importScripts(
    "utils.js",
    "games/bit_board.js",
    "games/connect4.js",
    "games/minimax_connect4.js",
    "games/mcts_connect4.js",
    "players/minimax.js",
    "players/mcts.js",
    "players/random.js",
    "players/copy_cat.js",
    "game_visuals.js",
    "1v1.js"
)

onmessage = function (message) {
    const [selectedAgentIndex, pastMoves, dimensions] = message.data
    const game = new Connect4(dimensions)
    game.setStartState()
    for (const pastMove of pastMoves) {
        game.playMove(pastMove)
    }

    const workerResult = allAgents[selectedAgentIndex](game)

    this.postMessage(workerResult)
}
