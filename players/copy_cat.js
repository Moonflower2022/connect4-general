function copyCatAgent(game) {
    if (game.state.pastMoves.length === 0) {
        return 3
    }
    const lastMove = game.state.pastMoves.last()
    if (game.canPlayMove(lastMove)) {
        return lastMove
    }
    return game.getPossibleMoves().random()
}