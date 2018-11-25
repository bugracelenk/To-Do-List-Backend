const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const TodoController = require('../controllers/todos');

router.get('/:userId', checkAuth, TodoController.todo_get_todos);

router.get('/:userId/:todoId', checkAuth, TodoController.todo_get_todo);

router.post('/', checkAuth , TodoController.todo_post_user);

router.delete('/:userId/:todoId', checkAuth, TodoController.todo_delete_user);

router.patch('/:userId/:todoId', checkAuth, TodoController.todo_patch_todo);

module.exports = router;