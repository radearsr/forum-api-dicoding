/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1 = 1");
  },
  async addThread({
    id = "thread-123",
    title = "A thread",
    body = "A Body of thread",
    owner = "user-123",
    createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: "INSERT INTO threads (id, title, body, owner, created_at) VALUES ($1, $2, $3, $4, $5)",
      values: [id, title, body, owner, createdAt],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },
  async findThreadById(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },
};

module.exports = ThreadsTableTestHelper;
