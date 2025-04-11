import React from "react";

const Chat = ({ room, message, setMessage, submitHandler, receivedMessages }) => {
  const userId = localStorage.getItem("userId");

  //file

  return (
    <div className="p-4 bg-white shadow-lg rounded-md max-w-lg mx-auto mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Chat Room - {room}</h2>
      <div className="h-64 overflow-y-scroll bg-gray-50 p-4 border border-gray-300 rounded-md">
        {receivedMessages.length > 0 ? (
          receivedMessages.map((msg, index) => (
            <div key={index} className={msg.userId === userId ? "text-right" : "text-left"}>
              <p className="mb-2">
                <strong>{msg.userId === userId ? "You" : `User ${msg.userId}`}:</strong> {msg.message}
              </p>
              {msg.fileUrl && <img src={"http://192.168.29.14:5001" + msg?.fileUrl} alt="uploaded file" />}
              {console.log("http://192.168.29.138:5001" + msg.fileUrl)}
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
      <form onSubmit={submitHandler} className="mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Type your message..."
        />
        <button type="submit" className="mt-2 p-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Chat;
