const mongoose = require('mongoose');

const Todo = require('../models/todo');

exports.todo_get_todos = (req, res, next) => {
  Todo.find({ userId: req.params.userId })
    .select('todo doneIn _id todoImage isDone')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            todo: doc.todo,
            doneIn: doc.doneIn,
            _id: doc._id,
            isDone: doc.isDone,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/todos/' + doc.userId + '/' + doc._id
            }
          }
        })
      };
      // if (docs.length >= 0) {
      res.status(201).json(response);
      // } else {
      //     res.status(404).json({
      //         message: "No entries found"
      //     });
      // }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.todo_get_todo = (req, res, next) => {
  const userId = req.params.userId;
  const todoId = req.params.todoId;
  Todo.findOne({ _id: todoId, userId: userId })
    .select('todo doneIn _id todoImage isDone')
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          gotTodo: {
            todo: doc.todo,
            doneIn: doc.doneIn,
            _id: doc._id,
            isDone: doc.isDone
          },
          request: {
            type: 'GET',
            url: 'http://localhost:3000/todos/' + doc.userId
          }
        });
      } else {
        res.status(404).json({ message: 'No todos found for this user.' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err })
    });
};

exports.todo_post_user = (req, res, next) => {
  const newTodo = new Todo({
    _id: new mongoose.Types.ObjectId(),
    todo: req.body.todo,
    doneIn: req.body.doneIn,
    isDone: false,
    userId: req.body.userId
  });
  newTodo
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Todo added successfully for this user.',
        createdToDo: {
          todo: result.todo,
          doneIn: result.doneIn,
          _id: result._id,
          isDone: result.isDone,
          userId: result.userId,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/todos/' + result.userId + '/' + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
};

exports.todo_patch_todo = (req, res, next) => {
  const id = req.params.todoId;
  const userId = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Todo.update({ _id: id, userId: userId }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Todo Updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/todos/' + userId + '/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.todo_delete_user = (req, res, next) => {
  const userId = req.params.userId;
  const todoId = req.params.todoId;
  Todo.remove({ _id: todoId, userId: userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Todo deleted with the given ID ' + todoId + "for user " + userId,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/' + userId,
          body: {
            todo: 'String',
            doneIn: 'Date',
            isDone: 'Boolean',
            userId: "ID",
            todoImage: "String(Path)"
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
