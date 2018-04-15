const express = require('express');
const {
    createBalance,
    createTransaction,
    getBalance,
    getTransaction,
    listBalances,
    listTransactions
} = require("./controllers");

let router = express.Router();

router.get('/', function (req, res, next) {
    res.status(200);
});


router.post('/balances/', createBalance);
router.get('/balances/', listBalances);
router.get('/balances/:accountNumber/', getBalance);
router.get('/transactions/', listTransactions);
router.post('/transactions/', createTransaction);
router.get('/transactions/:reference/', getTransaction);


module.exports = {router};
