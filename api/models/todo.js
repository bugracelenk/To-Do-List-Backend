const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  todo: { type: String, required: true },
  doneIn : { type: Date, default: Date.now()},
  isDone: { type: Boolean }
});

module.exports = mongoose.model('Todo', todoSchema);