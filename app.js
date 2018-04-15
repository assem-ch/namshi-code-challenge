require('dotenv').config();

let createError = require('http-errors');
let express = require('express');
let logger = require('morgan');

let {router} = require('./src/router');
let {createMySqlConnection} = require('./src/helpers');


let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

async function init_sql() {
    const connection = await createMySqlConnection();
    await connection.execute("CREATE TABLE IF NOT EXISTS  balances ( account_nr int NOT NULL AUTO_INCREMENT, balance int  unsigned NOT NULL DEFAULT 0, PRIMARY KEY(account_nr));");
    await connection.execute("CREATE TABLE IF NOT EXISTS  transactions (reference int NOT NULL AUTO_INCREMENT , amount int NOT NULL , account_nr int NOT NULL , PRIMARY KEY(reference) , FOREIGN KEY (account_nr) REFERENCES balances(account_nr));")
}


init_sql().then().catch((e) => { console.warn(e)});


app.listen(process.env.PORT, () => console.log(`run server on ${process.env.PORT}!`));


module.exports = {app};
