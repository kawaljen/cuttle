const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

class Userstat {
    constructor(id, username) {
      this.id = id ;
      this.username = username;
      this.firstPlace =  0;
      this.secondPlace =  0;
      this.thirdPlace =  0;
      this.won = 0;
      this.played =  0;
    }

    async setWon(){
      const requestedSeasonMatches = Match.find({
        winner : this.id,
      });
      const [matches] = await Promise.all([
        requestedSeasonMatches
      ]);
      this.won = matches.length;
  } 

  async setSeasonPlace(){
    const seasons = await await Season.find({
            where: { startTime: { '<=': dayjs.utc().toDate() } },
            sort: 'startTime DESC',
          }).populateAll();
          
      seasons.map((obj) => {
        if(obj.firstPlace && obj.firstPlace.username === this.username) {  this.firstPlace ++; }
        else if(obj.secondPlace && obj.secondPlace.username === this.username) {  this.secondPlace ++;}
        else if(obj.thirdPlace && obj.thirdPlace.username === this.username) { this.thirdPlace ++; }
      });
  }

    async setPlayed(){
      const requestedSeasonMatches = Match.find({
        or : [{
          player1 : this.id
        },
        {
          player2 : this.id
        }
        ]
      });
      const [matches] = await Promise.all([
        requestedSeasonMatches
      ]);
      this.played = matches.length;
  } 
}

  module.exports = {
    friendlyName: 'Get user Stats',
  
    description: 'Get user Stats',
  
    inputs: { 
      id: {
        type: 'number',
        required: true,
      },
      username: {
        type: 'string',
        required: true,
      },
    },
  
    fn: async ({ id, username }, exits) => {
      const userStat = new Userstat(id, username);
      await userStat.setWon();
      await userStat.setPlayed();
      await userStat.setSeasonPlace();
      return exits.success( userStat);
    },
  };