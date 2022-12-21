const DetailComment = require("../DetailComment");

describe("DetailComment entities", () => {
  it("should throw error when not contain needed property", () => {
    expect(() => new DetailComment({})).toThrowError("DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when not meet data type specification", () => {
    expect(() => new DetailComment({ comments: {} })).toThrowError("DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should remap comments data correctly", () => {
    const payload = {
      comments: [
        {
          id: "comment-123",
          username: "radea",
          date: "2022-12-19T19:56:00.338Z",
          content: "A Comment",
          is_delete: false,
        },
        {
          id: "comment-321",
          username: "surya",
          date: "2022-12-16T19:56:00.338Z",
          content: "A Comment",
          is_delete: true,
        },
      ],
    };

    const detailComment = new DetailComment(payload);

    const expectedComments = [
      {
        id: "comment-123",
        username: "radea",
        date: "2022-12-19T19:56:00.338Z",
        content: "A Comment",
      },
      {
        id: "comment-321",
        username: "surya",
        date: "2022-12-16T19:56:00.338Z",
        content: "**komentar telah dihapus**",
      },
    ];

    expect(detailComment.comments).toEqual(expectedComments);
  });
});
