module.exports = {
  friendlyName: 'Deals cards to Initiate a new gamestate',

  description: 'Can start a game via ready and rematch',

  inputs: {
    gameData : {
      type: 'ref',
      description: 'Game',
      required: true,
    },
  },

  fn: async ({ gameData }, exits) => {

    try {
        const game = await sails.helpers.lockGame(gameData.id);
        //const currentState = sails.helpers.unpackGameState(game.gameStates[game.gameStates.length - 1])
        //TODO Is it first gameStaterow ?

        const requestedMove = sails.helpers.moves.dealcards.parseRequest({...gameData, ...game});
        // Validate move
        await sails.helpers.moves.dealcards.validate(requestedMove);
        // Move cards around
        const gameState = sails.helpers.moves.dealcards.execute(requestedMove);
        // Save game to db
        //await sails.helpers.gamestate.saveGameState(gameState);
        // Blast socket message
        //await sails.helpers.emitGameState(gameState);

        return exits.success( gameState );

    } catch (err) {
        return exits.error ('Error dealings cards : ' + err.message);
    }
  }
};
