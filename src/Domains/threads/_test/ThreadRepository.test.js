const ThreadRepository = require("../ThreadRepository");

describe("ThreadRepostiory", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.addThread({})).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(threadRepository.checkAvailableThread({})).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(threadRepository.getDetailThread("")).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
