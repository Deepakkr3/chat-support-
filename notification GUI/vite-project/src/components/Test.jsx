import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const Test = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("from test component");

    // Initialize the socket connection
    socketRef.current = io("http://192.168.29.14:5001/");

  

   

    
  
  

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <><img src="http://192.168.29.14:9098/uploads/6759441b431e8f95deec72ed/1733916715688-6759441b431e8f95deec72ed.png"/>
      <h1>Test</h1>
    </>
  );
};

export default Test;