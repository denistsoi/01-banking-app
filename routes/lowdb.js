const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./.data/lowdb/users.json')
const db = low(adapter);

const Account = require('../lib/account');

db.defaults({ accounts: [], count: 0}).write();

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
const deposit = async (req, res) => {
  const { id, pin, deposit } = req.body;

  // validate account & pin
  let account = await db.get('accounts').find({ id: parseInt(id) }).value();
  
  if (!account) {
    return res.send("Err: no account");
  }

  if (account.pin !== pin) {
    return res.send("Err: pin error");
  }

  await db
    .get('accounts')
    .find({ id: parseInt(id) })
    .assign({ 
      balance: account.balance + parseInt(deposit) 
    })
    .write();

  return res.send("Deposit has been entered into account");
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
const withdraw = async (req, res) => {
  const { id, pin, withdrawal } = req.body;
  
  let account = await db.get('accounts').find({ id: parseInt(id) }).value();
  
  if (!account) {
    return res.send("Err: no account");
  }

  if (account.pin !== pin) {
    return res.send("Err: pin error");
  }

  if (account.balance < withdrawal) {
    return res.send("Err: insufficient balance");
  }

  await db
    .get('accounts')
    .find({ id: parseInt(id) })
    .assign({ 
      balance: account.balance - parseInt(withdrawal)
    })
    .write();

  return res.send("Successful withdrawal"); 
}

/**
   4. check balance
   enter account number
   enter pin
   - send balance amount
   or 
   - send error
*/
const checkBalance = async (req, res) => {
  const { id, pin } = req.body;
  
  // validate account & pin
  let account = await db.get('accounts').find({ id: parseInt(id) }).value();
  
  if (!account) {
    return res.send("Err: no account");
  }

  if (account.pin !== pin) {
    return res.send("Err: pin error");
  }

  return res.send("Balance: " + account.balance);   
}


/**
    5. change pin
*/
const changePin = async (req, res) => {
  const { id, oldPin, newPin, newPinConfirmation } = req.body;
  
  // validate account & pin

  let account = await db.get('accounts').find({ id: parseInt(id) }).value();
  
  if (!account) {
    return res.send("Err: no account");
  }

  if (account.pin !== pin) {
    return res.send("Err: pin error");
  }

  if (newPin !== newPinConfirmation) {
    return res.send("Err: new Pin error, does not match");
  }

  await db
    .get('accounts')
    .find({ id: parseInt(id) })
    .assign({ 
      pin: newPin
    })
    .write();

  return res.send("Pin successfully changed");
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
  res.send("Todo: delete account");
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