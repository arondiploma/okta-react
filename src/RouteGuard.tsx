/*
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

import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useOktaAuth } from './OktaContext';

const RouteGuard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  const { oktaAuth, authState, _onAuthRequired } = useOktaAuth();
  const location = useLocation();
  const pendingLogin = React.useRef(false);
  const [requestedLocation, setRequestedLocation] = React.useState(null);

  React.useEffect(() => {
    const handleLogin = async () => {
      if (pendingLogin.current) {
        return;
      }

      pendingLogin.current = true;
      oktaAuth.setOriginalUri();

      await oktaAuth.signInWithRedirect();
    };

    if (authState.isAuthenticated) {
      pendingLogin.current = false;
      return;
    }

    // Start login if app has decided it is not logged in and there is no pending signin
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

  // This is done so that in case the route changes by any chance through other
  // means between the moment of request and the render we navigate to the initially
  // requested route.
  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

export default RouteGuard;
