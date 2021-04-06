/*!
 * Copyright (c) 2017-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { createContext, useContext, createElement, useState, useEffect, useRef, Fragment } from 'react';
import { AuthSdkError } from '@okta/okta-auth-js';
import { useLocation, Navigate } from 'react-router-dom';

var OktaContext = /*#__PURE__*/createContext(null);
var useOktaAuth = function useOktaAuth() {
  return useContext(OktaContext);
};

var OktaError = function OktaError(_ref) {
  var error = _ref.error;

  if (error.name && error.message) {
    return /*#__PURE__*/createElement("p", null, error.name, ": ", error.message);
  }

  return /*#__PURE__*/createElement("p", null, "Error: ", error.toString());
};

var Security = function Security(_ref) {
  var oktaAuth = _ref.oktaAuth,
      restoreOriginalUri = _ref.restoreOriginalUri,
      onAuthRequired = _ref.onAuthRequired,
      children = _ref.children;

  var _React$useState = useState(function () {
    if (!oktaAuth) {
      return {
        isPending: true,
        isAuthenticated: false,
        idToken: null,
        accessToken: null
      };
    }

    return oktaAuth.authStateManager.getAuthState();
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      authState = _React$useState2[0],
      setAuthState = _React$useState2[1];

  useEffect(function () {
    if (!oktaAuth || !restoreOriginalUri) {
      return;
    }

    if (oktaAuth.options.restoreOriginalUri && restoreOriginalUri) {
      console.warn('Two custom restoreOriginalUri callbacks are detected. The one from the OktaAuth configuration will be overridden by the provided restoreOriginalUri prop from the Security component.');
    }

    oktaAuth.options.restoreOriginalUri = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(oktaAuth, originalUri) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                restoreOriginalUri(oktaAuth, originalUri);

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    oktaAuth.userAgent = "@okta/okta-react".concat("/", "5.2.0", " ", oktaAuth.userAgent);
    oktaAuth.authStateManager.subscribe(function (authState) {
      setAuthState(authState);
    });

    if (!oktaAuth.isLoginRedirect()) {
      oktaAuth.authStateManager.updateAuthState();
    }

    return function () {
      return oktaAuth.authStateManager.unsubscribe();
    };
  }, [oktaAuth, restoreOriginalUri]);

  if (!oktaAuth) {
    var err = new AuthSdkError('No oktaAuth instance passed to Security Component.');
    return /*#__PURE__*/createElement(OktaError, {
      error: err
    });
  }

  if (!restoreOriginalUri) {
    var _err = new AuthSdkError('No restoreOriginalUri callback passed to Security Component.');

    return /*#__PURE__*/createElement(OktaError, {
      error: _err
    });
  }

  return /*#__PURE__*/createElement(OktaContext.Provider, {
    value: {
      oktaAuth: oktaAuth,
      authState: authState,
      _onAuthRequired: onAuthRequired
    }
  }, children);
};

var withOktaAuth = function withOktaAuth(ComponentToWrap) {
  var WrappedComponent = function WrappedComponent(props) {
    var oktaAuthProps = useOktaAuth();
    return /*#__PURE__*/createElement(ComponentToWrap, Object.assign({}, oktaAuthProps, props));
  };

  WrappedComponent.displayName = 'withOktaAuth_' + (ComponentToWrap.displayName || ComponentToWrap.name);
  return WrappedComponent;
};

var LoginCallback = function LoginCallback(_ref) {
  var errorComponent = _ref.errorComponent,
      onAuthResume = _ref.onAuthResume;

  var _useOktaAuth = useOktaAuth(),
      oktaAuth = _useOktaAuth.oktaAuth,
      authState = _useOktaAuth.authState;

  var authStateReady = !authState.isPending;
  var ErrorReporter = errorComponent || OktaError;
  useEffect(function () {
    var _a;

    if (onAuthResume && ((_a = oktaAuth.isInteractionRequired) === null || _a === void 0 ? void 0 : _a.call(oktaAuth))) {
      onAuthResume();
      return;
    }

    oktaAuth.handleLoginRedirect()["catch"](function (err) {
      console.log(err);
    });
  }, [oktaAuth]);

  if (authStateReady && authState.error) {
    return /*#__PURE__*/createElement(ErrorReporter, {
      error: authState.error
    });
  }

  return null;
};

var RouteGuard = function RouteGuard(_ref) {
  var children = _ref.children;

  var _useOktaAuth = useOktaAuth(),
      oktaAuth = _useOktaAuth.oktaAuth,
      authState = _useOktaAuth.authState,
      _onAuthRequired = _useOktaAuth._onAuthRequired;

  var location = useLocation();
  var pendingLogin = useRef(false);

  var _React$useState = useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      requestedLocation = _React$useState2[0],
      setRequestedLocation = _React$useState2[1];

  useEffect(function () {
    var handleLogin = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!pendingLogin.current) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                pendingLogin.current = true;
                oktaAuth.setOriginalUri();
                _context.next = 6;
                return oktaAuth.signInWithRedirect();

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function handleLogin() {
        return _ref2.apply(this, arguments);
      };
    }();

    if (authState.isAuthenticated) {
      pendingLogin.current = false;
      return;
    }

    if (!authState.isAuthenticated && !authState.isPending) {
      handleLogin();
    }
  }, [authState.isPending, authState.isAuthenticated, oktaAuth, _onAuthRequired]);

  if (!authState.isAuthenticated) {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }

    return null;
  }

  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return /*#__PURE__*/createElement(Navigate, {
      to: requestedLocation
    });
  }

  return /*#__PURE__*/createElement(Fragment, null, children);
};

export { LoginCallback, OktaContext, RouteGuard, Security, useOktaAuth, withOktaAuth };
//# sourceMappingURL=okta-react.esm.js.map
