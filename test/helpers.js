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

const noBooks = res => {
  const books = res.body.books
  if(!books) throw new Error("missing list of books")
  if(!books.length==0) throw new Error("list of books is not empty")
}
module.exports = {hasWellformedToken, generateBooks, noBooks}
