import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import NotificationList from "./NotificationList";
import Chat from "./Chat";

function MSG() {

  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [room, setRoom] = useState("");
  //const [userId, setUserId] = useState(""); // Assuming you are setting this based on logged-in user
  const socketRef = useRef(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Get room from localStorage when component mounts
    const savedRoom = localStorage.getItem("room");

    if (savedRoom) {
      setRoom(savedRoom);
    }

    socketRef.current = io("http://192.168.29.14:5001/");
    socketRef.current.on("previous-messages", (messages) => {
      console.log("Received previous messages zcasdd", messages);
      setReceivedMessages(messages); // Populate chat with previous messages
    });

    socketRef.current.on("input-message", (data) => {
      console.log("Received message :input-message event", data);
      setReceivedMessages((prevMessages) => [...prevMessages, data]);
    });

    socketRef.current.on("newTicketNotification", (data) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          ticketId: data.ticketId,
          title: data.title,
          description: data.description,
          status: data.status,
          createdAt: data.createdAt,
        },
      ]);
    });

    if (savedRoom) {
      socketRef.current.emit("joinTicket", savedRoom);
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (room) {
      socketRef.current.emit("message", { ticketId: room, userId, message });
      setMessage("");
    } else {
      alert("Please enter a room to join the chat.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* <NotificationList notifications={notifications} /> */}
      <Chat
        room={room}
        message={message}
        setRoom={setRoom}
        setMessage={setMessage}
        submitHandler={submitHandler}
        receivedMessages={receivedMessages}
      />
    </div>
  );
}

export default MSG;
