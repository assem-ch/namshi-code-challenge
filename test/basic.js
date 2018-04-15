import  assert  from 'assert';
import  _ from 'babel-polyfill';

import chai from 'chai';
import chaiHttp from 'chai-http';
import {app}  from '../app';
let should = chai.should();

chai.use(chaiHttp)

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal([1,2,3].indexOf(4), -1);
        });
    });
});


describe('API calls', function() {
    describe('POST /balances/', () => {
        it('should create an account and return status 200', (done) => {
                chai.request(app)
                    .post('/balances/')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('id');
                        done();
                    });
            });
    });

    describe('GET /balances/:id/', () => {
        it('should create an account and return status 200', (done) => {
            chai.request(app)
                .post('/balances/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    done();
                });
        });
    });
});
