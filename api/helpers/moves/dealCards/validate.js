
module.exports = {
 friendlyName: 'Validate start newGame is legal',


 description:
   'Throws error if it is illegal',


 inputs: {
  turn: {
     type: 'number',
     description: 'which turn on the game records.'
   }
 },
 sync: true, // synchronous helper
 fn: ({ turn }, exits) => {

  if(turn === 0){
    return exits.success();
  }

   return exits.error({message: 'game already initialised'});
 },
};


