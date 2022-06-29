const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  todo;
  completed;
  user_id;

  constructor(row) {
    this.id = row.id;
    this.todo = row.todo;
    this.completed = row.completed;
    this.user_id = row.user_id;
  }

  static async insert({ todo, user_id }) {
    const { rows } = await pool.query(
      `
      INSERT INTO todos (todo, user_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [todo, user_id]
    );

    return new Todo(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      'SELECT * from todos where user_id = $1 ORDER BY id DESC',
      [user_id]
    );
    return rows.map((todo) => new Todo(todo));
  }
  
  static async getById(id) {
    const { rows } = await pool.query(
      'SELECT * from todos where id = $1',
      [id]
    );
    return new Todo(rows[0]);
  }

  static async updateById(id, attrs) {
    const todos = await Todo.getById(id);
    if (!todos) return null;
    const { todo, completed } = { ...todos, ...attrs };
    const { rows } = await pool.query(
      `UPDATE todos
      SET todo = $2, completed = $3
      WHERE id = $1
      RETURNING *`,
      [id, todo, completed]
    );
    return new Todo(rows[0]);
  }

};
