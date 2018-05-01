// helper function
const generateAccount = () => {
  return Math.floor(Math.random()*90000) + 10000;
}

class Account {
  constructor(props) {
    this.id = generateAccount();
    this.name = props.name;
    this.pin = props.pin;
    this.balance = 0;
  }
  
  get details () {
    return {
      id: this.id,
      name: this.name,
      balance: this.balance,
    }
  }
}

module.exports = Account;