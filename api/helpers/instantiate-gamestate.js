const GameState = require('../services/GameState.js');

module.exports = {
  friendlyName: 'Initiate and save a new gamestate',

  description: 'Initiate and save a new gamestate',

  inputs: {
    id: {
      type: 'number',
      description: 'game id',
      required: true,
    },
    players :{
      type: 'ref',
      description: 'Array containing the 2 players',
      required: true,
    },
    deck:{
      type: 'ref',
      description: 'Array of Cards Objects forming the deck',
      required: true,
    }
  },

  fn: async ({id, players, deck}, exits) => {

    const updatedState = new GameState({
              p0 : players[0],
              p1 : players[1],
              deck : deck ,
              gameId :  id,               
            });

     try {
 //      const game = await sails.helpers.lockGame( id);

    //   sails.helpers.moves.dealCards.validate(game.turn);

    //   // Save game to db
    //   await sails.helpers.saveGameState(updatedState);
  
    //   // Blast socket message
    //   await sails.helpers.emitGameState(game, updatedState);
  
     } catch (err) {
        return exits.error(err);
     }
    return exits.success(updatedState);
  },
};

