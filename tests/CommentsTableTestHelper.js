/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async cleanTable() {
    await pool.query("TRUNCATE TABLE comments");
  },
  async findCommentsById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },
  async addComment({
    id = "comment-123",
    content = "Content",
    thread = "thread-123",
    owner = "user-123",
  }) {
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4)",
      values: [id, content, thread, owner],
    };

    await pool.query(query);
  },
  async checkDeletedCommentById(commentId) {
    const query = {
      text: "SELECT is_delete FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows[0].is_delete;
  },
};

module.exports = CommentsTableTestHelper;
