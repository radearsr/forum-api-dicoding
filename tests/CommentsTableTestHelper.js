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
    createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: "INSERT INTO comments (id, content, thread, owner, created_at) VALUES($1, $2, $3, $4, $5)",
      values: [id, content, thread, owner, createdAt],
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
