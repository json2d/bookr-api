const request = require('supertest');
const app = require('../app');

const User = require('../models/user')
const Book = require('../models/book')

const {hasWellformedToken} = require('./helpers')

describe('checkout and return books', function() {

  before(done => {
    User.remove({}, () => {
      Book.remove({},done)
    })
  })

  const users = {
    jason: {username:"jason@bookr.cc", password:"password"},
    jackson: {username:"jackson@bookr.cc", password:"P4ssword"},
    peter: {username:"peter@bookr.cc", password:"P4ssword1"}
  }

  const fakeId = "000000000000000000000000"

  let bookId;
  let BOOK = {
    title:"awesomebook",
    author:"jason",
    publisher:"random house",
    categories:["fiction","action"],
    // isbn:12312
  }

  it('responds with access token for first user', function(done) {
    request(app)
      .post('/auth/signup')
      .send(users.jason)
      .expect(200)
      .expect(hasWellformedToken)
      .end((err,res) => {
        if(err) throw err
        users.jason.token = res.body.token //add token to user
        done()
      })
  });

  it('responds with access token for second user', function(done) {
    request(app)
      .post('/auth/signup')
      .send(users.jackson)
      .expect(200)
      .expect(hasWellformedToken)
      .end((err,res) => {
        if(err) throw err
        users.jackson.token = res.body.token
        done()
      })
  });

  it('responds with access token for third user', function(done) {
    request(app)
      .post('/auth/signup')
      .send(users.peter)
      .expect(200)
      .expect(hasWellformedToken)
      .end((err,res) => {
        if(err) throw err
        users.peter.token = res.body.token
        done()
      })
  });


  describe('POST /books', function() {
    it('responds with the book id', function(done) {
      request(app)
        .post('/books')
        .set('Authorization',`Bearer ${users.jason.token}`)
        .send(BOOK)
        .expect(200)
        .end((err,res) => {
          if(err) throw err;
          bookId = res.body.id
          done()
        })
    });
  })

  describe('POST /books/checkout/:id', function() {
    it('responds with checkout confirmation', function(done) {
      request(app)
        .post(`/books/checkout/${bookId}`)
        .set('Authorization',`Bearer ${users.jackson.token}`)
        .expect(200)
        .end(done)
    });
  })


  describe('POST /books/checkout/:id', function() {
    it('fails to checkout book thats already checked out', function(done) {
      request(app)
        .post(`/books/checkout/${bookId}`)
        .set('Authorization',`Bearer ${users.peter.token}`)
        .expect(400)
        .end(done)
    });
  })

  describe('POST /books/return/:id', function() {
    it('responds with return confirmation', function(done) {
      request(app)
        .post(`/books/return/${bookId}`)
        .set('Authorization',`Bearer ${users.jackson.token}`)
        .expect(200)
        .end(done)
    });
  })

  describe('POST /books/checkout/:id', function() {
    it('responds with checkout confirmation', function(done) {
      request(app)
        .post(`/books/checkout/${bookId}`)
        .set('Authorization',`Bearer ${users.peter.token}`)
        .expect(200)
        .end(done)
    });
  })


  describe('POST /books/checkout/:id', function() {
    it('fails to find book for checkout', function(done) {
      request(app)
        .post(`/books/return/${fakeId}`)
        .set('Authorization',`Bearer ${users.jackson.token}`)
        .expect(400)
        .end(done)
    });
  })

  describe('POST /books/return/:id', function() {
    it('fails to find book for return', function(done) {
      request(app)
        .post(`/books/return/${fakeId}`)
        .set('Authorization',`Bearer ${users.jackson.token}`)
        .expect(400)
        .end(done)
    });
  })

});
