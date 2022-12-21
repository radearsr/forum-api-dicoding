const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const { title, body, owner } = thread;
    const id = `thread-h${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async checkAvailableThread(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async getDetailThread(threadId) {
    const query = {
      text: "SELECT thr.id, thr.title, thr.body, thr.created_at AS date, usr.username FROM threads AS thr LEFT JOIN users AS usr ON usr.id = thr.owner WHERE thr.id = $1",
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    const [result] = rows;

    return result;
  }
}

module.exports = ThreadRepositoryPostgres;
