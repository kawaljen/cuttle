/**Create Card from suit, rank
*****@param { Object } card = {suit: integer, rank: integer}
 * @returns { Card } {suit: integer, rank: integer, id: string, isFrozen : boolean, attachment : []}
 */
function createCard (card) {

   const validArgs = card.suit >= 0 && card.suit <= 3 && card.rank >= 1 && card.rank <= 13;
   if (!validArgs) {
     throw new Error('Invalid Arguments for createCard');
   }

   const id = '??';//sails.helpers.gameState.convertCardToStr(card);//TODO

   return { ...card, id, isFrozen: false, attachment : [] };
}

module.exports = {
  friendlyName: 'Deals cards to Initiate a new gamestate',

  description: 'Can start a game via ready and rematch', //TODO ??

  inputs: {
    requestedMove : {
      type: 'ref',
      description: 'Game to be evaluated',
      required: true,
    },
  },
  sync: true,

  fn: ({ requestedMove }, exits) => {

    try {
        //create deck then shuffle
        const deck = [];
        for (let suit = 0; suit < 4; suit++) {
          for (let rank = 1; rank < 14; rank++) {
            const newCard = createCard({ suit, rank });
            deck.push(newCard);
          }
        }
        const shuffledDeck = _.shuffle(deck).map((card) => card.id);

        // Take 1st 5 cards for p0
        const dealToP0 = shuffledDeck.splice(0, 5);
        // Take next 6 cards for p1
        const dealToP1 = shuffledDeck.splice(0, 6);
        // create GameState
        const newGameState = sails.helpers.gamestate.validateGamestate({ 
            deck : shuffledDeck,
            p0 : { hand : dealToP0 },
            p1 : { hand : dealToP1 },
            turn : requestedMove.turn,
            moveType : 1, 
            phase : 1, 
            gameId : requestedMove.gameId,
            playedBy : 0 // ??? TODO Quid de playedBy ??
        });

        return exits.success(newGameState);
    }
    catch (err){
      return exits.error({ message: 'Cannot deal cards ' + err });
    }
  },
 };
