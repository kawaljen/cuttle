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

  constructor(game) {
      this.p0 = game.p0 ? game.p0 : null; 
      this.p1 = game.p1 ? game.p1 : null; 
      this.deck = game.deck ?  game.deck :null;
      this.name =  game.gameId ?  game.gameId :null; 
  }
}

module.exports = GameState;