const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");

describe("/threads/{threadId}/comments", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should reponse 201 and return addedComment", async () => {
      const loginPayload = {
        username: "radea",
        password: "iloveyou",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "radea",
          password: "iloveyou",
          fullname: "Radea Surya R",
        },
      });

      const authentication = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "A Thread",
          body: "A Body of Thread",
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "A comment",
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it("should reponse 400 if payload not contain needed property", async () => {
      const loginPayload = {
        username: "radea",
        password: "iloveyou",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "radea",
          password: "iloveyou",
          fullname: "Radea Surya R",
        },
      });

      const authentication = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "A Thread",
          body: "A Body of Thread",
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {},
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada");
    });

    it("should reponse 400 if payload not meet data specification", async () => {
      const loginPayload = {
        username: "radea",
        password: "iloveyou",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "radea",
          password: "iloveyou",
          fullname: "Radea Surya R",
        },
      });

      const authentication = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "A Thread",
          body: "A Body of Thread",
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 123,
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat komentar baru karena tipe data tidak sesuai");
    });

    it("should reponse 404 if thread id is not valid", async () => {
      const loginPayload = {
        username: "radea",
        password: "iloveyou",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "radea",
          password: "iloveyou",
          fullname: "Radea Surya R",
        },
      });

      const authentication = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const response = await server.inject({
        method: "POST",
        url: "/threads/xxx/comments",
        payload: {
          content: "A Comment",
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });

    it("should reponse 401 if payload not access token", async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads/xxx/comments",
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 200 and return status success", async () => {
      const loginPayload = {
        username: "radea",
        password: "iloveyou",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "radea",
          password: "iloveyou",
          fullname: "Radea Surya R",
        },
      });

      const authentication = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "A Thread",
          body: "A Body of Thread",
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comments = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "A comment",
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const commentReponse = JSON.parse(comments.payload);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentReponse.data.addedComment.id}`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 404 if comment not available", async () => {
      const loginPayload = {
        username: "radea",
        password: "iloveyou",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "radea",
          password: "iloveyou",
          fullname: "Radea Surya R",
        },
      });

      const authentication = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "A Thread",
          body: "A Body of Thread",
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/xxx`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("komentar tidak ditemukan");
    });

    it("should response 404 if thread not available", async () => {
      const loginPayload = {
        username: "radea",
        password: "iloveyou",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "radea",
          password: "iloveyou",
          fullname: "Radea Surya R",
        },
      });

      const authentication = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const response = await server.inject({
        method: "DELETE",
        url: "/threads/xxx/comments/xxx",
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });

    it("should response 403 when other user delete the comment", async () => {
      const firstLoginPayload = {
        username: "radea",
        password: "iloveyou",
      };

      const secondLoginPayload = {
        username: "surya",
        password: "iloveyou",
      };

      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "radea",
          password: "iloveyou",
          fullname: "Radea Surya R",
        },
      });

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "surya",
          password: "iloveyou",
          fullname: "Surya Ramandhita",
        },
      });

      const firstAuthentication = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: firstLoginPayload,
      });

      const secondAuthentication = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: secondLoginPayload,
      });

      const firstResponseAuth = JSON.parse(firstAuthentication.payload);
      const secondResponseAuth = JSON.parse(secondAuthentication.payload);

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "A Thread",
          body: "A Body of Thread",
        },
        headers: { Authorization: `Bearer ${firstResponseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comments = await server.inject({
        method: "POST",
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: "A comment",
        },
        headers: { Authorization: `Bearer ${firstResponseAuth.data.accessToken}` },
      });

      const commentReponse = JSON.parse(comments.payload);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentReponse.data.addedComment.id}`,
        headers: { Authorization: `Bearer ${secondResponseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("anda tidak berhak mengakses sumber ini");
    });
  });
});
