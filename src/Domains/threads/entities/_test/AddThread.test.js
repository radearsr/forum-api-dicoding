const AddThread = require("../AddThread");

describe("AddThread entities", () => {
  it("should throw error when not contain needed property", () => {
    const payload = {
      title: "My Thread Tittle",
    };
    expect(() => new AddThread(payload)).toThrowError("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when not meet data type specification", () => {
    const payload = {
      title: 123,
      body: ["Body Thread"],
      owner: true,
    };
    expect(() => new AddThread(payload)).toThrowError("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create AddThread corrently", () => {
    const payload = {
      title: "Title Thread",
      body: "Body Thread",
      owner: "user-123",
    };

    const addThread = new AddThread(payload);

    expect(addThread).toBeInstanceOf(AddThread);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.owner).toEqual(payload.owner);
  });
});
