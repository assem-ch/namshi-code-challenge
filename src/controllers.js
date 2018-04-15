const {createMySqlConnection} = require("./helpers");


async function createTransaction(req, res, next) {
    const from = req.body.from;
    const to = req.body.to;
    const amount = req.body.amount;

    if (!from || !to) {
        return res.status(400).json({
            "success": false,
            "error": "You should define the 2 sides of transaction via *to* and *from*"
        })
    }

    if (from === to) {
        return res.status(403).json({
            "success": false,
            "error": "Transaction from and to the same person is forbidden"
        })
    }


    if (!amount || amount < 0) {
        return res.status(400).json({"success": false, "error": "You should define amount as positive non-zero value"})
    }

    // TODO prevent duplicate requests
    const connection = await createMySqlConnection();

    try {

        await connection.beginTransaction();

        let [[sourceBalance]] = await connection.execute('Select account_nr, balance FROM balances WHERE account_nr = ? FOR UPDATE', [from]);
        let [[destBalance]] = await connection.execute('Select account_nr, balance FROM balances WHERE account_nr = ? FOR UPDATE', [to]);

        if (!sourceBalance || !destBalance) {
            await connection.rollback();
            return res.status(404).json({
                "success": false,
                "error": "Source or Destination is not a valid bank account"
            })
        }

        if (sourceBalance.balance < amount) {
            await connection.rollback();
            return res.status(403).json({"success": false, "error": "Source balance has not the complete amount"})
        }

        await connection.execute('UPDATE balances SET balance = balance - ?  WHERE account_nr = ?', [amount, from]);
        await connection.execute('UPDATE balances SET balance = balance + ?  WHERE account_nr = ?', [amount, to]);
        await connection.execute('INSERT INTO transactions (amount, account_nr) VALUES ( ?, ?)', [amount, from]);
        await connection.execute('INSERT INTO transactions (amount, account_nr) VALUES ( ?, ?)', [amount, to]);
        await connection.commit();

        return res.status(200).json({"success": true})

    } catch (err) {
        await connection.rollback();
        return res.status(500).json({"success": false, "error": err})
    }

}


async function createBalance(req, res, next) {
    const initialBalance = req.body.initial_balance || 0;

    const connection = await createMySqlConnection();

    const [result] = await connection.execute('INSERT INTO balances (balance) VALUES (?)', [initialBalance]);

    return res.status(200).json({"success": true, "id": result.insertId})
}

async function getBalance(req, res, next) {
    const accountNumber = req.params.accountNumber;

    if (!accountNumber) {
        return res.json(400).json({"error": "accountNumber is mandatory"})
    }

    try {
        const connection = await createMySqlConnection();
        let [[row]] = await connection.execute('SELECT * FROM balances WHERE account_nr = ? LOCK IN SHARE MODE', [accountNumber]);
        return res.status(200).json(row)
    } catch (err) {
        return res.status(500)
    }
}


async function listBalances(req, res, next) {

    const connection = await createMySqlConnection();

    let [rows] = await connection.execute('SELECT * FROM balances', []);

    return res.status(200).json(rows)
}

async function listTransactions(req, res, next) {
    const accountNumber = req.query.account_number;

    if (!accountNumber) {
        return res.status(400).json({"error": "account_number is mandatory"})
    }

    const connection = await createMySqlConnection();

    let [rows] = await connection.execute('SELECT * FROM transactions WHERE account_nr = ?', [accountNumber]);

    return res.status(200).json(rows)
}


async function getTransaction(req, res, next) {
    const reference = req.params.reference;
    const connection = await createMySqlConnection();

    let result = await connection.execute('SELECT * FROM transactions WHERE id = ?', [reference]);

    return res.status(200).json({"id": result})
}


module.exports = {createBalance, listTransactions, createTransaction, getTransaction, getBalance, listBalances};
