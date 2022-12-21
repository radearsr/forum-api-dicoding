class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.thread = payload.thread;
  }

  _verifyPayload({ thread }) {
    if (!thread) {
      throw new Error("DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof thread !== "string") {
      throw new Error("DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DetailThread;
