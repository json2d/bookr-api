const express = require('express');
const router = express.Router();

const on = require('await-on')

const Book = require('../models/book')

router.get('/', async function(req, res, next) {

  const [err,books] = await Book.find({}).lean().exec().handle();
  if(err) return res.status(400).json({err})

  const table = books.reduce((obj,book) => {
    book.categories.forEach(cat => {
      obj[cat] = undefined; //use object to filter out dupes
    })
    return obj
  },{})

  //TODO: memoize into a cache
  const categories = Object.keys(table)

  res.status(200).json({categories})

});

module.exports = router;
