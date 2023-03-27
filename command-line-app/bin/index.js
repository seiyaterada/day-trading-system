#!/usr/bin/env node

const axios = require("axios").default;

class Command {
  constructor(userid, amount, stock, filename) {
    this.userid = userid;
    this.amount = amount;
    this.stock = stock;
    this.filename = filename;
  }
}

function add(command) {
  console.log("in add function");

  var userid = command[2];
  var amount = parseFloat(command[3]);

  console.log("userid: ", userid);
  console.log("amount: ", amount);

  const commandToSend = new Command(userid, amount);

  axios
    .get("http://localhost:4000/add", commandToSend)
    .then((response) => {
      console.log(response.data);
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}


function quote(command) {
  console.log("in quote function");
  var userid = command[2];
  var stock = command[3];

  console.log("userid: ", userid);
  console.log("stock: ", stock);
}

function sell(command) {
  console.log("in sell function");
  var userid = command[2];
  var stock = command[3];
  var amount = parseFloat(command[4]);

  console.log("userid: ", userid);
  console.log("stock: ", stock);
  console.log("amount: ", amount);
}

function buy(command) {
  console.log("in buy function");
  var userid = command[2];
  var stock = command[3];
  var amount = parseFloat(command[4]);

  console.log("userid: ", userid);
  console.log("stock: ", stock);
  console.log("amount: ", amount);
}

function commitBuy(command) {
  console.log("in commitBuy function");
  var userid = command[2];

  console.log("userid: ", userid);
}

function cancelBuy(command) {
  console.log("in cancelBuy function");
  var userid = command[2];

  console.log("userid: ", userid);
}

function commitSell(command) {
  console.log("in commitSell function");
  var userid = command[2];

  console.log("userid: ", userid);
}

function cancelSell(command) {
  console.log("in cancelSell function");
  var userid = command[2];

  console.log("userid: ", userid);
}

function setBuyAmount(command) {
  console.log("in setBuyAmount function");
  var userid = command[2];
  var stock = command[3];
  var amount = parseFloat(command[4]);
  console.log("userid: ", userid);
  console.log("stock: ", stock);
  console.log("amount: ", amount);
}

function cancelSetBuy(command) {
  console.log("in cancelSetBuy function");
  var userid = command[2];
  var stock = command[3];

  console.log("userid: ", userid);
  console.log("stock: ", stock);
}

function setBuyTrigger(command) {
  console.log("in setBuyTrigger function");
  var userid = command[2];
  var stock = command[3];
  var amount = command[4];

  console.log("userid: ", userid);
  console.log("stock: ", stock);
  console.log("amount: ", amount);
}

function setSellAmount(command) {
  console.log("in setSellAmount function");
  var userid = command[2];
  var stock = command[3];
  var amount = parseFloat(command[4]);

  console.log("userid: ", userid);
  console.log("stock: ", stock);
  console.log("amount: ", amount);
}

function setSellTrigger(command) {
  console.log("in setSellTrigger function");
  var userid = command[2];
  var stock = command[3];
  var amount = parseFloat(command[4]);

  console.log("userid: ", userid);
  console.log("stock: ", stock);
  console.log("amount: ", amount);
}

function cancelSetSell(command) {
  console.log("in cancelSetSell function");
  var userid = command[2];
  var stock = command[3];

  console.log("userid: ", userid);
  console.log("stock: ", stock);
}

function userDumplog(command) {
  console.log("in userDumplog function");
  var userid = command[2];
  var filename = command[3];

  console.log("userid: ", userid);
  console.log("filename: ", filename);
}

function totalDumplog(command) {
  console.log("in totalDumplog function");
  var filename = command[2];

  console.log("filename: ", filename);
}

function displaySummary(command) {
  console.log("in displaySummary function");
  var userid = command[2];

  console.log("userid: ", userid);
}

function main() {
  const fs = require("fs");
  var command = "";
  var data = fs.readFileSync("user1.txt").toString().split("\n");
  for (let i = 0; i < data.length; i++) {
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
        setBuyAmount(command);
        break;
      case "CANCEL_SET_BUY":
        cancelSetBuy(command);
        break;
      case "SET_BUY_TRIGGER":
        setBuyTrigger(command);
        break;
      case "SET_SELL_AMOUNT":
        setSellAmount(command);
        break;
      case "SET_SELL_TRIGGER":
        setSellTrigger(command);
        break;
      case "CANCEL_SET_SELL":
        cancelSetSell(command);
        break;
      case "DUMPLOG":
        if (command.length < 4) {
          totalDumplog(command);
          break;
        } else {
          userDumplog(command);
          break;
        }
      case "DISPLAY_SUMMARY":
        displaySummary(command);
        break;
    }
  }
}

main();
