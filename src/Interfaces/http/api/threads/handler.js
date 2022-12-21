const ThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const DetailThreadUseCase = require("../../../../Applications/use_case/DetailThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const { id } = request.auth.credentials;
    const threadPayload = {
      title: request.payload.title,
      body: request.payload.body,
      owner: id,
    };

    const addedThread = await threadUseCase.execute(threadPayload);

    return h.response({
      status: "success",
      data: {
        addedThread,
      },
    }).code(201);
  }

  async getDetailThreadHandler(request, h) {
    const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
    const useCasePayload = {
      thread: request.params.threadId,
    };
    const { thread } = await detailThreadUseCase.execute(useCasePayload);

    return h.response({
      status: "success",
      data: {
        thread,
      },
    });
  }
}

module.exports = ThreadsHandler;
