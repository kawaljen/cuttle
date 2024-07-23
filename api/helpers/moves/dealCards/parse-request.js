module.exports = {
  friendlyName: 'parserequest',

  description: 'returns gameId',

  inputs: {
    game: {
      type: 'ref',
      description: 'Game object',
      required : true
    }
  },
  sync: true,

  fn: ({game}, exits) => {
      try {
     
      const requestedMove = {
        gameId : game.id ?? null, 
        turn : game.turn ?? null,
        gameStatus : game.status ?? null, //TODO validate?
        //TODO lastEvent
      };
      //Add Players id to Game //TODO
      const p0 = game.players.find((player) => player.pNum === 0);
      const p1 = game.players.find((player) => player.pNum === 1);
      Game.updateOne({ id: game.id }).set({p0 : p0.id, p1 : p1.id});

      return exits.success( requestedMove);
    } catch (err) {
      return exits.error(err);
    }
    },
 };