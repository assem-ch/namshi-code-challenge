import express from 'express';
import {createBalance, createTransaction, getBalance, getTransaction, listTransactions} from "./controllers";
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/balances/', createBalance)
router.get('/balances/:balanceId/', getBalance)
router.get('/balances/:balanceId/transactions/', listTransactions);
router.post('/balances/:balanceId/transactions/', createTransaction)
router.get('/balances/:balanceId/transactions/:transactionId/', getTransaction)



export default router;
