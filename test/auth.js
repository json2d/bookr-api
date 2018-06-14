const request = require('supertest');
const app = require('../app');

const User = require('../models/user')

const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
const hasWellformedToken = res => {
  if(!res.body.token.match(JWS_REGEX)) throw new Error("malformed jwt token")
}

describe('POST /auth/signup', function() {

  before(done => {
    User.remove({}, done)
  })

  it('responds with access token', function(done) {
    request(app)
      .post('/auth/signup')
      .send({username:"jason@bookr.cc", password:"password" })
      .expect(200)
      .expect(hasWellformedToken)
      .end(done)
  });

  it('fails because password is missing', function(done) {
    request(app)
      .post('/auth/signup')
      .send({username:"jason@bookr.cc" })
      .expect(400)
      .end(done)
  });

  it('fails because user already exists', function(done) {
    request(app)
      .post('/auth/signup')
      .send({username:"jason@bookr.cc", password:"password" })
      .expect(400)
      .end(done)
  });
});

describe('POST /auth/login', function() {

  before(done => {
    User.remove({}, done)
  })

  it('responds with access token', function(done) {
    request(app)
      .post('/auth/signup')
      .send({username:"jason@bookr.cc", password:"password" })
      .expect(200)
      .expect(hasWellformedToken)
      .end(done)
  });

  it('fails because password is missing', function(done) {
    request(app)
      .post('/auth/login')
      .send({username:"jason@bookr.cc" })
      .expect(400)
      .end(done)
  });

  it('fails because password is wrong', function(done) {
    request(app)
      .post('/auth/signup')
      .send({username:"jason@bookr.cc", password:"not-the-password" })
      .expect(400)
      .end(done)
  });

  it('responds with access token', function(done) {
    request(app)
      .post('/auth/login')
      .send({username:"jason@bookr.cc", password:"password" })
      .expect(200)
      .expect(hasWellformedToken)
      .end(done)
  });
});
