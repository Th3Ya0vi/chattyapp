import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import './styles.css';

function DirectMessage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = "currentUser"; // Replace with the actual current user's ID
  const otherUser = "otherUserId"; // Replace with the actual other user's ID

  useEffect(() => {
    const q = query(collection(db, 'directMessages', currentUser, otherUser), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [currentUser, otherUser]);

  const sendMessage = async () => {
    if (newMessage !== "") {
      await addDoc(collection(db, 'directMessages', currentUser, otherUser), {
        text: newMessage,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    }
  };

  return (
    <div>
      <h1>Direct Message</h1>
      {messages.map(message => (
        <p key={message.id}>{message.text}</p>
      ))}
      <input
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default DirectMessage;