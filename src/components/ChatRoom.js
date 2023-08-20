import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { FaUser } from 'react-icons/fa';
import './styles.css';

function ChatRoom({ user }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInput = useRef();
  
    useEffect(() => {
      const q = query(collection(db, 'chatroom1'), orderBy('createdAt'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        setMessages(newMessages);
      });
  
      return () => unsubscribe();
    }, []);
  
    const sendMessage = async () => {
        if (newMessage !== "" || imageUrl) {
          await addDoc(collection(db, 'chatroom1'), {
            text: newMessage,
            imageUrl: imageUrl,
            createdAt: serverTimestamp(),
            uid: user.uid,
          });
          setNewMessage("");
          setImageUrl("");
        }
      };
  
      const handleUpload = async (e) => {
        const file = e.target.files[0];
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
      
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          }, 
          (error) => {
            console.error("Upload failed:", error);
          }, 
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageUrl(downloadURL);
            });
          }
        );
      };
  
    const handleUploadClick = () => {
      fileInput.current.click();
    };
  
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
      };
    return (
<div className={`chatBox ${messages.length > 0 ? 'hasMessages' : ''}`}>
            <h1>Chat Room</h1>
        {messages.map(message => (
          <p key={message.id} className={`message ${message.uid === user.uid ? 'outgoing' : 'incoming'}`}>
            <FaUser style={{ color: `#${message.uid.substring(0, 6)}` }} />
            {message.text}
            {message.imageUrl && <img src={message.imageUrl} alt="message" onClick={() => handleImageClick(message.imageUrl)} />}
          </p>
        ))}
        <div className="input-area">
          <input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' ? sendMessage() : null}
            placeholder="Type your message here..."
          />
          <button onClick={sendMessage}>Send</button>
          <input
            type="file"
            style={{ display: 'none' }}
            ref={fileInput}
            onChange={handleUpload}
          />
          <button onClick={handleUploadClick}>Upload</button>
        </div>
        {selectedImage && (
          <div className="modal">
            <span className="close" onClick={() => setSelectedImage(null)}>&times;</span>
            <img className="modal-content" src={selectedImage} alt="selected" />
          </div>
        )}
      </div>
    );
  }
  
  export default ChatRoom;