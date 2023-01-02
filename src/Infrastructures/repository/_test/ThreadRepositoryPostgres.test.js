const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  afterAll(async () => {
    pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe("addThread function", () => {
    it("should persist new thread and return added thread correctly", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123", username: "radea", password: "iloveyou", fullname: "Radea Surya R",
      });

      const newThread = new AddThread({
        title: "Title Thread",
        body: "Body Thread",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(newThread);
      const thread = await ThreadsTableTestHelper.findThreadById("thread-h123");

      expect(addedThread).toStrictEqual(new AddedThread({
        id: "thread-h123",
        title: "Title Thread",
        body: "Body Thread",
        owner: "user-123",
      }));
      expect(thread).toHaveLength(1);
    });
  });

  describe("checkAvailableThread", () => {
    it("should throw NotFoundError if thread not available", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = "xxx";

      await expect(threadRepositoryPostgres.checkAvailableThread(threadId))
        .rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError if thread avaialable", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: "user-123", username: "radea" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-h123",
        body: "A body of thread",
        owner: "user-123",
      });

      await expect(threadRepositoryPostgres.checkAvailableThread("thread-h123")).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("getDetailThread function", () => {
    it("should get detail thread", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const userPayload = {
        id: "user-123",
        username: "radea",
      };
      const threadPayload = {
        id: "thread-h123",
        title: "A Title",
        body: "A Body of Title",
        owner: userPayload.id,
      };
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);

      const detailThread = await threadRepositoryPostgres.getDetailThread(threadPayload.id);

      expect(detailThread.id).toEqual(threadPayload.id);
      expect(detailThread.title).toEqual(threadPayload.title);
      expect(detailThread.body).toEqual(threadPayload.body);
      expect(detailThread.username).toEqual(userPayload.username);
      expect(detailThread.date).toBeInstanceOf(Date);
    });
  });
});
