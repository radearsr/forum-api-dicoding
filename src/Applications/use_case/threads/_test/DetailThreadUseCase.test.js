const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const DetailThreadUseCase = require("../DetailThreadUseCase");

describe("DetailThreadUseCase", () => {
  it("should get return detail thread correctly", async () => {
    const useCasePayload = {
      thread: "thread-h123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn(() => Promise.resolve({
      id: "thread-h123",
      title: "A Thread",
      body: "A Body of Thread",
      date: "2022-12-19T19:56:00.338Z",
      username: "radea",
    }));
    mockCommentRepository.getCommentsThread = jest.fn(() => Promise.resolve(
      [
        {
          id: "comment-123",
          username: "radea",
          date: "2022-12-19T19:56:00.338Z",
          content: "A Comment",
          is_delete: false,
        },
        {
          id: "comment-321",
          username: "surya",
          date: "2022-12-16T19:56:00.338Z",
          content: "A Comment",
          is_delete: true,
        },
      ],
    ));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await detailThreadUseCase.execute(useCasePayload);
    expect(mockThreadRepository.checkAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockThreadRepository.getDetailThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.getCommentsThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(detailThread).toStrictEqual({
      thread: {
        id: "thread-h123",
        title: "A Thread",
        body: "A Body of Thread",
        date: "2022-12-19T19:56:00.338Z",
        username: "radea",
        comments: [
          {
            id: "comment-123",
            username: "radea",
            date: "2022-12-19T19:56:00.338Z",
            content: "A Comment",
          },
          {
            id: "comment-321",
            username: "surya",
            date: "2022-12-16T19:56:00.338Z",
            content: "**komentar telah dihapus**",
          },
        ],
      },
    });
  });
});
