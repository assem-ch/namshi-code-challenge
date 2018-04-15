## Namshi's Bank
Code challenge for Namshi 

To run the solution using docker, run:

```
docker-compose up
```

#### Requirements
- node 8 or 9
- mysql or mariadb
- mocha (for running tests)


#### Install
```
npm i
```

#### Run
rename `.env.sample` to `.env` and update it to fit your database configuration than run: 

```
npm start
```


#### Test
Create a database for test and put its name in the env variable `DATABASE_TEST_NAME` and run:
```
npm test
```