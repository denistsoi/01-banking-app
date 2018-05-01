// init project
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: true
}))

// add routes
const routes = require('./routes/lowdb');

app.use(express.static('public'));

// 1. create account
app.post('/api/createAccount', routes.createAccount);
// 2. deposit
app.post('/api/deposit', routes.deposit)
// 3. withdraw
app.post('/api/withdraw',routes.withdraw)
// 4. check balance
app.post('/api/checkBalance', routes.checkBalance)
// 5. change pin
app.post('/api/changePin', routes.changePin);

/**
 * debug routes
 */
app.delete('/api/deleteAccount', routes.deleteAccount)
app.get('/api/accounts', routes.listAccounts);

// index
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
