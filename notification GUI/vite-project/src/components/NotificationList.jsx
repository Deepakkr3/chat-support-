import React from "react";

const NotificationList = ({ notifications }) => {
  return (
    <div className="p-4 bg-white shadow-lg rounded-md max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-semibold text-[#5F84A6] mb-4">ticket</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">ticket :</p>
      ) : (
        notifications.map((notification, index) => (
          <div key={index} className="p-4 mb-4 border-l-4 border-[#5F84A6] bg-gray-50 rounded-md shadow-sm">
            <h4 className="text-lg font-bold text-[#5F84A6]">{notification.title}</h4>
            <p className="text-gray-600">{notification.count} Tickets</p>
            <p className="text-gray-700">{notification.description}</p>
            <p className="text-sm text-gray-500">Status: {notification.status}</p>
            <p className="text-sm text-gray-400">Created At: {new Date(notification.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationList;
