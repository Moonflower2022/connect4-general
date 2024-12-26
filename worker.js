importScripts(
    "utils.js",
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
    console.log = () => {}
    const workerResult = runMatch(allAgents[message.data[0]], allAgents[message.data[1]])

    this.postMessage(workerResult)
}
