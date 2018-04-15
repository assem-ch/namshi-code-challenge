import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';


import router from './src/router';
import { createMySqlPool } from './src/mysql'

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




async function init_sql(){

    const pool = await createMySqlPool()

    await pool.query("CREATE TABLE IF NOT EXISTS  balances (id int NOT NULL AUTO_INCREMENT, account_nr CHAR(36) NOT NULL UNIQUE DEFAULT UUID(), balance int  unsigned NOT NULL DEFAULT 0, PRIMARY KEY(id));")
    console.log("1st Table created:");
    await pool.query("CREATE TABLE IF NOT EXISTS  transactions (reference int NOT NULL AUTO_INCREMENT , amount int NOT NULL , account_nr  CHAR(36) NOT NULL , PRIMARY KEY(reference) , FOREIGN KEY (account_nr) REFERENCES balances(account_nr));")
    console.log("2nd Table created");

    return true

}


init_sql()


app.listen(3000, () => console.log('run server on 3000!'))


export {app};
