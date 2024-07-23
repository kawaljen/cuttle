const GameStatus = require('../../../../utils/GameStatus.json');

module.exports = {
  friendlyName: 'Validate deals card',

  description: 'Throws error if given info are not set =  correct id is given, then if it is not really a starting game = turn is equal to 0, and no gamestateRow with this id already exist and  !GameStatus.STARTED',

  inputs: {
    requestedMove: {
      type: 'ref',
      description: 'The move being requested.',
      required : true
    }
  },

  fn: async ({requestedMove}, exits)=>{
      //Check if given info are set correct id is given
      if (!requestedMove.gameId) {
          return exits.error({message : 'Cannot deal card : No gameState gameId given'});
      }
      if (!requestedMove.gameStatus && requestedMove.gameStatus !== GameStatus.STARTED) {
        return exits.error ({message : 'Cannot deal card : This Game has not already started'});  
      }

      //Check if it is a starting game = turn is equal to 0, and no gamestateRow with this id already exist
      if (!requestedMove.turn !== null && requestedMove.turn !== 0) {
        return exits.error ({message : 'Cannot deal card : This Game has already started'}); // TODO is it?
      }
      const gameStateRow = await GameStateRow.findOne({ id : requestedMove.gameId });
      if (gameStateRow) {
        return exits.error ({message : 'Cannot deal card : This Game has already started'}); // TODO is it first row ?
      }

      return exits.success();
    },
 };