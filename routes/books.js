const express = require('express');
const router = express.Router();

const on = require('await-on')

const User = require('../models/user')
const Book = require('../models/book')


router.get('/', async function(req, res, next) {
  const [err,books] = await Book.find({}).exec().handle();
  if(err) res.status(400).json({err})

  res.status(200).json({books})

});

//defined these before POST /:id to prevent override
router.get('/contributed', async function(req, res, next) {
  const [err,books] = await Book.find({contributor:req.user}).exec().handle();
  if(err) res.status(400).json({err})

  res.status(200).json({books})

});

router.get('/checked-out', async function(req, res, next) {
  const [err,books] = await Book.find({checker:req.user}).exec().handle();
  if(err) res.status(400).json({err})

  res.status(200).json({books})

});

router.get('/by-category/:category', async function(req, res, next) {
  const [err,books] = await Book.find({categories:req.params.category}).exec().handle();
  if(err) res.status(400).json({err})

  res.status(200).json({books})

});

router.post('/', async function(req, res, next) {
  const {title, author, publisher, categories} = req.body;

  const book = new Book({title, author, publisher, categories, contributor:req.user});

  const [err,savedBook] = await on(book.save());
  if(err) res.status(400).json({err})

  res.status(200).json({id:savedBook.id})

});


router.get('/:id', async function(req, res, next) {
  const [err,book] = await Book.findById(req.params.id).lean().exec().handle()
  if(err) return res.status(400).json({err})
  if(!book) return res.status(400).json({err:"book not found"})

  res.status(200).json(book)

});

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

router.delete('/:id', async function(req, res, next) {
  const [err,book] = await Book.findOneAndDelete({_id:req.params.id, contributor:req.user._id}).exec().handle()
  if(err) return res.status(400).json({err})
  if(!book) return res.status(400).json({err:"book not found"})

  res.status(200).send(book)

});

router.post('/checkout/:id', async function(req, res, next) {
  const query = {_id:req.params.id, isCheckedOut:false}
  const changes = {checker:req.user, isCheckedOut:true}

  const [err,book] = await Book.findOneAndUpdate(query,changes).exec().handle()

  if(err) return res.status(400).json({err})
  if(!book) return res.status(400).json({err:"book not found"})

  res.status(200).send(book)

});

router.post('/return/:id', async function(req, res, next) {
  const query = {_id:req.params.id, isCheckedOut:true, checker:req.user}
  const changes = {isCheckedOut:false}

  const [err,book] = await Book.findOneAndUpdate(query,changes).exec().handle()
  if(err) return res.status(400).json({err})
  if(!book) return res.status(400).json({err:"book not found"})
  res.status(200).send(book)

});


module.exports = router;
