export interface Stock {
    stockSymbol: string;
    price?: number;
    quantity?: number;
}

export interface AutoTransaction {
    symbol: string;
    amount: number;
    triggerPrice: number;
}

export interface User {
    username: string;
    balance: number;
    reservedBalance?: number;
    stocks?: Stock[];
    reservedStocks?: Stock[];
    uncommittedBuys?: UncommittedTransaction[];
    uncommittedSells?: UncommittedTransaction[];
}

export interface UncommittedTransaction {
    symbol: string;
    price: number;
    quantity: number;
    expiryTime: number;
}

/*
<!-- User commands come from the user command files or from manual entries in 
the students' web forms -->
*/
export interface UserCommandType {
    transactionId: number;
    timestamp: string;
    server: string;
    action: string;
    username: string; // default none
    stockSymbol: string; // default none
    filename: string; // default none
    funds: number; // default none
}

/*
<!-- Every hit to the quote server requires a log entry with the results. The 
price, symbol, username, timestamp and cryptokey are as returned by the quote server -->
*/
export interface QuoteServerType {
    transactionId: number;
    timestamp: string;
    server: string;
    price: number;
    stockSymbol: string;
    username: string;
    quoteServerTime: number;
    cryptokey: string;
}

/*
<!-- Any time a user's account is touched, an account message is printed.  
Appropriate actions are "add" or "remove". -->
*/
export interface AccountTransactionType {
    transactionId: number;
    timestamp: string;
    server: string;
    action: string;
    username: string;
    stockSymbol: string;
    funds: number;
}
/*
<!-- System events can be current user commands, interserver communications, 
or the execution of previously set triggers -->
*/
export interface SystemEventType {
    transactionId: number;
    timestamp: string;
    server: string;
    command: string;
    username: string; // default none
    stockSymbol: string; // default none
    filename: string; // default none
    funds: number; // default none
}

/*
<!-- Error messages contain all the information of user commands, in 
addition to an optional error message -->
*/
export interface ErrorType {
    transactionId: number;
    timestamp: string;
    server: string;
    command: string; 
    errorMessage: string; // default none
    username: string; // default none
    stockSymbol: string; // default none
    funds: number; // default none
    filename: string; // default none
}

/*
<!-- Debugging messages contain all the information of user commands, in 
addition to an optional debug message -->
*/
export interface DebugType {
    transactionId: number;
    timestamp: string;
    server: string;
    command: string;
    debugMessage: string; // default none
    username: string; // default none
    stockSymbol: string; // default none
    funds: number; // default none
    filename: string; // default none
}