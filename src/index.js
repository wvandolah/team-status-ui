import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from './react-auth0-spa';
import history from './utils/history';
import { SnackbarProvider } from 'notistack';

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState) => {
  history.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname);
};

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_domain}
    client_id={process.env.REACT_APP_AUTH0_clientId}
    redirect_uri={window.location.origin}
    audience={process.env.REACT_APP_AUTH0_audience}
    onRedirectCallback={onRedirectCallback}
  >
    <SnackbarProvider maxSnack={3}>
      <App />
    </SnackbarProvider>
  </Auth0Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
