import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Chat from "./Chat";
import axios from "axios"; // Reuse the existing chat component

const SupportView = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState({});
  const socketRef = useRef(null);
  const [showChatRoom, setShowChatRoom] = useState(true);
  const [noTicketsMessage, setNoTicketsMessage] = useState("");

  const fatchTicket = async () => {
    const response = await axios.get("http://192.168.29.14:5001/api/v1/tickets");
    console.log("all tickets from support va api",response.data.tickets);
    // console.log(response.data.tickets);
    if (response.data.tickets.length > 0) {
      response.data.tickets.map((tick) => {
        const msg = tick.messages.length - 1;
        const temp = { ticketId: tick._id, userId: tick.userId, message: msg.message };
        // console.log(temp);
        setTickets((res) => {
          return [...res, temp];
        });
      });
    } else {
      return;
    }
    // setTickets(response.data.tickets);
  };
  useEffect(() => {
    // fatchTicket();
    socketRef.current = io("http://192.168.29.14:5001/");
    console.log("support log",socketRef.current);
    socketRef.current.on("prev",(x)=>{
      console.log("skfguwsefiu")
      console.log(x)
    })
    //handle handshake
    socketRef.current.on("no-active-tickets", (data) => {
      console.log(data.message); // "No active tickets to join."
      // Optionally display this message in the UI
      setNoTicketsMessage(data.message);
    });

    socketRef.current.emit("joinSupportRoom");

    socketRef.current.on("support-message", (data) => {
      const { ticketId, userId, message } = data;
      setTickets((prevTickets) => {
        const existingTicket = prevTickets.find((ticket) => ticket.ticketId === ticketId);
        if (existingTicket) {
          return prevTickets.map((ticket) => (ticket.ticketId === ticketId ? { ticketId, userId, message } : ticket));
        } else {
          return [...prevTickets, { ticketId, userId, message }];
        }
      });
      setReceivedMessages((prevMessages) => ({
        ...prevMessages,
        [ticketId]: [...(prevMessages[ticketId] || []), { userId, message }],
      }));
    });
    fatchTicket();
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const joinTicketRoom = (ticketId) => {
    setSelectedTicketId(ticketId);
    socketRef.current.off("input-message");

    socketRef.current.emit("joinTicket", ticketId);

    // Listen for previous messages when joining a ticket room
    socketRef.current.on("previous-messages", (previousMessages) => {
      setReceivedMessages((prevMessages) => ({
        ...prevMessages,
        [ticketId]: previousMessages,
      }));
    });
    //-update
    // socketRef.current.on("input-message", (data) => {
    //   setReceivedMessages((prevMessages) => ({
    //     ...prevMessages,
    //     [ticketId]: [...(prevMessages[ticketId] || []), data],
    //   }));
    // });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTicketId && message) {
      const userId = "001"; // Static userId for the support agent
      socketRef.current.emit("message", {
        ticketId: selectedTicketId,
        userId,
        message,
      });
      setMessage("");
    }
  };

  const toggleChatRoom = () => {
    setShowChatRoom((prevShowChatRoom) => !prevShowChatRoom);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-md max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-[#5F84A6] mb-6">{noTicketsMessage}</h2>
      <button onClick={toggleChatRoom} className="p-2 bg-[#5F84A6] text-white font-bold rounded-md hover:bg-[#4a6d8c]">
        {showChatRoom ? "Hide Chat Room" : "Show Chat Room"}
      </button>

      <div className="h-96 overflow-y-scroll bg-gray-50 p-4 border border-gray-300 rounded-md">
        {/* {console.log(tickets)} */}

        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <div key={index} className="mb-4">
              <p>
                <strong>Ticket ID:</strong> {ticket.ticketId}
              </p>
              <p>
                <strong>User:</strong> {ticket.userId}
              </p>
              <p>
                <strong>Latest Message:</strong> {ticket.message}
              </p>
              <button
                onClick={() => joinTicketRoom(ticket.ticketId)}
                className="mt-2 p-2 bg-[#5F84A6] text-white font-bold rounded-md hover:bg-[#4a6d8c]"
              >
                Reply / Join Chat Room
              </button>
              <hr className="my-4" />
            </div>
          ))
        ) : (
          <p>No tickets yet.</p>
        )}
      </div>

      {selectedTicketId && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-[#5F84A6] mb-4">Chat for Ticket ID: {selectedTicketId}</h3>
          {showChatRoom && (
            <Chat
              room={selectedTicketId}
              message={message}
              setMessage={setMessage}
              submitHandler={handleSubmit}
              receivedMessages={receivedMessages[selectedTicketId] || []}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SupportView;
