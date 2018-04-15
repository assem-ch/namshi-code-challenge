const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../app');
const config =  require('./config');

let should = chai.should();

chai.use(chaiHttp);

function transaction(amount, from, to) {
    return chai.request(app)
        .post('/transactions/')
        .send({
            "amount": amount,
            "to": to,
            "from": from
        })
}

function balance(accountNr) {
    return chai.request(app)
        .get(`/balances/${accountNr}`)
}

describe('Concurrent transaction', async function () {

    describe('Consistent values', () => {
        it('should make multiple transfer transactions and return 200 for everyone, giving the right balances', async () => {

            const b1 = await chai.request(app)
                .post('/balances/')
                .send({'initial_balance': 1500});

            b1.body.should.have.property('id');


            const b2 = await chai.request(app)
                .post('/balances/')
                .send({'initial_balance': 1500});

            b2.body.should.have.property('id');


            const b3 = await chai.request(app)
                .post('/balances/')
                .send({'initial_balance': 0});

            b3.body.should.have.property('id');

            const accountA = b1.body.id;
            const accountB = b2.body.id;
            const accountC = b3.body.id;

            let concurrent_requests = Promise.all([
                transaction(500, accountA, accountC),
                transaction(400, accountB, accountC),
                transaction(100, accountA, accountC),
                transaction(500, accountB, accountC),
                transaction(200, accountA, accountC),
                transaction(200, accountB, accountC),
                transaction(150, accountA, accountC),
                transaction(300, accountB, accountC),
                transaction(550, accountA, accountC),
                transaction(100, accountB, accountC),
            ]);

            await concurrent_requests;


            const balanceA = await chai.request(app)
                .get(`/balances/${accountA}`);
            const balanceB = await chai.request(app)
                .get(`/balances/${accountB}`);
            const balanceC = await chai.request(app)
                .get(`/balances/${accountC}`);


            balanceA.body.balance.should.equal(0);
            balanceB.body.balance.should.equal(0);
            balanceC.body.balance.should.equal(3000)

        });
    });


    describe('Deadlocking', () => {
        it('should  not get deadlocked', async () => {

            const b1 = await chai.request(app)
                .post('/balances/')
                .send({'initial_balance': 1500});

            b1.body.should.have.property('id');


            const b2 = await chai.request(app)
                .post('/balances/')
                .send({'initial_balance': 1500});

            b2.body.should.have.property('id');


            const b3 = await chai.request(app)
                .post('/balances/')
                .send({'initial_balance': 1500});

            b3.body.should.have.property('id');


            const b4 = await chai.request(app)
                .post('/balances/')
                .send({'initial_balance': 1500});

            b4.body.should.have.property('id');

            const accountA = b1.body.id;
            const accountB = b2.body.id;
            const accountC = b3.body.id;
            const accountD = b4.body.id;

            let concurrent_requests = Promise.all([
                balance(accountA),
                transaction(500, accountA, accountB),
                balance(accountB),
                transaction(400, accountB, accountC),
                balance(accountC),
                transaction(100, accountC, accountA),
                balance(accountD),
                transaction(500, accountA, accountC),
                transaction(200, accountB, accountA),
                transaction(200, accountA, accountB),
                transaction(150, accountB, accountC),
                transaction(300, accountC, accountD),
                transaction(550, accountD, accountA),
                transaction(100, accountB, accountD),
            ]);

            await concurrent_requests;

        });
    });

});
