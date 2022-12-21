const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const thread = request.params.threadId;
    const commentPayload = {
      content: request.payload.content,
      thread,
      owner,
    };

    const addedComment = await addCommentUseCase.execute(commentPayload);

    return h.response({
      status: "success",
      data: {
        addedComment,
      },
    }).code(201);
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId: thread, commentId: comment } = request.params;
    const commentDelPayload = {
      thread,
      comment,
      owner,
    };

    await deleteCommentUseCase.execute(commentDelPayload);

    return h.response({
      status: "success",
    });
  }
}

module.exports = CommentsHandler;
