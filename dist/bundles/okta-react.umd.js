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

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react"),require("@okta/okta-auth-js"),require("react-router-dom")):"function"==typeof define&&define.amd?define(["exports","react","@okta/okta-auth-js","react-router-dom"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).OktaReact={},e.React,e.OktaAuth,e.ReactRouterDOM)}(this,(function(e,t,r,n){"use strict";function a(e,t,r,n,a,o,u){try{var i=e[o](u),c=i.value}catch(e){return void r(e)}i.done?t(c):Promise.resolve(c).then(n,a)}function o(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var u=e.apply(t,r);function i(e){a(u,n,o,i,c,"next",e)}function c(e){a(u,n,o,i,c,"throw",e)}i(void 0)}))}}function u(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var r=[],n=!0,a=!1,o=void 0;try{for(var u,i=e[Symbol.iterator]();!(n=(u=i.next()).done)&&(r.push(u.value),!t||r.length!==t);n=!0);}catch(e){a=!0,o=e}finally{try{n||null==i.return||i.return()}finally{if(a)throw o}}return r}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return i(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return i(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var c=t.createContext(null),s=function(){return t.useContext(c)},l=function(e){var r=e.error;return r.name&&r.message?t.createElement("p",null,r.name,": ",r.message):t.createElement("p",null,"Error: ",r.toString())};e.LoginCallback=function(e){var r=e.errorComponent,n=e.onAuthResume,a=s(),o=a.oktaAuth,u=a.authState,i=!u.isPending,c=r||l;return t.useEffect((function(){var e;n&&(null===(e=o.isInteractionRequired)||void 0===e?void 0:e.call(o))?n():o.handleLoginRedirect().catch((function(e){console.log(e)}))}),[o]),i&&u.error?t.createElement(c,{error:u.error}):null},e.OktaContext=c,e.RouteGuard=function(e){var r=e.children,a=s(),i=a.oktaAuth,c=a.authState,l=a._onAuthRequired,f=n.useLocation(),h=t.useRef(!1),d=u(t.useState(null),2),m=d[0],p=d[1];return t.useEffect((function(){var e=function(){var e=o(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!h.current){e.next=2;break}return e.abrupt("return");case 2:return h.current=!0,i.setOriginalUri(),e.next=6,i.signInWithRedirect();case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();c.isAuthenticated?h.current=!1:c.isAuthenticated||c.isPending||e()}),[c.isPending,c.isAuthenticated,i,l]),c.isAuthenticated?m&&f.pathname!==m?(p(null),t.createElement(n.Navigate,{to:m})):t.createElement(t.Fragment,null,r):(f.pathname!==m&&p(f.pathname),null)},e.Security=function(e){var n=e.oktaAuth,a=e.restoreOriginalUri,i=e.onAuthRequired,s=e.children,f=u(t.useState((function(){return n?n.authStateManager.getAuthState():{isPending:!0,isAuthenticated:!1,idToken:null,accessToken:null}})),2),h=f[0],d=f[1];if(t.useEffect((function(){if(n&&a)return n.options.restoreOriginalUri&&a&&console.warn("Two custom restoreOriginalUri callbacks are detected. The one from the OktaAuth configuration will be overridden by the provided restoreOriginalUri prop from the Security component."),n.options.restoreOriginalUri=function(){var e=o(regeneratorRuntime.mark((function e(t,r){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a(t,r);case 1:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}(),n.userAgent="@okta/okta-react".concat("/","5.2.0"," ",n.userAgent),n.authStateManager.subscribe((function(e){d(e)})),n.isLoginRedirect()||n.authStateManager.updateAuthState(),function(){return n.authStateManager.unsubscribe()}}),[n,a]),!n){var m=new r.AuthSdkError("No oktaAuth instance passed to Security Component.");return t.createElement(l,{error:m})}if(!a){var p=new r.AuthSdkError("No restoreOriginalUri callback passed to Security Component.");return t.createElement(l,{error:p})}return t.createElement(c.Provider,{value:{oktaAuth:n,authState:h,_onAuthRequired:i}},s)},e.useOktaAuth=s,e.withOktaAuth=function(e){var r=function(r){var n=s();return t.createElement(e,Object.assign({},n,r))};return r.displayName="withOktaAuth_"+(e.displayName||e.name),r},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=okta-react.umd.js.map
