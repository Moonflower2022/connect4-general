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
    console.log = () => {} // lol
    const [agent1Index, agent1Setting, agent2Index, agent2Setting] = message.data
    const workerResult = runMatch(
        allAgents[agent1Index], agent1Setting,
        allAgents[agent2Index], agent2Setting
    )

    this.postMessage(workerResult)
}
