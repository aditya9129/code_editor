import React, { useEffect, useRef } from 'react';

function WhiteBoard({ socketRef ,roomid}) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    contextRef.current = context;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleDraw = ({ offsetX, offsetY, isDrawing }) => {
      if (!isDrawing) return;
      context.lineTo(offsetX, offsetY);
      context.stroke();
      context.beginPath();
      context.moveTo(offsetX, offsetY);
    };

    socketRef.current.on('draw', handleDraw);
    socketRef.current.on('clear', clearCanvas);

    return () => {
      socketRef.current.off('draw', handleDraw);
      socketRef.current.off('clear', clearCanvas);
    };
  }, [socketRef]);

  const getCanvasCoordinates = (nativeEvent) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: nativeEvent.clientX - rect.left,
      offsetY: nativeEvent.clientY - rect.top,
    };
  };

  const startDrawing = (nativeEvent) => {
    const { offsetX, offsetY } = getCanvasCoordinates(nativeEvent);
    isDrawingRef.current = true;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    socketRef.current.emit('draw', { offsetX, offsetY, isDrawing: true ,roomid:roomid});
  };

  const endDrawing = () => {
    isDrawingRef.current = false;
    contextRef.current.closePath();
    socketRef.current.emit('draw', { isDrawing: false,roomid:roomid });
  };

  const draw = (nativeEvent) => {
    if (!isDrawingRef.current) return;
    const { offsetX, offsetY } = getCanvasCoordinates(nativeEvent);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    socketRef.current.emit('draw', { offsetX, offsetY, isDrawing: true,roomid:roomid });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleClear = () => {
    clearCanvas();
    socketRef.current.emit('clear',{roomid});
  };

  return (
    <div className='w-full h-[70vh]'>
     
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        className="border border-black bg-white w-full h-[64vh]"
      />
       <button onClick={handleClear} className="mb-2 p-2 bg-red-500 text-white rounded">
        Clear Board
      </button>
    </div>
  );
}

export default WhiteBoard;
