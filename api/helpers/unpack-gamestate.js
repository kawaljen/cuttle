const Player = require('../utils/Player');
//const GameState = require('./GameState');

const utils = require('../utils/convertCard');


module.exports = {
  friendlyName: 'unpack GameState',

  description: 'This helper inputs a GameStateRow and output a GameState. Convert all the String representations of cards to the Card objects, and aggregating the p0Hand, p0Points, and p0FaceCards attributes into the p0: Player object (doing the same for p1).',

  inputs: {
    gameStateRow: {
      type: 'ref',
      description: 'GameStateRow - record from the database',
      required: true,
    },    
    p0Id: {
      type: 'number',
      description: 'player0Id',
      required: true,
    },
    p1Id: {
      type: 'number',
      description: 'player0Id',
      required: true,
    },
  },

  fn: async ({gameStateRow, p0Id, p1Id  }, exits) => {
      try{

        const attributesToConvert = [
          'p0Hand', 'p1Hand', 'p0Points', 'p1Points', 'p0FaceCards', 'p1FaceCards', 'deck', 'scrap',
          'playedCard', 'targetCardId', 'targetCard2Id', 'oneOff', 'oneOffTarget', 'twos', 'resolving'
      ];
  
      const allPromises = attributesToConvert.map(attribute => {
          const value = gameStateRow[attribute];
          if (value !== null && value !== undefined) {
              // single card
              if (typeof value === 'string') {
                  return utils.convertStringToCard(value, gameStateRow.gameId);
              } 
               // Array of cards
              else if (Array.isArray(value)) {
                  return Promise.all(value.map(card => utils.convertStringToCard(card, gameStateRow.gameId)));
              }
          }
          return Promise.resolve(null);  // Handle null or undefined attributes
      });
  
      const [
          p0Hand, p1Hand, p0Points, p1Points, p0FaceCards, p1FaceCards, deck, scrap,
          playedCard, targetCardId, targetCard2Id, oneOff, oneOffTarget, twos, resolving
      ] = await Promise.all(allPromises);

      const p0Data ={ 
        pNum : 0, 
        hand : p0Hand, 
        points : p0Points, 
        faceCards : p0FaceCards,
        id : p0Id
      };
      const updatedP0 = new Player (p0Data);  

        const p1Data = { 
          pNum : 1, 
          hand : p1Hand, 
          points : p1Points, 
          faceCards : p1FaceCards,
          id: p1Id
        };
        const updatedP1 = new Player (p1Data);  

        const convertedData ={   
                                  p0 : updatedP0,
                                  p1 : updatedP1,
                                  deck : deck,
                                  scrap : scrap,
                                  playedCard :playedCard,
                                  targetCardId: targetCardId,
                                  targetCard2Id : targetCard2Id,
                                  oneOff: oneOff,
                                  oneOffTarget:oneOffTarget,
                                  twos :twos,
                                  resolving : resolving
                                };

    
        const UpdatedData = {...gameStateRow, ...convertedData };

        //const updatedGameState = new GameState (UpdatedData);  

        return exits.success(UpdatedData);
    } catch (err) {
      return exits.error(err.message); 
    }

  }
};