/*
 * Copyright (c) 2020-Present, Okta, Inc. and/or its affiliates. All rights reserved.
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
import { AuthState, OktaAuth } from '@okta/okta-auth-js';

export type OnAuthRequiredFunction = (oktaAuth: OktaAuth) => Promise<void> | void;
export type OnAuthResumeFunction = () => void;

export type RestoreOriginalUriFunction = (oktaAuth: OktaAuth, originalUri: string) => Promise<void> | void;

export interface IOktaContext {
    oktaAuth: OktaAuth;
    authState: AuthState;
    _onAuthRequired: OnAuthRequiredFunction;
}

const OktaContext = React.createContext<IOktaContext | null>(null);

export const useOktaAuth = (): IOktaContext => React.useContext(OktaContext);

export default OktaContext;
