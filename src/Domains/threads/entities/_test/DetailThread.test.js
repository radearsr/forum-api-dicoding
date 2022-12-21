const DetailThread = require("../DetailThread");

describe("DetailThread entities", () => {
  it("should throw error when not contain needed property", () => {
    expect(() => new DetailThread({})).toThrowError("DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when not meet data type specification", () => {
    expect(() => new DetailThread({ thread: 123 })).toThrowError("DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create DetailThread entities correctly", () => {
    const payload = {
      thread: "thread-123",
    };
    const detailThread = new DetailThread(payload);
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread.thread).toEqual(payload.thread);
  });
});
