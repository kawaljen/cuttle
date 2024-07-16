module.exports = {
  friendlyName: 'unpack GameState',

  description: 'Transforms a GameStateRow into a GameState. Converts the String representations of cards to Card objects, and aggregates the p0Hand, p0Points, and p0FaceCards attributes into the p0 and p1 Player objects.',

  inputs: {
    gameStateRow: {
      type: 'ref',
      description: 'GameStateRow - record from the database',
      required: true,
    },
  },
  sync: true,

  fn: ({ gameStateRow  }, exits) => {
    try {

      const attributesToConvert = [
        'deck', 'scrap', 'playedCard', 'targetCard', 'oneOff', 'oneOffTarget', 'twos', 'resolving',
        'discardedCards', 'p0Hand', 'p1Hand', 'p0Points', 'p1Points', 'p0FaceCards', 'p1FaceCards',
      ];

      const convertedData = {};
      attributesToConvert.forEach(attribute => {
            const value = gameStateRow[attribute];
            if (value) {
                const { convertIdToCard } = sails.helpers.gamestate;
                convertedData[attribute] = Array.isArray(value) ?
                                                          value.map(card => convertIdToCard(card))
                                                          : convertIdToCard(value);
            }
        });


        const p0 = {
                    hand : convertedData.p0Hand,
                    faceCards: convertedData.p0FaceCards,
                    points : convertedData.p0Points
                    };

        const p1 = {
                    hand : convertedData.p1Hand,
                    faceCards: convertedData.p1FaceCards,
                    points : convertedData.p1Points
                    };


        const data = {
                      gameId: gameStateRow.gameId,
                      playedBy : gameStateRow.playedBy,
                      moveType : gameStateRow.moveType,
                      turn : gameStateRow.turn,
                      phase : gameStateRow.phase,

                      p0,
                      p1,
                      deck : convertedData.deck,
                      scrap: convertedData.scrap,
                      twos : convertedData.twos,
                      playedCard : convertedData.playedCard ?? null,
                      targetCard : convertedData.targetCard ?? null,
                      oneOff : convertedData.oneOff ?? null,
                      oneOffTarget: convertedData.oneOffTarget ?? null,
                      resolving : convertedData.resolving ?? null,
                      discardedCards : convertedData.discardedCards ?? null,
                      };

          const convertedGameState = sails.helpers.gamestate.validateGamestate( data );

          return exits.success(convertedGameState);
    } catch (err) {
          return exits.error(err.message);
    }

  }
};
