const Datastore = require('nedb-promise');
// Security note: the database is saved to the file `datafile` on the local filesystem. 
// It's deliberately placed in the `.data` directory
// which doesn't get copied if someone remixes the project.
const db = new Datastore({ filename: '../.data/nedb/users.json', autoload: true });

db.count({}, (err, count) => {
  console.log("There are " + count + " users in the database");
  
  if(err) { 
    console.log("There's a problem with the database: ", err); 
    throw new Error("there was an error with database", err);
    return;
  } 
  
  if(count <= 0){ 
    // empty database so needs populating
    // default users inserted in the database
    console.log("there are no accounts here");
  }
});

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
const createAccount = (req, res) => {
  const name = req.body.name;
  const pin  = req.body.pin;
  
  const userDetails = { name: name, pin: pin };
  const acc = new Account(userDetails);
  
  console.log('create account');
  
  db.find({ id: acc.id }, (err, users) => {
    console.log(err, users);
    if (err) {
      throw new Error('there was a problem with the database', err);
    }
    
    if (users) {
       // todo - create new account 
    }
    
    if (!users.length) {
      db.insert(acc, (err, newAccount) => {
        if (err) {
          throw new Error('there was a problem with the database', err);
        }      
        res.json(newAccount)
      }) 
    }
  });
  
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
  const id = req.body.id;
  const pin = req.body.pin;
  
  // validate account & pin
  db.findOne({ id: id }, (err, user) => {
    console.log(err, user);
    if (err) {
      throw new Error('there was a problem with the database', err);
    } 
    // no user found
    if (!user) {
      res.send("error")
      return;
    }
    
    // incorrect pin
    if (user.pin !== pin) {
      res.send("please retry pin entry");
      return;
    } 
    
    
  });
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
  const Account = req.body.account;
  const Pin = req.body.pin;
  
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
  const account = req.body.account;
  const pin = req.body.pin;
  
  // validate account & pin
}


/**
    5. change pin
*/
const changePin = (req, res) => {
  const account = req.body.account;
  const pin = req.body.pin;
  
  // validate account & pin
}

// debug - list users
const listUsers = (req, res) => {
  // db.find({}, (err, users) => {
  //   users = users.map(user => {
  //     return { 
  //       id: user.id,
  //       name: user.name
  //     }
  //   })
    
  //   res.json(users)
  // })
}

// delete account
const deleteAccount = async (req, res) => {
  let id = req.body.id;
  const account = await db.findOne({ id: id })
  await console.log(account)
  // if (!account) {
  //   res.send('no account found');
  // }
  
  
  // await db.remove({ id }, (err, numRemoved) => {
  //   if (err) {
  //     throw new Error('there was a problem with the database', err);
  //   } 
  //   if (!numRemoved) {
  //     res.send("account does not exist");
  //   }
  //   if (numRemoved) {
  //     res.send("account id: "+ id + " removed");
  //   }
  // })
}


// module exports
module.exports = {
  createAccount,
  deposit,
  withdraw,
  checkBalance, 
  changePin,
  listUsers,
  deleteAccount
};