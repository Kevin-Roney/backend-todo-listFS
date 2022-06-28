const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Todo = require('../models/Todo');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const todo = await Todo.insert({ ...req.body, user_id });
      res.json(todo);
    } catch (error) {
      next(error);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const todos = await Todo.getAll(user_id);
      res.json(todos);
    } catch (error) {
      next(error);
    }
  })
  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const id = req.params.id;
      const todo = await Todo.getById(id);
      res.json(todo);
    } catch (error) {
      next(error);
    }
  });

