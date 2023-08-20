import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { signInAnonymously } from "firebase/auth";

function Auth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInAnonymously = () => {
    signInAnonymously(auth)
      .catch((error) => {
        console.error("Error signing in anonymously: ", error);
      });
  };

  const signOut = () => {
    auth.signOut()
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <div>
      {user ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={signInAnonymously}>Sign In Anonymously</button>
      )}
    </div>
  );
}

export default Auth;