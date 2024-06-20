
module.exports = {
  friendlyName: 'unpackGameState',

  description: 'This helper inputs a GameStateRow and output a GameState. Convert all the String representations of cards to the Card objects, and aggregating the p0Hand, p0Points, and p0FaceCards attributes into the p0: Player object (doing the same for p1).',


  inputs: {
    GameStateRow: {
      type: 'GameStateRow',
      description: 'record from the database',
      required: true,
    },
  },

  getRankAndSuit: function (cardID){
    let suit;
    let rank;

   //Suit: ‘C’ (Clubs), ‘D’ (Diamonds), ‘H’ (Hearts), ‘S’ (Spades)
    switch (cardID.suit) {
      case 'C':
        suit = 0;
        break;
      case 'D':
        suit = 1;
        break;
      case 'H':
        suit = 2;
        break;
      case 'S':
        suit = 3;
        break;
      default:
        throw new Error('Error at unpacking cards : ' + cardID.suit);
    }
  
   //Rank: ‘A’ (Ace), ‘2’, ‘3’, ‘4’, ‘5’, ‘6’, ‘7’, ‘8’, ‘9’, ‘T’ (Ten), ‘J’ (Jack), ‘Q’ (Queen), ‘K’ (King)
    if(typeof cardID.rank === 'number' && cardID.rank > 0 && cardID.rank < 10){
        rank = cardID.rank;
    } else {
        switch (cardID.rank) {
          case 'A':
            rank = 1;
            break;
          case 'T':
            rank = 10;
            break;
          case 'J':
            rank = 11;
            break;
          case 'Q':
            rank = 12;
            break;
          case 'K':
            rank = 13;
            break; 
          default:
            throw new Error('Error at unpacking cards : ' + cardID.rank);
        }
      }
  
    return { suit: suit, rank : rank};
  },

  cleanCardIdentifier: function (stringCard){
    let str = stringCard.split('');

    // Clean card with attachement eg : ‘TH(JH-p0,JC-p1,JD-p0)’
    if(str.length > 2){
      // get content before parentheses
      str = stringCard.replace(/ \([\s\S]*?\)/g, '');
    }


    //  + simple card eg :‘3D’
    if(str.length===2){
      str.split('');
      return { suit : str[0] , rank : str[1]};
    }

    throw new Error('Error at unpacking cards : ' + stringCard);
     
  },

  isFrozen(){
    return false;
  },

  convert:function (str){
    const strClean = this.cleanCardIdentifier(str);
    const stringToCard = this.getRankAndSuit(strClean);
    return new Card ({  id: strClean.suit + strClean.rank, 
                        suit : stringToCard.suit, 
                        rank : stringToCard.rank, 
                        isFrozen : this.isFrozen() });
  },

  fn: async (GameStateRow ) => {

      const p0Hand = GameStateRow.p0Hand.map(card => this.convert(card));
      
      new Player ({id:0, hand: p0Hand });
  }
};


class Card{
  //string
  id =  null;
   //int
  suit = null;
   //int
  rank = null;
   //boolean
  isFrozen = false;

  constructor(card) {
    this.id = card.id ? card.id : null;
    this.suit = card.suit ? card.suit : null;
    this.rank = card.rank ? card.rank  : null;
    this.isFrozen = card.isFrozen ? card.isFrozen : false;
  }
}

class Player{
  //int
  id = null;
  //String
  name =  null;
  //Array<Card>
  hand = null;
  //Array<Card>
  points = null;
  //Array<Card>
  faceCards = null;

  constructor(player) {
      this.hand = player.hand ? player.hand : null; 
      this.points = player.points ? player.points :null; 
      this.faceCards = player.faceCards ? player.faceCards :null;
      this.name = player.name ? player.name :null; 
      this.id = player.id ? player.id :null;
  }
}

class GameState{
  // id: primary key
  id = null;
  // playedBy: int 0 | 1: Which player made the move (0 if p0, 1 if p1)
  playedBy = null;
  // moveType: Enum (int?) - designates which kind of move was made. Corresponds to one of the following:
  moveType = null;
  // playedCard: Card | null
  playedCard = null;
  // targetCardId: Card | null
  targetCardId = null;
  // targetCard2Id: Card | null
  targetCard2Id = null;
  // turn: int - which turn number the move was made on
  turn = 0;
  // phase: enum - What phase of a turn the game is currently in. Used to validate which next-moves are legal
  phase = null;
  // p0: Player
  p0 = null;
  // p1: Player
  p1 = null;
  // deck: Array<Card>: Cards in the deck, in order (this removes the need for topCard and secondCard)
  deck = null;
  // scrap: Array<Card>
  scrap = null;
  // oneOff: Card | null
  oneOff = null;
  // oneOffTarget: Card | null
  oneOffTarget = null;
  // twos: Card | null
  twos = null;
  // resolving: Card | null
  resolving = null;
  // gameId: ID - FK to the games table
  gameId = null;
  // createdAt: timestampz - When the move took place
  createdAt =null;
}