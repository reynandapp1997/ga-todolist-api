const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const server = require('../app');
const User = require('../models/user');
const Todo = require('../models/todo');

var userToken;
var todoId;

describe('USER', () => {
    before(done => {
        User.deleteMany({}, (err) => {
            done();
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
                    expect(res.status).eql(201);
                    done();
                });
        });
        it('should fail add one user with existed email', done => {
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
                    userToken = res.header.authorization;
                    expect(res.status).eql(200);
                    done();
                });
        });
        it('should not login user with not exist email', done => {
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
        it('should not login user with wrong password', done => {
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

    describe('/GET', () => {
        it('should get all user', done => {
            chai.request(server)
                .get('/api/user')
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body.length).eql(1);
                    done();
                });
        })
    });
});

describe('TODO', () => {
    before(done => {
        Todo.deleteMany({}, (err) => {
            done()
        });
    });


    describe('/POST', () => {
        it('should add one todo', done => {
            chai.request(server)
                .post('/api/todo')
                .send({
                    title: 'Endpoint',
                    description: 'Menyelesaikan endpoint todo list GA Mini Project',
                    priority: 'High',
                    dueDateTime: new Date(),
                })
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(201);
                    done();
                });
        });
    });

    describe('/GET', () => {
        it('should get all todo', done => {
            chai.request(server)
                .get('/api/todo')
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body.length).eql(1);
                    todoId = res.body.data[0]._id;
                    done();
                });
        });
        it('should get single todo', done => {
            chai.request(server)
                .get(`/api/todo/${todoId}`)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    done();
                });
        });
        it('should get user todo', done => {
            chai.request(server)
                .get('/api/todo/auth/mytodo')
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body.length).eql(1);
                    todoId = res.body.data[0]._id;
                    done();
                });
        });
    });

    describe('/PUT', () => {
        it('should update user todo', done => {
            chai.request(server)
                .put(`/api/todo/${todoId}`)
                .set('Authorization', userToken)
                .send({
                    title: 'Endpoint 3',
                    priority: 'Low',
                    status: true
                })
                .end((err, res) => {
                    expect(res.status).eql(201);
                    done();
                });
        });
    });

    describe('/DELETE', () => {
        it('should delete todo', done => {
            chai.request(server)
                .delete(`/api/todo/${todoId}`)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    done();
                });
        });
        it('check deleted todo', done => {
            chai.request(server)
                .get(`/api/todo/${todoId}`)
                .end((err, res) => {
                    expect(res.status).eql(404);
                    done();
                });
        });
        it('make sure no todo', done => {
            chai.request(server)
                .get('/api/todo/')
                .end((err, res) => {
                    expect(res.body.length).eql(0);
                    expect(res.status).eql(200);
                    done();
                });
        });
    });
});
