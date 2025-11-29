import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useHistory } from '../hooks/useHistory';

const Canvas = ({ 
  currentTool, 
  brushSize, 
  currentColor, 
  showGrid, 
  currentLayer, 
  layers 
}) => {
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  
  const { saveState, undo, redo, canUndo, canRedo, clearHistory } = useHistory();
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (canvas && container) {
      const resizeCanvas = () => {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        if (overlayCanvasRef.current) {
          overlayCanvasRef.current.width = rect.width;
          overlayCanvasRef.current.height = rect.height;
        }
        
        // Redraw grid if enabled
        if (showGrid) {
          drawGrid();
        }
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [showGrid]);

  // Grid drawing function
  const drawGrid = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, []);

  // Update grid when showGrid changes
  useEffect(() => {
    if (showGrid) {
      drawGrid();
    } else if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    }
  }, [showGrid, drawGrid]);

  // Get mouse/touch position
  const getEventPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Text tool functions
  const handleTextClick = (e) => {
    if (currentTool === 'text') {
      const pos = getEventPos(e);
      setTextPosition(pos);
      setIsTyping(true);
      setTextInput('');
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      ctx.font = `${brushSize * 2}px Arial`;
      ctx.fillStyle = currentColor;
      ctx.fillText(textInput, textPosition.x, textPosition.y);
      
      saveState(canvas.toDataURL());
    }
    
    setIsTyping(false);
    setTextInput('');
  };

  const handleTextKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setIsTyping(false);
      setTextInput('');
    }
  };

  // Drawing functions
  const startDrawing = (e) => {
    e.preventDefault();
    
    // Handle text tool
    if (currentTool === 'text') {
      handleTextClick(e);
      return;
    }
    
    const pos = getEventPos(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentPath([pos]);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (currentTool === 'brush' || currentTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const pos = getEventPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    setCurrentPath(prev => [...prev, pos]);

    if (currentTool === 'brush') {
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = currentColor;
      ctx.globalCompositeOperation = 'source-over';
      
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else if (currentTool === 'eraser') {
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'destination-out';
      
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else if (currentTool === 'rectangle' || currentTool === 'circle' || currentTool === 'line') {
      // Clear overlay and redraw shape
      const overlayCtx = overlayCanvasRef.current.getContext('2d');
      overlayCtx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
      
      overlayCtx.strokeStyle = currentColor;
      overlayCtx.lineWidth = brushSize;
      
      if (currentTool === 'rectangle') {
        const width = pos.x - startPos.x;
        const height = pos.y - startPos.y;
        overlayCtx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (currentTool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
        overlayCtx.beginPath();
        overlayCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        overlayCtx.stroke();
      } else if (currentTool === 'line') {
        overlayCtx.beginPath();
        overlayCtx.moveTo(startPos.x, startPos.y);
        overlayCtx.lineTo(pos.x, pos.y);
        overlayCtx.stroke();
      }
      
      // Redraw grid if enabled
      if (showGrid) {
        drawGrid();
      }
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    setIsDrawing(false);
    
    const pos = getEventPos(e);
    const canvas = canvasRef.current;
    const mainCtx = canvas.getContext('2d');
    
    // For shapes, draw them on the main canvas
    if (currentTool === 'rectangle' || currentTool === 'circle' || currentTool === 'line') {
      mainCtx.strokeStyle = currentColor;
      mainCtx.lineWidth = brushSize;
      mainCtx.globalCompositeOperation = 'source-over';
      
      if (currentTool === 'rectangle') {
        const width = pos.x - startPos.x;
        const height = pos.y - startPos.y;
        mainCtx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (currentTool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
        mainCtx.beginPath();
        mainCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        mainCtx.stroke();
      } else if (currentTool === 'line') {
        mainCtx.beginPath();
        mainCtx.moveTo(startPos.x, startPos.y);
        mainCtx.lineTo(pos.x, pos.y);
        mainCtx.stroke();
      }
      
      // Clear overlay
      const overlayCtx = overlayCanvasRef.current.getContext('2d');
      overlayCtx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
      
      // Redraw grid if enabled
      if (showGrid) {
        drawGrid();
      }
    }
    
    // Save state for undo/redo
    saveState(canvas.toDataURL());
    setCurrentPath([]);
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState(canvas.toDataURL());
  };

  // Export canvas
  const exportCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Load image
  const loadImage = (file) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      saveState(canvas.toDataURL());
    };
    
    img.src = URL.createObjectURL(file);
  };

  // Expose functions to parent component
  useEffect(() => {
    window.canvasActions = {
      clear: clearCanvas,
      export: exportCanvas,
      loadImage: loadImage,
      undo: () => {
        const state = undo();
        if (state) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
          img.src = state;
        }
      },
      redo: () => {
        const state = redo();
        if (state) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
          img.src = state;
        }
      },
      canUndo,
      canRedo
    };
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div className="canvas-container" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          cursor: currentTool === 'eraser' ? 'grab' : currentTool === 'text' ? 'text' : 'crosshair'
        }}
      />
      <canvas
        ref={overlayCanvasRef}
        className="grid-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
      />
      
      {/* Text input overlay */}
      {isTyping && (
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={handleTextKeyDown}
          onBlur={handleTextSubmit}
          autoFocus
          style={{
            position: 'absolute',
            left: textPosition.x,
            top: textPosition.y - brushSize * 2,
            fontSize: `${brushSize * 2}px`,
            color: currentColor,
            backgroundColor: 'transparent',
            border: '2px dashed #007acc',
            outline: 'none',
            fontFamily: 'Arial',
            padding: '2px',
            zIndex: 100
          }}
        />
      )}
    </div>
  );
};

export default Canvas;