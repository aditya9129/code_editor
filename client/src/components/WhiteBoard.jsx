import React, { useEffect, useRef } from 'react';

function WhiteBoard({ socketRef }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 10;
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

    return () => {
      socketRef.current.off('draw', handleDraw);
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
    socketRef.current.emit('draw', { offsetX, offsetY, isDrawing: true });
  };

  const endDrawing = () => {
    isDrawingRef.current = false;
    contextRef.current.closePath();
    socketRef.current.emit('draw', { isDrawing: false });
  };

  const draw = (nativeEvent) => {
    if (!isDrawingRef.current) return;
    const { offsetX, offsetY } = getCanvasCoordinates(nativeEvent);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    socketRef.current.emit('draw', { offsetX, offsetY, isDrawing: true });
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={endDrawing}
      onMouseMove={draw}
      className="border border-black bg-white w-full h-[70vh]"
    />
  );
}

export default WhiteBoard;
