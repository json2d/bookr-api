const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

  const BookSchema = new Schema({
    author: { type: String, required: true },
    title: { type: String, required: true },
    publisher: { type: String, required: true },
    categories: [{ type: String, unique: true }], //no duplicates
    contributor: { type: ObjectId, ref: 'User', required: true },

    isCheckedOut: {type: Boolean, default: false, required: true },
    checker: {type: ObjectId, ref:'User'} //references another schema

  });
  BookSchema.index({ title: 1, author: 1, publisher: 1 }, { unique: true });

var Book = mongoose.model('book', BookSchema);

module.exports = Book;
