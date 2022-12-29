const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");

class DetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { thread } = new DetailThread(useCasePayload);
    await this._threadRepository.checkAvailableThread(thread);
    const detailThread = await this._threadRepository.getDetailThread(thread);
    const getCommentsThread = await this._commentRepository.getCommentsThread(thread);
    const detailComments = new DetailComment({ comments: getCommentsThread });
    detailThread.comments = detailComments.comments;
    return {
      thread: detailThread,
    };
  }
}

module.exports = DetailThreadUseCase;
