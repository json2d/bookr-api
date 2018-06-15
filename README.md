# bookr-api

### Configuration
To run this app, you'll need to create a `.env` file in the root project directory to define the required environment variables. The file `sample.env` is included as a template:
```
PORT=3000
DB_URI=?

JWT_SECRET="this is a secret"
JWT_EXPIRE_IN_SECS=600

AWS_ACCESS_KEY_ID=?
AWS_SECRET_ACCESS_KEY=?
AWS_REGION=?
EMAIL_SENDER=?
```

Here are some descriptions for the less obvious ones:

- `DB_URI` - path to mongodb
- `JWT_SECRET` - key for signing tokens
- `JWT_EXPIRE_IN_SECS` - time to expiry for generated tokens
- `EMAIL_SENDER` - email address to send system message from

### Testing
Test cases written with [`mocha`](https://github.com/mochajs/mocha) and [`supertest`](https://github.com/visionmedia/supertest), with help from [`faker`](https://github.com/marak/Faker.js/). To in the console simply run:
```
$ npm i
$ npm test
```
