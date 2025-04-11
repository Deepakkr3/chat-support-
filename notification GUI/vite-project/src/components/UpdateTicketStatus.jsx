import React, { useState } from "react";
import axios from "axios";

const UpdateTicketStatus = () => {
  const [status, setStatus] = useState("resolved"); // Default to 'resolved'
  const [message, setMessage] = useState("");
  const [ticketId, setTicketId] = useState(""); // New state for ticket ID

  const handleUpdate = async () => {
    if (!ticketId) {
      setMessage("Please provide a valid ticket ID.");
      return;
    }

    try {
      const response = await axios.put(`http://192.168.29.14:5001/api/v1/tickets/${ticketId}`, { status });
      setMessage("Status updated successfully.");
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("Failed to update the status.");
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-md max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-semibold text-[#5F84A6] mb-4">Update Ticket Status</h2>

      {/* Input field for Ticket ID */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Ticket ID</label>
        <input
          type="text"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          placeholder="Enter Ticket ID"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Dropdown for status selection */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Update button */}
      <button
        onClick={handleUpdate}
        className="w-full p-2 bg-[#5F84A6] text-white font-bold rounded-md hover:bg-[#4a6d8c]"
      >
        Update Status
      </button>

      {/* Display message */}
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default UpdateTicketStatus;
