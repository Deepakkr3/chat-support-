import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you are using react-router for navigation
import axios from "axios";
import NotificationList from "./NotificationList";
import { io } from "socket.io-client";

const CreatTicket = () => {
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",

    userId: "1231",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call your backend API to create the ticket
      const response = await axios.post("http://192.168.29.14:5001/api/v1/tickets", formData);
      if (response.status === 201) {
        console.log("Ticket created successfully:", response.data);
        localStorage.setItem("room", response.data._id);
        // Set the room in local storage for later use
        localStorage.setItem("userId", response.data.userId);

        // Redirect to the message/chat page after ticket creation
        navigate(`/support/ticket/message`);
      }
    } catch (error) {
      console.error("Error creating ticket", error);
    }
  };

  useEffect(() => {
    socketRef.current = io("http://192.168.29.14:5001/");
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
  });

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg mt-10">
      {/* <NotificationList notifications={notifications} /> */}
      <h2 className="text-2xl font-semibold text-[#5F84A6] mb-6 text-center">Create a Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#5F84A6] focus:border-[#5F84A6] transition duration-300"
            placeholder="Enter the ticket title"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#5F84A6] focus:border-[#5F84A6] transition duration-300"
            placeholder="Describe the issue"
            rows="4"
            required
          ></textarea>
        </div>
        {/* <div>
          <label htmlFor="status" className="block mb-2 font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#5F84A6] focus:border-[#5F84A6] transition duration-300"
            required
          >
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div> */}
        <button
          type="submit"
          className="w-full bg-[#5F84A6] text-white font-semibold rounded-md p-3 hover:bg-[#4c6d85] transition duration-300"
        >
          Create Ticket
        </button>
      </form>
    </div>
  );
};

export default CreatTicket;
