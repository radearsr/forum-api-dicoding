const CommentRepository = require("../CommentRepository");

describe("CommentRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.addComment({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.checkAvailableComment({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.verifyCommentOwner({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.deleteComment({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.getCommentsThread({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
