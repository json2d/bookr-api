const faker = require('faker');

const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
const hasWellformedToken = res => {
  if(!res.body.token.match(JWS_REGEX)) throw new Error("malformed jwt token")
}

const generateBooks = (n, category) => {
  return Array(n).fill(1).map(() => ({
    title:faker.commerce.productName(),
    author:faker.name.findName(),
    publisher:faker.company.companyName(),
    categories:[category,faker.random.word()],
    // isbn:12312
  }))
}
module.exports = {hasWellformedToken, generateBooks}
