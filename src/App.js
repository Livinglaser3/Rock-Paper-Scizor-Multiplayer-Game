// import { withAuthenticator } from '@aws-amplify/ui-react';
import React from 'react';
import './App.css';
import {Amplify} from 'aws-amplify';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
import GameRoom from './GameRoom.js';



Amplify.configure(awsExports);


function App({ signOut, user }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome, {user.username}!</h1>
      <button onClick={signOut}>Sign Out</button>

      <GameRoom user={user} />
    </div>
  );
}

export default withAuthenticator(App);
