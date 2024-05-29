import React, { useRef, useEffect } from 'react';


const WhiteBoard = ({ socketRef, roomid }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Function to draw received data
    const drawReceivedData = (data) => {
      if (data.type === 'draw') {
        drawPixel(data.x, data.y);
      }
    };

    // Event listener for drawing data from server
    socketRef.current.on('board-sync', drawReceivedData);

    // Clean up event listener on component unmount
    return () => {
      socketRef.current.off('board-sync', drawReceivedData);
    };
  }, [socketRef, roomid]);

  const handleMouseMove = (event) => {
    const { offsetX, offsetY } = event;
    const data = { type: 'draw', x: offsetX, y: offsetY };
    socketRef.current.emit('board-sync', { data, roomid });
    drawPixel(offsetX, offsetY);
  };

  const drawPixel = (x, y) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillRect(x, y, 5, 5); // Adjust size as needed
  };

  return (
    <canvas
      ref={canvasRef}
      id="whiteboard"
      className='w-full h-[70vh] bg-white'
      style={{ border: '1px solid black' }} // Add a border for visibility
      onMouseMove={handleMouseMove}
    ></canvas>
  );
};

export default WhiteBoard;
