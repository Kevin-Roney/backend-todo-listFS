const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorizeTodo = require('../middleware/authorizeTodo');
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
  .put('/:id', authenticate, authorizeTodo, async (req, res, next) => {
    try {
      const todo = await Todo.updateById(req.params.id, req.body);
      res.json(todo);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:id', authenticate, authorizeTodo, async (req, res, next) => {
    try{
      const todo = await Todo.delete(req.params.id);
      res.json(todo);
    } catch (error) {
      next(error);
    }
  });

