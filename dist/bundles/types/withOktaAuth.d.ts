import * as React from 'react';
import { IOktaContext } from './OktaContext';
declare const withOktaAuth: <P extends IOktaContext>(ComponentToWrap: React.ComponentType<P>) => React.FC<Pick<P, Exclude<keyof P, "oktaAuth" | "authState" | "_onAuthRequired">>>;
export default withOktaAuth;
