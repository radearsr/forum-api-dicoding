const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(commentPayload) {
    const { content, thread, owner } = commentPayload;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, content, thread, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async checkAvailableComment(comment) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [comment],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError("komentar tidak ditemukan");
  }

  async verifyCommentOwner(comment, owner) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND owner = $2",
      values: [comment, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new AuthorizationError("anda tidak berhak mengakses sumber ini");
  }

  async deleteComment(comment) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1",
      values: [comment],
    };
    await this._pool.query(query);
  }

  async getCommentsThread(thread) {
    const query = {
      text: "SELECT cmn.id, usr.username, cmn.created_at AS date, cmn.content, cmn.is_delete FROM comments AS cmn LEFT JOIN users AS usr ON usr.id = cmn.owner WHERE cmn.thread = $1 ORDER BY cmn.created_at ASC",
      values: [thread],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
