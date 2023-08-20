import React, { useState } from 'react';
import ChatRoom from './components/ChatRoom';
import Auth from './components/Auth';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <Auth user={user} setUser={setUser} />
      {user && <ChatRoom user={user} />}
    </div>
  );
}

export default App;