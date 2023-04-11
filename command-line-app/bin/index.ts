#!/usr/bin/env node

// first run npm install -g
// then run CLI with "send_command file.txt"

const axios = require("axios").default;
const url = "http://localhost:80"
const fs = require("fs");

import { json2xml } from 'xml-js';
import { omit } from 'lodash';

class Command {
  transactionId: number | null;
  username: string | null;
  amount: number | null;
  stockSymbol: string | null;
  filename: string | null;

  constructor(transactionId: number | null, username: string | null, amount: number | null, stockSymbol: string | null, filename: string | null) {
    this.transactionId = transactionId;
    this.username = username;
    this.amount = amount;
    this.stockSymbol = stockSymbol;
    this.filename = filename;
  }
}

function add(command:string) {
  console.log("in add function");

  var username = command[2];
  var amount = parseFloat(command[3]);
  var transactionId = parseInt(command[0]);
  console.log("transaction id: ", transactionId);

  console.log("username: ", username);
  console.log("amount: ", amount);

  const commandToSend = new Command(transactionId, username, amount, null, null);
  var functionURL = url + '/add';
  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function quote(command:string) {
  console.log("in quote function");
  var transactionId = parseInt(command[0]);
  var username = command[2];
  var stockSymbol = command[3];

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);

  const commandToSend = new Command(transactionId, username, null, stockSymbol, null);
  var functionURL = url + '/quote';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function sell(command:string) {
  console.log("in sell function");
  var transactionId = parseInt(command[0]);
  var username = command[2];
  var stockSymbol = command[3];
  var amount = parseFloat(command[4]);

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(transactionId, username, amount, stockSymbol, null);
  var functionURL = url + '/sell';
  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function buy(command:string) {
  console.log("in buy function");
  var transactionId = parseInt(command[0]);
  var username = command[2];
  var stockSymbol = command[3];
  var amount = parseFloat(command[4]);

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(transactionId, username, amount, stockSymbol, null);
  var functionURL = url + '/buy';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function commitBuy(command:string) {
  console.log("in commitBuy function");
  var transactionId = parseInt(command[0]);
  var username = command[2];

  console.log("username: ", username);

  const commandToSend = new Command(transactionId, username, null, null, null);
  var functionURL = url + '/commitBuy';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function cancelBuy(command:string) {
  console.log("in cancelBuy function");
  var transactionId = parseInt(command[0]);
  var username = command[2];

  console.log("username: ", username);

  const commandToSend = new Command(transactionId, username, null, null, null);
  var functionURL = url + '/cancelBuy';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function commitSell(command:string) {
  console.log("in commitSell function");
  var transactionId = parseInt(command[0]);
  var username = command[2];

  console.log("username: ", username);

  const commandToSend = new Command(transactionId, username, null, null, null);
  var functionURL = url + '/commitSell';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function cancelSell(command:string) {
  console.log("in cancelSell function");
  var transactionId = parseInt(command[0]);
  var username = command[2];

  console.log("username: ", username);

  const commandToSend = new Command(transactionId, username, null, null, null);
  var functionURL = url + '/cancelSell';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function setBuyAmount(command:string) {
  console.log("in setBuyAmount function");
  var transactionId = parseInt(command[0]);
  var username = command[2];
  var stockSymbol = command[3];
  var amount = parseFloat(command[4]);
  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(transactionId, username, amount, stockSymbol, null);
  var functionURL = url + '/setBuyAmount';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function cancelSetBuy(command:string) {
  console.log("in cancelSetBuy function");
  var transactionId = parseInt(command[0]);
  var username = command[2];
  var stockSymbol = command[3];

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);

  const commandToSend = new Command(transactionId, username, null, stockSymbol, null);
  var functionURL = url + '/cancelSetBuy';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function setBuyTrigger(command:string) {
  console.log("in setBuyTrigger function");
  var transactionId = parseInt(command[0]);
  var username = command[2];
  var stockSymbol = command[3];
  var amount = parseFloat(command[4]);

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(transactionId, username, amount, stockSymbol, null);
  var functionURL = url + '/setBuyTrigger';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function setSellAmount(command:string) {
  console.log("in setSellAmount function");
  var transactionId = parseInt(command[0]);
  var username = command[2];
  var stockSymbol = command[3];
  var amount = parseFloat(command[4]);

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(transactionId, username, amount, stockSymbol, null);
  var functionURL = url + '/setSellAmount';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function setSellTrigger(command:string) {
  console.log("in setSellTrigger function");
  var transactionId = parseInt(command[0]);
  var username = command[2];
  var stockSymbol = command[3];
  var amount = parseFloat(command[4]);

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);
  console.log("amount: ", amount);

  const commandToSend = new Command(transactionId, username, amount, stockSymbol, null);
  var functionURL = url + '/setSellTrigger';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function cancelSetSell(command:string) {
  console.log("in cancelSetSell function");
  var transactionId = parseInt(command[0]);
  var username = command[2];
  var stockSymbol = command[3];

  console.log("username: ", username);
  console.log("stockSymbol: ", stockSymbol);

  const commandToSend = new Command(transactionId, username, null, stockSymbol, null);
  var functionURL = url + '/cancelSetSell';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      console.log(response.data);
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function userDumplog(command:string) {
  console.log("in userDumplog function");
  var transactionId = parseInt(command[0]);
  var username = command[2];
  var filename = command[3];

  console.log("username: ", username);
  console.log("filename: ", filename);

  const commandToSend = new Command(transactionId, username, null, null, filename);
  var functionURL = url + '/dumplog';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      // console.log(response.data);
      const data = JSON.stringify(response.data);

      const xml = json2xml(response.data.map((data:any) => {
        const elemName = data.type;
        return { [elemName]: omit(data, 'type') };
      }
      ), { compact: true });

      fs.writeFile(filename, xml, function(err:any) {
        if (err) {
            console.log(err);
        }
      });
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function totalDumplog(command:string) {
  console.log("in totalDumplog function");
  var transactionId = parseInt(command[0]);
  var filename = command[2];

  console.log("filename: ", filename);

  const commandToSend = new Command(transactionId, null, null, null, filename);
  var functionURL = url + '/dumplog';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      // console.log(response.data);
      const data = JSON.stringify(response.data);

      const xml = json2xml(response.data.map((data:any) => {
        return { elemName: omit(data, 'type') };
      }
      ), { compact: true });

      fs.writeFile(filename, xml, function(err:any) {
        if (err) {
            console.log(err);
        }
      });
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function displaySummary(command:string) {
  console.log("in displaySummary function");
  var transactionId = parseInt(command[0]);
  var username = command[2];

  console.log("username: ", username);

  const commandToSend = new Command(transactionId, username, null, null, null);
  var functionURL = url + '/displaySummary';

  axios
    .post(functionURL, commandToSend)
    .then((response:any) => {
      // console.log(response.data);
      const data = JSON.stringify(response.data);
      fs.writeFile("summar.json", data, function(err:any) {
        if (err) {
            console.log(err);
        }
      });
      //res.status(200).json(response.data);
    })
    .catch((error:any) => {
      console.log("###error in CLI###");
      console.log(error);
    });
}

function main() {
  var command = "";
  var data = fs.readFileSync("put path here").toString().split("\n");
  const startTime = Date.now();
  for (let i = 0; i < data.length; i++) {
    //console.log(data[line])
    data[i] = data[i].toString().replace(/[\[\]']+/g,'');
    command = data[i].split(/[ ,]+/);
    //command = command.toString().replace(/[\[\]']+/g,'');
    console.log(command[0]);

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
  const endTime = Date.now();
  const totalTime = Math.floor(endTime - startTime)/1000;
  console.log("Total time: ", totalTime, " seconds");
  console.log("Averate transaction time: ", data.length/totalTime, " /second");

  return 0;
}

main();