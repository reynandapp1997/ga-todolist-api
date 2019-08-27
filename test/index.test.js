const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const server = require('../app');
const User = require('../models/user');

describe('USER', () => {
    before(done => {
        User.deleteMany({}, (err) => {
            done()
        });
    });

    describe('/POST', () => {
        it('should add one user', done => {
            chai.request(server)
                .post('/api/user')
                .send({
                    name: 'Reynanda Putra Pratama',
                    email: 'reynandapp1997@gmail.com',
                    password: 'gegewepe'
                })
                .end((err, res) => {
                    expect(res.status).eql(200);
                    done();
                });
        });
        it('should fail add one user', done => {
            chai.request(server)
                .post('/api/user')
                .send({
                    name: 'Reynanda Putra Pratama',
                    email: 'reynandapp1997@gmail.com',
                    password: 'gegewepe'
                })
                .end((err, res) => {
                    expect(res.status).eql(500);
                    done();
                });
        });
        it('should login user', done => {
            chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'reynandapp1997@gmail.com',
                    password: 'gegewepe'
                })
                .end((err, res) => {
                    expect(res.status).eql(200);
                    done();
                });
        });
        it('should not login user with 404', done => {
            chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'reynandapp1997@gmail.comm',
                    password: 'gegewepe'
                })
                .end((err, res) => {
                    expect(res.status).eql(404);
                    done();
                });
        });
        it('should not login user with 401', done => {
            chai.request(server)
                .post('/api/user/login')
                .send({
                    email: 'reynandapp1997@gmail.com',
                    password: 'gegewepee'
                })
                .end((err, res) => {
                    expect(res.status).eql(401);
                    done();
                });
        });
    });
});
