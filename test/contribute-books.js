const request = require('supertest');
const app = require('../app');

const User = require('../models/user')
const Book = require('../models/book')

const {hasWellformedToken} = require('./helpers')

describe('contribute, fetch, edit, and delete books', function() {

  before(done => {
    User.remove({}, () => {
      Book.remove({},done)
    })
  })

  let token, bookId;
  let BOOK = {
    title:"awesomebook",
    author:"jason",
    publisher:"random house",
    categories:["fiction","action"],
    // isbn:12312
  }

  it('responds with access token', function(done) {
    request(app)
      .post('/auth/signup')
      .send({username:"jason@bookr.cc", password:"password" })
      .expect(200)
      .expect(hasWellformedToken)
      .end((err,res) => {
        if(err) throw err
        token = res.body.token
        done()
      })
  });

  describe('POST /books (unauthroized)', function() {
    it('fails because access token is missing from header', function(done) {
      request(app)
        .post(`/books`)
        .send(BOOK)
        .expect(401)
        .end(done)
    });
  })

  describe('POST /books', function() {
    it('responds with the book id', function(done) {
      request(app)
        .post('/books')
        .set('Authorization',`Bearer ${token}`)
        .send(BOOK)
        .expect(200)
        .end((err,res) => {
          if(err) throw err;
          bookId = res.body.book._id
          done()
        })
    });
  })

  describe('POST /books', function() {
    it('fails to create same book again', function(done) {
      request(app)
        .post('/books')
        .set('Authorization',`Bearer ${token}`)
        .send(BOOK)
        .expect(400)
        .end((err,res) => {
          if(err) throw err;
          done()
        })
    });
  })


  describe('GET /books/:id', function() {
    it('responds with book data', function(done) {
      request(app)
        .get(`/books/${bookId}`)
        .send()
        .set('Authorization',`Bearer ${token}`)
        .expect(200)
        // .expect(BOOK)
        .end(done)
    });
  })


  describe('PUT /books/:id', function() {
    it('responds with updated book data', function(done) {
      request(app)
        .put(`/books/${bookId}`)
        .send({...BOOK, author:"mason"})
        .set('Authorization',`Bearer ${token}`)
        .expect(200)
        // .expect(BOOK)
        .end(done)
    });
  })

  describe('DELETE /books/:id', function() {
    it('responds with deleted book confirmation', function(done) {
      request(app)
        .delete(`/books/${bookId}`)
        .send()
        .set('Authorization',`Bearer ${token}`)
        .expect(200)
        // .expect(BOOK)
        .end(done)
    });
  })

  describe('DELETE /books/:id (deleted)', function() {
    it('fails to find deleted book', function(done) {
      request(app)
        .delete(`/books/${bookId}`)
        .send()
        .set('Authorization',`Bearer ${token}`)
        .expect(400)
        // .expect(BOOK)
        .end(done)
    });
  })

  describe('GET /books/:id (deleted)', function() {
    it('fails to find deleted book', function(done) {
      request(app)
        .get(`/books/${bookId}`)
        .send()
        .set('Authorization',`Bearer ${token}`)
        .expect(400)
        // .expect(BOOK)
        .end(done)
    });
  })

  describe('PUT /books/:id (deleted)', function() {
    it('fails to update deleted book', function(done) {
      request(app)
        .put(`/books/${bookId}`)
        .send({...BOOK, author:"dan"})
        .set('Authorization',`Bearer ${token}`)
        .expect(400)
        // .expect(BOOK)
        .end(done)
    });
  })
});
