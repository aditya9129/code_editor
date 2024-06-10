import React, { useEffect, useRef, useState } from "react";

function WhiteBoard({ socketRef, roomid }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.lineWidth = 5;
    contextRef.current = context;

    // Set initial stroke color
    context.strokeStyle = color;

    // Add event listener for drawing
    const handleDraw = ({ offsetX, offsetY, isDrawing, tool, color }) => {
      if (!isDrawing) return;
      if (tool === "eraser") {
        context.globalCompositeOperation = "destination-out";
        context.strokeStyle = "rgba(0,0,0,1)";
        context.lineWidth = 10;
      } else {
        context.globalCompositeOperation = "source-over";
        context.strokeStyle = color;
        context.lineWidth = 5;
      }
      context.lineTo(offsetX, offsetY);
      context.stroke();
      context.beginPath();
      context.moveTo(offsetX, offsetY);
    };

    socketRef.current.on("draw", handleDraw);
    socketRef.current.on("clear", clearCanvas);

    return () => {
      socketRef.current.off("draw", handleDraw);
      socketRef.current.off("clear", clearCanvas);
    };
  }, [socketRef, color]);

  // Listen for changes in color
  useEffect(() => {
    // Set the stroke color whenever the color changes
    contextRef.current.strokeStyle = color;
  }, [color]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socketRef.current.emit("draw", {
      offsetX,
      offsetY,
      isDrawing: true,
      tool,
      color,
      roomid,
    });
  };

  const endDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    socketRef.current.emit("draw", { isDrawing: false, roomid });
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    socketRef.current.emit("draw", {
      offsetX,
      offsetY,
      isDrawing: true,
      tool,
      color,
      roomid,
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleClear = () => {
    clearCanvas();
    socketRef.current.emit("clear", { roomid });
  };

  return (
    <div className="w-full h-[70vh]">
      <div className="controls">
        <button onClick={() => setTool("pencil")}>Pencil</button>
        <button onClick={() => setTool("eraser")}>Eraser</button>
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          value={color}
        />
        <button
          onClick={handleClear}
          className="mb-2 p-2 bg-red-500 text-white rounded"
        >
          Clear Board
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        className="border border-black bg-white w-full h-[64vh]"
      />
    </div>
  );
}

export default WhiteBoard;
