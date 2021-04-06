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

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _regeneratorRuntime = require('@babel/runtime/regenerator');
var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var React = require('react');
var oktaAuthJs = require('@okta/okta-auth-js');
var reactRouterDom = require('react-router-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);

var OktaContext = /*#__PURE__*/React.createContext(null);
var useOktaAuth = function useOktaAuth() {
  return React.useContext(OktaContext);
};

var OktaError = function OktaError(_ref) {
  var error = _ref.error;

  if (error.name && error.message) {
    return /*#__PURE__*/React.createElement("p", null, error.name, ": ", error.message);
  }

  return /*#__PURE__*/React.createElement("p", null, "Error: ", error.toString());
};

var Security = function Security(_ref) {
  var oktaAuth = _ref.oktaAuth,
      restoreOriginalUri = _ref.restoreOriginalUri,
      onAuthRequired = _ref.onAuthRequired,
      children = _ref.children;

  var _React$useState = React.useState(function () {
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
      _React$useState2 = _slicedToArray__default['default'](_React$useState, 2),
      authState = _React$useState2[0],
      setAuthState = _React$useState2[1];

  React.useEffect(function () {
    if (!oktaAuth || !restoreOriginalUri) {
      return;
    }

    if (oktaAuth.options.restoreOriginalUri && restoreOriginalUri) {
      console.warn('Two custom restoreOriginalUri callbacks are detected. The one from the OktaAuth configuration will be overridden by the provided restoreOriginalUri prop from the Security component.');
    }

    oktaAuth.options.restoreOriginalUri = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee(oktaAuth, originalUri) {
        return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
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
    var err = new oktaAuthJs.AuthSdkError('No oktaAuth instance passed to Security Component.');
    return /*#__PURE__*/React.createElement(OktaError, {
      error: err
    });
  }

  if (!restoreOriginalUri) {
    var _err = new oktaAuthJs.AuthSdkError('No restoreOriginalUri callback passed to Security Component.');

    return /*#__PURE__*/React.createElement(OktaError, {
      error: _err
    });
  }

  return /*#__PURE__*/React.createElement(OktaContext.Provider, {
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
    return /*#__PURE__*/React.createElement(ComponentToWrap, Object.assign({}, oktaAuthProps, props));
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
  React.useEffect(function () {
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
    return /*#__PURE__*/React.createElement(ErrorReporter, {
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

  var location = reactRouterDom.useLocation();
  var pendingLogin = React.useRef(false);

  var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray__default['default'](_React$useState, 2),
      requestedLocation = _React$useState2[0],
      setRequestedLocation = _React$useState2[1];

  React.useEffect(function () {
    var handleLogin = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator__default['default']( /*#__PURE__*/_regeneratorRuntime__default['default'].mark(function _callee() {
        return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
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
    return /*#__PURE__*/React.createElement(reactRouterDom.Navigate, {
      to: requestedLocation
    });
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, children);
};

exports.LoginCallback = LoginCallback;
exports.OktaContext = OktaContext;
exports.RouteGuard = RouteGuard;
exports.Security = Security;
exports.useOktaAuth = useOktaAuth;
exports.withOktaAuth = withOktaAuth;
//# sourceMappingURL=okta-react.cjs.js.map
