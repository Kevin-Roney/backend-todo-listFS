const Todo = require('../models/Todo');

module.exports = async (req, res, next) => {
  try {
    const todo = await Todo.getById(req.params.id);

    if (!todo || todo.user_id !== req.user.id) {
      throw new Error('You are not authorized to view this todo');
    }
    next();
  } catch (error) {
    error.status = 403;
    next(error);
  }
};
