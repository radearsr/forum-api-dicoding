const AddedThread = require("../AddedThread");

describe("AddedThread entities", () => {
  it("should throw error when not contain needed property", () => {
    const payload = {
      id: "thread-123",
      body: "body thread",
    };
    expect(() => new AddedThread(payload)).toThrowError("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
  });
  it("should throw error when not meet data type specification", () => {
    const payload = {
      id: 1233,
      title: {},
      body: "body thread",
      owner: true,
    };
    expect(() => new AddedThread(payload)).toThrowError("ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });
  it("should create AddedThread entities corrently", () => {
    const payload = {
      id: "thread-123",
      title: "title thread",
      body: "body thread",
      owner: "user-123",
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.body).toEqual(payload.body);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
