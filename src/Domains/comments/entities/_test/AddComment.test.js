const AddComment = require("../AddComment");

describe("AddComment entities", () => {
  it("should throw error when payload not contain needed property", () => {
    const payload = {
      content: "A Content",
      thread: "thread-123",
    };

    expect(() => new AddComment(payload)).toThrowError("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when not meet data type specification", () => {
    const payload = {
      content: 1234,
      thread: ["thread-123"],
      owner: {},
    };
    expect(() => new AddComment(payload)).toThrowError("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create AddComment entities correctly", () => {
    const payload = {
      content: "A content",
      thread: "thread-h123",
      owner: "user-123",
    };
    const addComment = new AddComment(payload);
    expect(addComment.content).toEqual(payload.content);
  });
});
