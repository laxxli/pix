const tokenService = require('../domain/services/token-service');
const boom = require('boom');
const { find } = require('lodash');
const { graviteeRegisterApplicationsCredentials, livretScolaireAuthentication } = require('../config');

const JSONAPIError = require('jsonapi-serializer').Error;

function _replyWithAuthenticationError(h) {
  return Promise.resolve().then(() => {
    const errorHttpStatusCode = 401;

    const jsonApiError = new JSONAPIError({
      code: errorHttpStatusCode,
      title: 'Unauthorized access',
      detail: 'Missing or invalid access token in request authorization headers.',
    });

    return h.response(jsonApiError).code(errorHttpStatusCode).takeover();
  });
}

function _replyWithAuthorizationError(h) {
  return Promise.resolve().then(() => {
    const errorHttpStatusCode = 403;

    const jsonApiError = new JSONAPIError({
      code: errorHttpStatusCode,
      title: 'Forbidden access',
      detail: 'Missing or insufficient permissions.',
    });

    return h.response(jsonApiError).code(errorHttpStatusCode).takeover();
  });
}

const SCHEMA_JWT = 'jwt';

async function checkApplicationIsAuthenticated(request, h) {

  if (!request.headers.authorization) {
    return boom.unauthorized(null, SCHEMA_JWT);
  }

  const authorizationHeader = request.headers.authorization;
  const accessToken = tokenService.extractTokenFromAuthChain(authorizationHeader);

  if (!accessToken) {
    return _replyWithAuthenticationError(h);
  }

  const decodedAccessToken = tokenService.getDecodedToken(accessToken, livretScolaireAuthentication.secret);

  const application = find(graviteeRegisterApplicationsCredentials, { clientId: decodedAccessToken.client_id });

  if (!application || (decodedAccessToken && decodedAccessToken.client_id !== application.clientId)) {
    return _replyWithAuthenticationError(h);
  }

  if (decodedAccessToken && decodedAccessToken.scope !== application.scope) {
    return _replyWithAuthorizationError(h);
  }

  if (decodedAccessToken && decodedAccessToken.scope === application.scope) {
    return h.authenticated({ credentials: { accessToken, client_id: decodedAccessToken.clientId, source: decodedAccessToken.source } });
  }

  return _replyWithAuthenticationError(h);
}

module.exports = {
  checkApplicationIsAuthenticated,
};