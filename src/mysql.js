
import mysql2 from 'mysql2/promise';

export async function createMySqlPool(){
    return await mysql2.createPool({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database :'namshi'
    });
}


export async function createMySqlConnection(){
    return await mysql2.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database :'namshi'
    });

}


