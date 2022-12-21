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
  }) {
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4)",
      values: [id, title, body, owner],
    };

    await pool.query(query);
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
