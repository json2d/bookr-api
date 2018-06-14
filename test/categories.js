const request = require('supertest');
const faker = require('faker');
const app = require('../app');

const User = require('../models/user')
const Book = require('../models/book')

const {hasWellformedToken, generateBooks} = require('./helpers')

describe('list all categories', function() {

  before(done => {
    User.remove({}, () => {
      Book.remove({},done)
    })
  })

  const users = {
    jason: {username:"jason@bookr.cc", password:"password", books:generateBooks(3, "fiction")},
  }

  let contributedBooks;

  it('responds with access token', function(done) {
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

  describe('get all existing categories', function() {
    it('responds with a list of categories', async function() {
        await request(app)
          .get(`/categories`)
          .set('Authorization',`Bearer ${users.jason.token}`)
          .send()
          .expect(200)
          .expect(res => {
            const expected = 0
            const got = res.body.categories.length
            if(got !== expected) throw new Error(`incorrect number of categories, expected ${expected} by got ${got}`)
          })
      })
  })

  describe('contribute books', function() {
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
  })

  describe('get all existing categories', function() {
    it('responds with a list of categories', async function() {
        await request(app)
          .get(`/categories`)
          .set('Authorization',`Bearer ${users.jason.token}`)
          .send()
          .expect(200)
          .expect(res => {
            const expected = 4
            const got = res.body.categories.length
            if(got !== expected) throw new Error(`incorrect number of categories, expected ${expected} by got ${got}`)
          })
      })

  })

});
