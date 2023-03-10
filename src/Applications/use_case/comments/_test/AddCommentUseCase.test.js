const AddedComment = require("../../../../Domains/comments/entities/AddedComment");
const AddComment = require("../../../../Domains/comments/entities/AddComment");
const AddCommentUseCase = require("../AddCommentUseCase");
const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");

describe("AddCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    const useCasePayload = {
      thread: "thread-h123",
      content: "A Comment",
      owner: "user-123",
    };

    const expectedAddedComment = new AddedComment({
      id: "comment-12345",
      content: "A Content",
      owner: "user-123",
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(new AddedComment({
      id: "comment-12345",
      content: "A Content",
      owner: "user-123",
    })));

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await getCommentUseCase.execute(useCasePayload);

    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.checkAvailableThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      thread: useCasePayload.thread,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
  });
});
