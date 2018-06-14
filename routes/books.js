const express = require('express');
const router = express.Router();

const on = require('await-on')

const User = require('../models/user')
const Book = require('../models/book')

/* GET users listing. */
router.post('/', async function(req, res, next) {
  const {title, author, publisher, categories} = req.body;

  const book = new Book({title, author, publisher, categories, contributor:req.user});

  const [err,savedBook] = await on(book.save());
  if(err) return res.status(400).json({err})

  res.status(200).json({id:savedBook.id})

});


/* GET users listing. */
router.get('/:id', async function(req, res, next) {
  const [err,book] = await Book.findById(req.params.id).lean().exec().handle()
  if(err) return res.status(400).json({err})
  if(!book) return res.status(400).json({err:"book not found"})

  //console.log(req.params.id,book)

  res.status(200).json(book)

});

/* GET users listing. */
router.put('/:id', async function(req, res, next) {
  const [findErr,book] = await Book.findById(req.params.id).exec().handle()
  if(findErr) return res.status(400).json({err:findErr})
  if(!book) return res.status(400).json({err:"book not found"})

  if(book.contributor === req.user._id) return res.status(401).json({err:"can only edit contributed books"})

  const {title, author, publisher, categories} = req.body; //throws if some params are missing

  book.title = title
  book.author = author
  book.publisher = publisher
  book.categories = categories

  const [err,savedBook] = await book.save().handle();
  if(err) return res.status(400).json({err})

  res.status(200).json(savedBook)

});

/* GET users listing. */
router.delete('/:id', async function(req, res, next) {
  const [err,book] = await Book.findOneAndDelete({_id:req.params.id, contributor:req.user._id}).exec().handle()
  if(err) return res.status(400).json({err})
  if(!book) return res.status(400).json({err:"book not found"})

  res.status(200).send(book)

});


module.exports = router;
