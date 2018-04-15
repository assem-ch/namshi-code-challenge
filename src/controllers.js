

import {createMySqlConnection, createMySqlPool} from "./mysql";

async function createBalance(req, res, next){


    const connection = await createMySqlConnection()

    let result =  await connection.query('INSERT INTO balances VALUES ()',[])

    console.log(result)
    return res.status(200).json({ "id": result[0].insertId})

}


async function getBalance(req, res, next){
    const id = req.params.balanceId

    const connection = await createMySqlConnection()

    let [rows, fields] =  await connection.execute('SELECT * FROM balances WHERE id = ? LOCK IN SHARE MODE',[id])

    await connection.commit()

    console.warn(rows, fields)
    return res.status(200).json(rows[0])

}

async function listTransactions(req, res, next){
    const account_nr = req.params.balanceId

    const connection = await createMySqlConnection()

    let [rows, fields] =  await connection.query('SELECT * FROM transactions WHERE account_nr = ?', [account_nr])

    return res.status(200).json(rows)
}


async function createTransaction(req, res, next){
    const account_nr = req.params.balanceId
    const amount = req.body.amount

    const connection = await createMySqlConnection()


    await connection.beginTransaction()

    let [rows, fields] =  await connection.query('Select balance FROM balances WHERE account_nr = ? FOR UPDATE', [ account_nr])
    let [rows2, fields2] =  await connection.query('UPDATE balances SET balance = balance + ?  WHERE account_nr = ?', [amount, account_nr])
    let [rows3, fields3]  =  await connection.query('INSERT INTO transactions (amount, account_nr) VALUES ( ?, ?)', [amount, account_nr])

    await connection.commit()

    return res.status(200).json(rows2)
}
async function getTransaction(req, res, next){
    const id = req.params.transactionId
    const connection = await createMySqlConnection()

    let result =  await connection.query('SELECT * FROM transactions WHERE id = ?',[id])


    console.warn(id, result)
    return res.status(200).json({ "id": result})
}










export { createBalance, listTransactions, createTransaction, getTransaction, getBalance }
