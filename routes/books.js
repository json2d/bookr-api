const express = require('express');
const router = express.Router();

const on = require('await-on')

const User = require('../models/user')
const Book = require('../models/book')

const mailer = require('../lib/mailer')

/**
 * @api {get} /books List All Books
 * @apiName List All
 * @apiGroup Books
 *
 * @apiSuccess {Array} books List of all books.
 * @apiSuccess {String} token Access token for User.
 */
router.get('/', async function(req, res, next) {
  const [err,books] = await Book.find({}).exec().handle();
  if(err) return res.status(400).json({err})

  res.status(200).json({books})

});

/**
 * @api {get} /books/contributed List Contributed Books
 * @apiName List Contributed
 * @apiGroup Books
 *
 * @apiSuccess {Array} books List of contributed books.
 * @apiSuccess {String} token Access token for User.
 */

//defined these before POST /:id to prevent override
router.get('/contributed', async function(req, res, next) {
  const [err,books] = await Book.find({contributor:req.user}).exec().handle();
  if(err) return res.status(400).json({err})

  res.status(200).json({books})

});

/**
 * @api {get} /books/checked-out List Checked-out Books
 * @apiName List Checked-out
 * @apiGroup Books
 *
 * @apiSuccess {Array} books List of checked-out books.
 * @apiSuccess {String} token Access token for User.
 */
router.get('/checked-out', async function(req, res, next) {
  const [err,books] = await Book.find({checker:req.user}).exec().handle();
  if(err) return res.status(400).json({err})

  res.status(200).json({books})

});

/**
 * @api {get} /books/by-category/:category List Books By Category
 * @apiName List By Category
 * @apiGroup Books
 *
 * @apiParam {String} category Category to find books by.
 * @apiSuccess {Array} books List of checked-out books.
 * @apiSuccess {String} token Access token for User.

 */
router.get('/by-category/:category', async function(req, res, next) {
  const [err,books] = await Book.find({categories:req.params.category}).exec().handle();
  if(err) return res.status(400).json({err})

  res.status(200).json({books})

});

/**
 * @api {post} /books Create Book
 * @apiName Create
 * @apiGroup Books
 *
 * @apiSuccess {Book} book created Book object.
 * @apiSuccess {String} token Access token for User.
 */
router.post('/', async function(req, res, next) {
  const {title, author, publisher, categories} = req.body;

  const book = new Book({title, author, publisher, categories, contributor:req.user});

  const [err,savedBook] = await on(book.save());
  if(err) return res.status(400).json({err})
  if(!savedBook) return res.status(400).json({err:"could not save book"})
  res.status(200).json({book:savedBook})

});

/**
 * @api {put} /books/:id Fetch Book
 * @apiName Fetch
 * @apiGroup Books
 *
 * @apiParam {String} id Book `id` to fetch
 * @apiSuccess {Book} book fetched Book object.
 * @apiSuccess {String} token token Access token for User.
 */
router.get('/:id', async function(req, res, next) {
  const [err,book] = await Book.findById(req.params.id).lean().exec().handle()
  if(err) return res.status(400).json({err})
  if(!book) return res.status(400).json({err:"book not found"})

  res.status(200).json({book})

});

/**
 * @api {put} /books/:id Update Book
 * @apiName Update
 * @apiGroup Books
 *
 * @apiParam {String} id Book `id` to update
 * @apiSuccess {Book} book updated Book object.
 * @apiSuccess {String} token Access token for User.
 */
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

  res.status(200).json({book:savedBook})

  mailer.send({
    to: req.user.username,
    subject: 'Thanks for the contribution!',
    text: `Your book, "${title}", has been added to our systems.`,
  })
});

/**
 * @api {delete} /books/:id Delete Book
 * @apiName Delete
 * @apiGroup Books
 *
 * @apiParam {String} id Book `id` to delete
 * @apiSuccess {Book} book deleted Book object.
 * @apiSuccess {String} token Access token for User.
 */
router.delete('/:id', async function(req, res, next) {
  const [err,book] = await Book.findOneAndDelete({_id:req.params.id, contributor:req.user._id}).exec().handle()
  if(err) return res.status(400).json({err})
  if(!book) return res.status(400).json({err:"book not found"})

  res.status(200).json({book})

});

/**
 * @api {post} /books/checkout/:id Checkout Book
 * @apiName Checkout
 * @apiGroup Books
 *
 * @apiParam {String} id Book `id` to checkout
 * @apiSuccess {Book} book checked-out Book object.
 * @apiSuccess {String} token Access token for User.
 */
router.post('/checkout/:id', async function(req, res, next) {
  const query = {_id:req.params.id, isCheckedOut:false}
  const changes = {checker:req.user, isCheckedOut:true}

  const [err,book] = await Book.findOneAndUpdate(query,changes).exec().handle()

  if(err) return res.status(400).json({err})
  if(!book) return res.status(400).json({err:"book not found"})

  res.status(200).json({book})

  mailer.send({
    to: req.user.username,
    subject: 'Checkout confirmed.',
    text: `Enjoy "${book.title}"!`,
  })

});

/**
 * @api {post} /books/return/:id Return Book
 * @apiName Return
 * @apiGroup Books
 *
 * @apiParam {String} id Book `id` to return
 * @apiSuccess {Book} book returned Book object.
 * @apiSuccess {String} token Access token for User.
 */
router.post('/return/:id', async function(req, res, next) {
  const query = {_id:req.params.id, isCheckedOut:true, checker:req.user}
  const changes = {isCheckedOut:false}

  const [err,book] = await Book.findOneAndUpdate(query,changes).exec().handle()
  if(err) return res.status(400).json({err})
  if(!book) return res.status(400).json({err:"book not found"})
  res.status(200).json({book})

  mailer.send({
    to: req.user.username,
    subject: 'Return confirmed.',
    text: `"${book.title}" was returned.`,
  })

});


module.exports = router;
