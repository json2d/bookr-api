const request = require('supertest');
const faker = require('faker');
const app = require('../app');

const User = require('../models/user')
const Book = require('../models/book')

const {hasWellformedToken, generateBooks} = require('./helpers')

describe('list books by different scopes', function() {

  before(done => {
    User.remove({}, () => {
      Book.remove({},done)
    })
  })

  const users = {
    jason: {username:"jason@bookr.cc", password:"password", books: generateBooks(3,"fiction")},
    jackson: {username:"jackson@bookr.cc", password:"P4ssword", books: generateBooks(3,"non-fiction")},
  }

  let contributedBooks = [];

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

  describe('fetch initial contributed and checked-out list', function() {
    it('responds with an empty list of all books', function(done) {
      request(app)
        .get('/books')
        .set('Authorization',`Bearer ${users.jason.token}`)
        .expect(200)
        .expect({books:[]})
        .end(done)
    });

    it('responds with an empty list of contributed books', function(done) {
      request(app)
        .get('/books/contributed')
        .set('Authorization',`Bearer ${users.jason.token}`)
        .expect(200)
        .expect({books:[]})
        .end(done)
    });

    it('responds with an empty list of checked-out books', function(done) {
      request(app)
        .get('/books/checked-out')
        .set('Authorization',`Bearer ${users.jason.token}`)
        .expect(200)
        .expect({books:[]})
        .end(done)
    });
  })

  describe('contribute books for both users', function() {
    users.jason.books.forEach(book => {
      it('responds with the book id', function(done) {
        request(app)
          .post('/books')
          .set('Authorization',`Bearer ${users.jason.token}`)
          .send(book)
          .expect(200)
          .end(done)
      });
    })

    users.jackson.books.forEach(book => {
      it('responds with the book id', function(done) {
        request(app)
          .post('/books')
          .set('Authorization',`Bearer ${users.jackson.token}`)
          .send(book)
          .expect(200)
          .end(done)
      });
    })

  })

  describe('fetch all books', function() {
    it('responds with a list of all books', function(done) {
      request(app)
        .get('/books')
        .set('Authorization',`Bearer ${users.jason.token}`)
        .expect(200)
        .expect(res => {
          const expected = users.jason.books.length + users.jackson.books.length
          const got = res.body.books.length
          if(got !== expected) throw new Error(`incorrect number of books, expected ${expected} by got ${got}`)
        })
        .end(done)
    });
  })


  describe('fetch contributed books', function() {
    it('responds with a list of contributed books', function(done) {
      request(app)
        .get('/books/contributed')
        .set('Authorization',`Bearer ${users.jason.token}`)
        .expect(200)
        .expect(res => {
          const expected = users.jackson.books.length
          const got = res.body.books.length
          if(got !== expected) throw new Error(`incorrect number of books, expected ${expected} by got ${got}`)
          contributedBooks = res.body.books
        })
        .end(done)
    });
  })


  describe('checkout books contributed by first user', function() {
    it('responds with checkout confirmation', async function() {
      for(var i = 0; i<contributedBooks.length; i++) {
        await request(app)
          .post(`/books/checkout/${contributedBooks[i]._id}`)
          .set('Authorization',`Bearer ${users.jackson.token}`)
          .send()
          .expect(200)
      }
    })
  })

  describe('fetch checked-out books', function() {
    it('responds with a list of checked-out books', function(done) {
      request(app)
        .get('/books/checked-out')
        .set('Authorization',`Bearer ${users.jackson.token}`)
        .expect(200)
        .expect(res => {
          const expected = users.jackson.books.length
          const got = res.body.books.length
          if(got !== expected) throw new Error(`incorrect number of books, expected ${expected} by got ${got}`)
        })
        .end(done)
    });
  })


});
