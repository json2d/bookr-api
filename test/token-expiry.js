const request = require('supertest');
const app = require('../app');

const User = require('../models/user')

const {hasWellformedToken} = require('./helpers')

describe('token behavior', function() {

  before(done => {
    User.remove({}, done)
  })

  let token, tokenA, tokenB;

  const expiresIn = Number(process.env.JWT_EXPIRE_IN_SECS);

  if(expiresIn > 5) return console.log(`Skipping test because token needs ${expiresIn} seconds to expire...max wait is set to 5 seconds.`); //skip test if expiry is not

  it(`expires in ${expiresIn} seconds`, async function() {
    await request(app)
      .post('/auth/signup')
      .send({username:process.env.EMAIL_SENDER, password:"password" })
      .expect(200)
      .expect(hasWellformedToken)
      .expect((res) => {
        token = res.body.token
      })

      await request(app)
        .get('/books')
        .set('Authorization',`Bearer ${token}`)
        .send()
        .expect(200)

      console.log(`waiting ${expiresIn} seconds til token expires...`)

      await new Promise(res => setTimeout(res,expiresIn*1000))

      await request(app)
        .get('/books')
        .set('Authorization',`Bearer ${token}`)
        .send()
        .expect(401)

    }).timeout((expiresIn + 2)*1000); //this test will timeout in the time the token expires + 2 more seconds

    it(`refreshes after every successful request`, async function() {
      await request(app)
        .post('/auth/login')
        .send({username:process.env.EMAIL_SENDER, password:"password" })
        .expect(200)
        .expect(hasWellformedToken)
        .expect((res) => {
          tokenA = res.body.token
        })

        console.log(`waiting ${expiresIn-1} seconds to refresh token...`)

        await new Promise(res => setTimeout(res,(expiresIn-1)*1000))

        await request(app)
          .get('/books')
          .set('Authorization',`Bearer ${tokenA}`)
          .send()
          .expect(200)
          .expect(hasWellformedToken)
          .expect((res) => {
            tokenB = res.body.token
          })

        console.log(`waiting ${2} seconds to allow first token expires...`)

        await new Promise(res => setTimeout(res,2000))

        await request(app)
          .get('/books')
          .set('Authorization',`Bearer ${tokenB}`)
          .send()
          .expect(200)

      }).timeout((expiresIn + 2)*1000); //this test will timeout in the time the token expires + 2 more seconds

})
