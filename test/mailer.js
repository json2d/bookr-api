const request = require('supertest');
const app = require('../app');
const User = require('../models/user')

describe('contribute, fetch, edit, and delete books', function() {

  before(done => {
    User.remove({},done)
  })

  it('responds email', function(done) {
    request(app)
      .post('/auth/signup')
      .send({username:process.env.EMAIL_SENDER, password:"password" })
      .expect(200)
      .end((err,res) => {
        if(err) throw err
        done()
      })
  });
})
