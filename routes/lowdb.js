const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./.data/lowdb/users.json')
const db = low(adapter);


db.defaults({ accounts: [], count: 0}).write();

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

/**
  1. create account
  get name, pin and generate Account number
  render account number
*/
const createAccount = async (req, res) => {
  const { name, pin } = req.body;
  
  // TODO
  // validate name and pin
  
  const account = new Account({ name, pin });

  // find if duplicate...
  await db.get('accounts').push(account).write();
  await db.update('count', n => n+1).write();
  res.json(account.details);
}


/**
  2. deposit
  enter account number
  enter pin
  - enter deposit 
  or 
  - send error
*/
const deposit = (req, res) => {
  const { id, pin, deposit } = req.body;

  // validate account & pin
  db.get('accounts').find({ id })
}

/**
   3. withdraw
   enter account number
   enter pin
   - enter amount 
     - deduct amount or send insufficient funds
   or
   - send error
*/
const withdraw = (req, res) => {
  const { id, pin, withdrawal } = req.body;
  
  // validate account & pin
}

/**
   4. check balance
   enter account number
   enter pin
   - send balance amount
   or 
   - send error
*/
const checkBalance = (req, res) => {
  const { id, pin } = req.body;
  
  // validate account & pin
}


/**
    5. change pin
*/
const changePin = (req, res) => {
  const { id, oldPin, newPin, newPinConfirmation } = req.body;
  
  // validate account & pin
}

// debug - list users
const listAccounts = async (req, res) => {
  let accounts = await db.get('accounts').value();
  let numberOfAccounts = await accounts.length
  
  res.json({ accounts, count: numberOfAccounts });
}

// delete account
const deleteAccount = async (req, res) => {
  const { id } = req.body;

  // delete account
}


// module exports
module.exports = {
  createAccount,
  deposit,
  withdraw,
  checkBalance, 
  changePin,
  listAccounts,
  deleteAccount
};