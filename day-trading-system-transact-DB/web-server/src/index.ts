import express from 'express';
import cors from 'cors';
import { User, BuySell } from './interfaces';
import axios from 'axios';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.json("main page");
  });

interface AddMoney {
    userId: string;
    amount: number;
}

// Add money to user account
app.post('/add', (req, res) => {
    const addMoney :AddMoney = {
        // userId: req.body.userId,
        // amount: req.body.amount,
        userId: 'testUser',
        amount: 16.00,
    } 

    // make a request to the account service
    axios.post('http://localhost:3000/add', addMoney)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

// Get quote of a stock
app.post('/quote', (req, res) => {
    const addMoney :AddMoney = {
        userId: req.body.userId,
        amount: req.body.amount,
    } 

    res.status(200).json("money added");
});

// Buy a stock
app.post('/buy', (req, res) => {
    const buy :BuySell = {
        userId: req.body.userId,
        stock: req.body.stock,
        amount: req.body.amount,
    }
    // make a request to the stock service
    axios.post('http://localhost:3000/buy', buy)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

// Commit a buy
app.post('/commitBuy', (req, res) => {
    const userCommit :User = {
        userId: req.body.userId,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/commitBuy', userCommit)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

// Cancel a buy
app.post('/cancelBuy', (req, res) => {
    const userCancel :User = {
        userId: req.body.userId,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/cancelBuy', userCancel)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

// Sell a stock
app.post('/sell', (req, res) => {
    const addMoney :AddMoney = {
        userId: req.body.userId,
        amount: req.body.amount,
    } 

    res.status(200).json("money added");
});

// Commit a sell
app.post('/commitSell', (req, res) => {
    const sell :BuySell = {
        userId: req.body.userId,
        stock: req.body.stock,
        amount: req.body.amount,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/commitSell', sell)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

// Cancel a sell
app.post('/cancelSell', (req, res) => {
    const userCancel :User = {
        userId: req.body.userId,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/cancelSell', userCancel)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});


// Set a buy amount
app.post('/setBuyAmount', (req, res) => {
    const setBuy :BuySell = {
        userId: req.body.userId,
        stock: req.body.stock,
        amount: req.body.amount,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/setBuyAmount', setBuy)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

// Cancel a set buy
app.post('/cancelSetBuy', (req, res) => {
    const cancelBuy :BuySell = {
        userId: req.body.userId,
        stock: req.body.stock,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/cancelSetBuy', cancelBuy)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

// Set a buy trigger
app.post('/setBuyTrigger', (req, res) => {
    const buyTrigger :BuySell = {
        userId: req.body.userId,
        stock: req.body.stock,
        amount: req.body.amount,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/setBuyTrigger', buyTrigger)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

// Cancel a set buy trigger
app.post('/cancelSetBuyTrigger', (req, res) => {
    const cancelBuy :BuySell = {
        userId: req.body.userId,
        stock: req.body.stock,
    }
    // make a request to the account service
    axios.post('http://localhost:3000/cancelSetBuyTrigger', cancelBuy)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
});

// Set a sell amount
app.post('/setSellAmount', (req, res) => {
    const setSell :BuySell = {
        userId: req.body.userId,
        stock: req.body.stock,
        amount: req.body.amount,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/setSellAmount', setSell)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

// Set a sell trigger
app.post('/setSellTrigger', (req, res) => {
    const sellTrigger :BuySell = {
        userId: req.body.userId,
        stock: req.body.stock,
        amount: req.body.amount,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/setSellTrigger', sellTrigger)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

// Cancel a set sell
app.post('/cancelSetSell', (req, res) => {
    const cancel :BuySell = {
        userId: req.body.userId,
        stock: req.body.stock,
        amount: req.body.amount,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/cancelSetSell', cancel)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

// History of transactions
app.post('/dumplog', (req, res) => {
    const user :User = {
        userId: req.body.userId,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/dumplog', user)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});


// Summary of a users transaction history
app.post('/displaySummary', (req, res) => {
    const addMoney :AddMoney = {
        userId: req.body.userId,
        amount: req.body.amount,
    } 
    // make a request to the account service
    axios.post('http://localhost:3000/displaySummary', addMoney)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
    // res.status(200).json("money added");
});

app.listen(4000, () =>
  console.log(`
🚀 Server ready at: http://localhost:4000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);