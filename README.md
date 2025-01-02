# connect4-general

A better connect 4 website where you can play against bots implemented with generalized algorithms.

# features

* `index.html`: normal website where you can play against one of the bots.
* `1v1.html`: runs one game between two bots on display, and then runs 1000 more and keeps track of the stats.

# todo

* optimize the bit board
  * change BigInt to a custom class holding two js ints
  * implement or, xor, and, not, etc
  * figure out l/r shift
  * do like Long.add(long1, long2), Long.or(long1, long2)
* ui
  * settings
    * thinking time for mcts
    * search depth for minimax
  * save state
  * new game
  * show where your marker would be placed on the board
  * worker for no lag