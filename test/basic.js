const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../app');
const config =  require('./config');

let should = chai.should();

chai.use(chaiHttp);

describe('API calls', function () {
    describe('POST /balances/', () => {
        it('should create an account and return status 200', async () => {
            let res = await chai.request(app)
                .post('/balances/')
                .send({'initial_balance': 1000});

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.success.should.equal(true);
            res.body.should.have.property('id');
        });
    });

    describe('POST /transactions/', () => {
        it('should make a transfer and return 200', async () => {

            const b1 = await chai.request(app)
                .post('/balances/')
                .send({'initial_balance': 1500});

            b1.body.should.have.property('id');


            const b2 = await chai.request(app)
                .post('/balances/')
                .send({'initial_balance': 1500});

            b2.body.should.have.property('id');


            const accountA = b1.body.id;
            const accountB = b2.body.id;

            let res = await chai.request(app)
                .post('/transactions/')
                .send({
                    "amount": "200",
                    "to": accountA,
                    "from": accountB,
                });

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');

        });
    });

});
