const mysql2 = require('mysql2/promise');

async function createMySqlConnection() {
        try {
            return await mysql2.createConnection({
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME
            });

        } catch (e) {
            console.warn(e)
        }
}

module.exports = {createMySqlConnection};

