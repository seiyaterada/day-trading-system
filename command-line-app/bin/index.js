#!/usr/bin/env node

// first run npm install -g
// then run CLI with "send_command file.txt"

const axios = require("axios").default;

class Command {
  constructor(username, amount, stockSymbol, filename) {
    this.username = username;
    this.amount = amount;
    this.stockSymbol = stockSymbol;
    this.filename = filename;
  }
}

function add(command) {
  console.log("in add function");

  var username = command[2];
  var amount = parseFloat(command[3]);

  console.log("username: ", username);
  console.log("amount: ", amount);

  const commandToSend = new Command(username, amount);

  axios
    .post("http://localhost:3000/add", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function quote(command) {
  console.log("in quote function");
  var username = command[2];
  var stockSymbol = command[3];

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);

  const commandToSend = new Command(username, null, stockSymbol);

  axios
    .post("http://localhost:3000/quote", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function sell(command) {
  console.log("in sell function");
  var username = command[2];
  var stockSymbol = command[3];
  var amount = parseFloat(command[4]);

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(username, amount, stockSymbol);

  axios
    .post("http://localhost:3000/sell", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function buy(command) {
  console.log("in buy function");
  var username = command[2];
  var stockSymbol = command[3];
  var amount = parseFloat(command[4]);

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(username, amount, stockSymbol);

  axios
    .post("http://localhost:3000/buy", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function commitBuy(command) {
  console.log("in commitBuy function");
  var username = command[2];

  console.log("username: ", username);

  const commandToSend = new Command(username);

  axios
    .post("http://localhost:3000/commitBuy", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function cancelBuy(command) {
  console.log("in cancelBuy function");
  var username = command[2];

  console.log("username: ", username);

  const commandToSend = new Command(username);

  axios
    .post("http://localhost:3000/cancelBuy", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function commitSell(command) {
  console.log("in commitSell function");
  var username = command[2];

  console.log("username: ", username);

  const commandToSend = new Command(username);

  axios
    .post("http://localhost:3000/commitSell", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function cancelSell(command) {
  console.log("in cancelSell function");
  var username = command[2];

  console.log("username: ", username);

  const commandToSend = new Command(username);

  axios
    .post("http://localhost:3000/cancelSell", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function setBuyAmount(command) {
  console.log("in setBuyAmount function");
  var username = command[2];
  var stockSymbol = command[3];
  var amount = parseFloat(command[4]);
  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(username, amount, stockSymbol);

  axios
    .post("http://localhost:3000/setBuyAmount", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function cancelSetBuy(command) {
  console.log("in cancelSetBuy function");
  var username = command[2];
  var stockSymbol = command[3];

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);

  const commandToSend = new Command(username, null, stockSymbol);

  axios
    .post("http://localhost:3000/cancelSetBuy", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function setBuyTrigger(command) {
  console.log("in setBuyTrigger function");
  var username = command[2];
  var stockSymbol = command[3];
  var amount = command[4];

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(username, amount, stockSymbol);

  axios
    .post("http://localhost:3000/setBuyTrigger", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function setSellAmount(command) {
  console.log("in setSellAmount function");
  var username = command[2];
  var stockSymbol = command[3];
  var amount = parseFloat(command[4]);

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(username, amount, stockSymbol);

  axios
    .post("http://localhost:3000/setSetllAmount", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function setSellTrigger(command) {
  console.log("in setSellTrigger function");
  var username = command[2];
  var stockSymbol = command[3];
  var amount = parseFloat(command[4]);

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(username, amount, stockSymbol);

  axios
    .post("http://localhost:3000/setSellTrigger", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function cancelSetSell(command) {
  console.log("in cancelSetSell function");
  var username = command[2];
  var stockSymbol = command[3];

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);

  const commandToSend = new Command(username, null, stockSymbol);

  axios
    .post("http://localhost:3000/cancelSetSell", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function userDumplog(command) {
  console.log("in userDumplog function");
  var username = command[2];
  var filename = command[3];

  console.log("username: ", username);
  console.log("filename: ", filename);

  const commandToSend = new Command(username, null, null, filename);

  axios
    .post("http://localhost:3000/dumplog", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function totalDumplog(command) {
  console.log("in totalDumplog function");
  var filename = command[2];

  console.log("filename: ", filename);

  const commandToSend = new Command(null, null, null, filename);

  axios
    .post("http://localhost:3000/dumplog", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function displaySummary(command) {
  console.log("in displaySummary function");
  var username = command[2];

  console.log("username: ", username);

  const commandToSend = new Command(username);

  axios
    .post("http://localhost:3000/displaySummary", commandToSend)
    .then((response) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function main() {
  const fs = require("fs");
  var command = "";
  var data = fs.readFileSync("user1.txt").toString().split("\n");
  for (let i = 0; i < 2; i++) {
    //console.log(data[line])
    command = data[i].split(/[ ,]+/);
    console.log(command[1]);

    switch (command[1]) {
      case "ADD":
        add(command);
        break;
      case "QUOTE":
        quote(command);
        break;
      case "BUY":
        buy(command);
        break;
      case "COMMIT_BUY":
        commitBuy(command);
        break;
      case "CANCEL_BUY":
        cancelBuy(command);
        break;
      case "SELL":
        sell(command);
        break;
      case "COMMIT_SELL":
        commitSell(command);
        break;
      case "CANCEL_SELL":
        cancelSell(command);
        break;
      case "SET_BUY_AMOUNT":
        //setBuyAmount(command);
        break;
      case "CANCEL_SET_BUY":
        //cancelSetBuy(command);
        break;
      case "SET_BUY_TRIGGER":
        setBuyTrigger(command);
        break;
      case "SET_SELL_AMOUNT":
        //setSellAmount(command);
        break;
      case "SET_SELL_TRIGGER":
        //setSellTrigger(command);
        break;
      case "CANCEL_SET_SELL":
        //cancelSetSell(command);
        break;
      case "DUMPLOG":
        if (command.length < 4) {
          //totalDumplog(command);
          break;
        } else {
          //userDumplog(command);
          break;
        }
      case "DISPLAY_SUMMARY":
        //displaySummary(command);
        break;
    }
  }
}

main();
