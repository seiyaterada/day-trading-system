export interface User {
    // transId: string;
    userId: string;
}

export interface BuySell {
    // transId: string;
    userId: string;
    stock: string;
    amount?: number;
}

export interface AddMoney {
    // transId: string;
    userId: string;
    amount: number;
}
