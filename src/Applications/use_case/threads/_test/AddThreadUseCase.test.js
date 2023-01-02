const AddedThread = require("../../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../../Domains/threads/entities/AddThread");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action corrently", async () => {
    const useCasePayload = {
      title: "title thread",
      body: "body thread",
      owner: "user-123",
    };

    const expectedAddedThread = new AddedThread({
      id: "thread-123",
      title: "title thread",
      body: "body thread",
      owner: "user-123",
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(new AddedThread({
      id: "thread-123",
      title: "title thread",
      body: "body thread",
      owner: "user-123",
    })));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await getThreadUseCase.execute(useCasePayload);
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
  });
});
