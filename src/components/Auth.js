import React, { useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

function Auth({ user, setUser }) {

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  const handleSignInAnonymously = () => {
    signInAnonymously(auth)
      .catch((error) => {
        console.error("Error signing in anonymously: ", error);
      });
  };

  return (
    <div className="auth-container">
    {!user && <h1>Join the fun</h1>}
    {user ? (
       <div className="sign-out-button"onClick={() => { auth.signOut(); setUser(null); }}>Sign Out</div>
      ) : (
        <button onClick={handleSignInAnonymously}>Sign In Anonymously</button>
      )}
    </div>
  );
}

export default Auth;