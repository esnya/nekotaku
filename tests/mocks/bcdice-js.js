const sinon = require('sinon');

class BCDice {
  constructor() {
    this.setGameByTitle = sinon.spy();
    this.setCollectRandResult = sinon.spy();
    this.setMessage = sinon.spy();
    this.diceCommand = sinon.spy();
    this.getRandResults = sinon.spy();
  }
}

BCDice.DiceBotResolver = {
  setCustomLoader: sinon.spy(),
};

BCDice.DiceBotLoader = {
  collectDiceBotDescriptions: sinon.spy(() => []),
};

module.exports = BCDice;
