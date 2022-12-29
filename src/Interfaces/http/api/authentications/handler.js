const LoginUserUseCase = require("../../../../Applications/use_case/users/LoginUserUseCase");
const RefreshAuthenticationUseCase = require("../../../../Applications/use_case/authentications/RefreshAuthenticationUseCase");
const LogoutUserUseCase = require("../../../../Applications/use_case/users/LogoutUserUseCase");

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
  }

  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload);

    return h.response({
      status: "success",
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }

  async putAuthenticationHandler(request) {
    const refreshAuthenticationUseCase = this._container
      .getInstance(RefreshAuthenticationUseCase.name);
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload);

    return {
      status: "success",
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    const logoutUserUseCase = this._container.getInstance(LogoutUserUseCase.name);
    await logoutUserUseCase.execute(request.payload);
    return {
      status: "success",
    };
  }
}

module.exports = AuthenticationsHandler;
