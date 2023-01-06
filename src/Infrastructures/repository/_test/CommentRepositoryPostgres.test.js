const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe("addComment function", () => {
    it("should persist new comment and return added comment correctly", async () => {
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "radea",
      });

      await ThreadsTableTestHelper.addThread({
        id: "thread-h123",
        body: "A Thread",
        owner: "user-123",
      });

      const newAddComment = new AddComment({
        content: "A Comment",
        thread: "thread-h123",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const addedComment = await commentRepositoryPostgres.addComment(newAddComment);

      const comment = await CommentsTableTestHelper.findCommentsById("comment-123");
      expect(addedComment).toStrictEqual(new AddedComment({
        id: "comment-123",
        content: "A Comment",
        owner: "user-123",
      }));
      expect(comment).toHaveLength(1);
    });
  });

  describe("checkAvailableComment function", () => {
    it("should throw NotFoundError if comment not available", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = "xxx";

      await expect(commentRepositoryPostgres.checkAvailableComment(comment))
        .rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError if comment available", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: "user-123", username: "radea" });
      await ThreadsTableTestHelper.addThread({ id: "thread-123", body: "A Body of Thread", owner: "user-123" });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "A Comment",
        thread: "thread-123",
        owner: "user-123",
      });

      await expect(commentRepositoryPostgres.checkAvailableComment("comment-123"))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw AuthorizationError if comment not belong to owner", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "radea",
      });
      await UsersTableTestHelper.addUser({
        id: "user-321",
        username: "surya",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-h123",
        body: "A Body of Thread",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "A Comment",
        thread: "thread-h123",
        owner: "user-123",
      });
      const comment = "comment-123";
      const owner = "user-321";

      await expect(commentRepositoryPostgres.verifyCommentOwner(comment, owner))
        .rejects.toThrow(AuthorizationError);
    });

    it("should not throw AuthorizationError if comment belongs to owner", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "radea",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-h123",
        body: "A Body of Thread",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "A comment",
        thread: "thread-h123",
        owner: "user-123",
      });

      await expect(commentRepositoryPostgres.verifyCommentOwner("comment-123", "user-123"))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("deleteComment", () => {
    it("should change to true column is_delete from database", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: "user-123", username: "radea" });
      await ThreadsTableTestHelper.addThread({ id: "thread-h123", body: "A Body of Thread", owner: "user-123" });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "A Comment",
        thread: "thread-h123",
      });

      await commentRepositoryPostgres.deleteComment("comment-123");

      const comment = await CommentsTableTestHelper.checkDeletedCommentById("comment-123");
      expect(comment).toEqual(true);
    });
  });

  describe("getCommentsThread", () => {
    it("should get comments of thread", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const createdAt = new Date().toISOString();

      const userPayload = {
        id: "user-123",
        username: "radea",
      };
      const threadPayload = {
        id: "thread-h123",
        title: "A Title Thread",
        body: "A Body of Thread",
        owner: userPayload.id,
      };
      const commentPayload = {
        id: "comment-123",
        content: "A Comment",
        thread: "thread-h123",
        owner: "user-123",
        createdAt,
      };
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);

      const comments = await commentRepositoryPostgres.getCommentsThread("thread-h123");
      const [comment] = comments;
      expect(Array.isArray(comments)).toBe(true);
      expect(comment.id).toEqual("comment-123");
      expect(comment.username).toEqual("radea");
      expect(comment.content).toEqual("A Comment");
      expect(comment.date).toEqual(createdAt);
    });
  });
});
