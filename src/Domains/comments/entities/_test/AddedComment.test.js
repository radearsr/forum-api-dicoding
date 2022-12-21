const AddedComment = require("../AddedComment");

describe("AddedComment entities", () => {
  it("should throw error when not contain needed property", () => {
    const payload = {
      id: "comment-123",
      content: "content",
    };
    expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when not meet data type specification", () => {
    const payload = {
      id: 1234,
      content: ["content"],
      owner: true,
    };
    expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create addedComment entities correctly", () => {
    const payload = {
      id: "comment-123",
      content: "content",
      owner: "user-123",
    };

    const addedComment = new AddedComment(payload);
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
