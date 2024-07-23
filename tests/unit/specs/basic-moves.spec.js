import { describe, expect, it } from 'vitest';

const fixture = {
    createdAt : Date.now(),
    updatedAt : Date.now(),
    id : 1,
    name : 'Test Game',
    status : 1,
    p0Ready : true,
    p1Ready : false,
    p0Rematch : null,
    p1Rematch : null,
    passes : 0,
    oneOffTargetType : '',
    turn : 0,
    log : [],
    turnStalemateWasRequestedByP0 : -1,
    turnStalemateWasRequestedByP1 : -1,
    chat : [],
    isRanked : false,
    lastEvent : {},
    lock : null,
    lockedAt : null,
    rematchGame : null,
    topCard : null,
    secondCard : null,
    oneOff : null,
    resolving : null,
    oneOffTarget : null,
    attachedToTarget : null,
    p0 : null, //8
    p1 : null, //9
    match : null,
    winner : null,
    players : [
      {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        id : 8,
        username : 'myUsername',
        encryptedPassword : '$2a$10$KSBSuIOI3ZZWHX/N0fPAVOd7vRYZLDLDpiCiqTPjMn5qGXZp/7lpe',
        pNum : 0,
        rank : 1000,
        game : 1,
        frozenId : null
      },
      {
        createdAt : Date.now(),
        updatedAt : Date.now(),
        id : 9,
        username : 'definitelyNotTheGovernment6969',
        encryptedPassword : '$2a$10$iX8HvDUo1HQa18.bhwcroON0bQSLQ48Vk3FZqS6iqueYBzIjmzaEi',
        pNum : 1,
        rank : 1000,
        game : 1,
        frozenId : null
      }
    ]   
};



describe('Deals cards', () => {

  it('Distribution of cards should be : 5 in p0 hand and 6 in p1 hand, 49 in deck', async () => {
    const gameState = await sails.helpers.moves.dealcards.dealCards(fixture); 
    expect(gameState.p0.hand.length).toBe(5);
    expect(gameState.p1.hand.length).toBe(6);
    expect(gameState.deck.length).toBe(49);
  });
});
