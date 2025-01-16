const explorationConstant = Math.sqrt(2)

class Node {
    constructor(game, parent, moveMade) {
        this.game = game
        this.color = !game.state.turn // should be the color of the player that just played
        this.parent = parent // null if root
        this.isLeaf = true
        this.children = []
        this.possibleMoves = game.getPossibleMoves()
        this.remainingPossibleIndices = [...this.possibleMoves.keys()]
        this.simulations = 0
        this.wins = 0
        this.moveMade = moveMade
    }

    isFullyExpanded = () => {
        return this.remainingPossibleIndices.length === 0
    }

    chooseLeaf = () => {
        let currentNode = this

        while (!currentNode.isLeaf && currentNode.isFullyExpanded()) {
            currentNode = currentNode.bestUTC()
        }

        return currentNode
    }

    simulate = () => {
        let copiedGame = this.game.copy()
        while (copiedGame.getTerminated() === false) {
            let moves = copiedGame.getPossibleMoves()
            copiedGame.playMove(moves.random())
        }
        return copiedGame.getWinner()
    }

    expand = (expansionCount) => {
        if (this.game.getTerminated() !== false) {
            return this
        } else {
            for (let i = 0; i < expansionCount; i++) {
                this.addChild()
            }
            return this.children.random()
        }
    }

    addChild = () => {
        let copiedGame = this.game.copy()
        let randomIndex = Math.floor(
            Math.random() * this.remainingPossibleIndices.length
        )

        let move =
            this.possibleMoves[this.remainingPossibleIndices[randomIndex]]

        copiedGame.playMove(move)
        this.remainingPossibleIndices.splice(randomIndex, 1)

        let newNode = new Node(copiedGame, this, move)
        this.children.push(newNode)
        this.isLeaf = false
    }

    backpropogate(winner) {
        this.simulations++
        if (this.color === winner) {
            this.wins++
        } else if (winner === null) {
            this.wins += 0.5
        }
        if (this.parent) {
            this.parent.backpropogate(winner)
        }
    }

    bestUTC = () => {
        return this.children.reduce(
            (max, curr, i) => (curr.UTC() > max.UTC() ? curr : max),
            this.children[0]
        )
    }

    UTC = () => {
        if (this.simulations === 0) {
            return 1000000
        }
        const ratio = this.wins / this.simulations

        const bonus = Math.sqrt(
            Math.log(this.parent.simulations) / this.simulations
        )
        return ratio + explorationConstant * bonus
    }
}

function monteCarloTreeSearchTime(
    state,
    seconds,
    simulationCount,
    expansionCount
) {
    let root = new Node(new MonteCarloTreeSearchConnect4(state), null)
    let end = Date.now() + seconds * 1000
    let i = 0
    while (Date.now() < end) {
        let node = root.chooseLeaf()
        let simulationNode = node.expand(expansionCount)
        for (let j = 0; j < simulationCount; j++) {
            winningColor = simulationNode.simulate()
            simulationNode.backpropogate(winningColor)
        }
        i++
    }
    console.log(`ran for ${i} iterations`)
    console.log(root)

    root.children.sort((a, b) => {
        return b.wins / b.simulations - a.wins / a.simulations
    })
    return [
        root.children[0].moveMade,
        root.children[0].wins / root.children[0].simulations,
    ]
}

function monteCarloTreeSearchIterations(
    state,
    iterations,
    simulationCount,
    expansionCount
) {
    let root = new Node(new MonteCarloTreeSearchConnect4(state), null, null)
    let start = Date.now()
    for (let i = 0; i < iterations; i++) {
        let node = root.chooseLeaf()
        let simulationNode = node.expand(expansionCount)
        for (let j = 0; j < simulationCount; j++) {
            winningColor = simulationNode.simulate()
            simulationNode.backpropogate(winningColor)
        }
    }
    console.log(`ran for ${Date.now() - start} ms`)
    console.log(root)

    root.children.sort((a, b) => {
        return b.wins / b.simulations - a.wins / a.simulations
    })
    return [
        root.children[0].moveMade,
        root.children[0].wins / root.children[0].simulations,
    ]
}

function monteCarloTreeSearchAgent(game) {
    const result = monteCarloTreeSearchIterations(
        game.getMonteCarloTreeSearchStartState(),
        50000,
        1,
        1
    )
    console.log(`best node win rate: ${result[1]}`)
    return result[0]
}
