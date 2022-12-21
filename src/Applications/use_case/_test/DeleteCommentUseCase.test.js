const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("DeleteCommentUseCase", () => {
  it("should throw error when not contain needed property", async () => {
    const useCasePayload = {};
    const deleteCommentUseCase = new DeleteCommentUseCase({});
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError("DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when not meet data type specification", async () => {
    const useCasePayload = {
      comment: 123,
      thread: true,
      owner: ["user-123"],
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});
    expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError("DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should orchestracting the delete comment action correctly", async () => {
    const useCasePayload = {
      thread: "thread-h123",
      comment: "comment-123",
      owner: "user-123",
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailableComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.checkAvailableComment)
      .toHaveBeenCalledWith(useCasePayload.comment);
    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.comment, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCasePayload.comment);
  });
});
