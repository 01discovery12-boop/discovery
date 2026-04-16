// Advanced Banking App Implementation

class BankAccount {
    constructor(accountNumber, accountHolder, balance = 0) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = balance;
    }

    deposit(amount) {
        if (amount <= 0) {
            throw new Error('Deposit amount must be positive.');
        }
        this.balance += amount;
        return this.balance;
    }

    withdraw(amount) {
        if (amount <= 0) {
            throw new Error('Withdrawal amount must be positive.');
        }
        if (amount > this.balance) {
            throw new Error('Insufficient funds.');
        }
        this.balance -= amount;
        return this.balance;
    }

    getBalance() {
        return this.balance;
    }

    getAccountDetails() {
        return {
            accountNumber: this.accountNumber,
            accountHolder: this.accountHolder,
            balance: this.balance
        };
    }
}

class Bank {
    constructor() {
        this.accounts = {};
    }

    addAccount(account) {
        if (this.accounts[account.accountNumber]) {
            throw new Error('Account already exists.');
        }
        this.accounts[account.accountNumber] = account;
    }

    removeAccount(accountNumber) {
        if (!this.accounts[accountNumber]) {
            throw new Error('Account not found.');
        }
        delete this.accounts[accountNumber];
    }

    getAccount(accountNumber) {
        return this.accounts[accountNumber];
    }

    transferFunds(fromAccountNumber, toAccountNumber, amount) {
        const fromAccount = this.getAccount(fromAccountNumber);
        const toAccount = this.getAccount(toAccountNumber);
        if (!fromAccount || !toAccount) {
            throw new Error('Invalid account number(s).');
        }
        fromAccount.withdraw(amount);
        toAccount.deposit(amount);
    }
}

// Example usage
const bank = new Bank();
const account1 = new BankAccount('123456', 'John Doe', 1000);
const account2 = new BankAccount('654321', 'Jane Doe', 500);
bank.addAccount(account1);
bank.addAccount(account2);
bank.transferFunds('123456', '654321', 200);
console.log(account1.getBalance()); // 800
console.log(account2.getBalance()); // 700
