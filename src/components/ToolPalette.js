import React from 'react';

const ToolPalette = ({ currentTool, setCurrentTool, brushSize, setBrushSize }) => {
  const tools = [
    { id: 'brush', icon: '🖌️', title: 'Brush' },
    { id: 'eraser', icon: '🧽', title: 'Eraser' },
    { id: 'line', icon: '📏', title: 'Line' },
    { id: 'rectangle', icon: '▭', title: 'Rectangle' },
    { id: 'circle', icon: '○', title: 'Circle' },
    { id: 'text', icon: 'T', title: 'Text' }
  ];

  const handleClear = () => {
    if (window.canvasActions && window.canvasActions.clear) {
      if (window.confirm('Are you sure you want to clear the canvas?')) {
        window.canvasActions.clear();
      }
    }
  };

  const handleUndo = () => {
    if (window.canvasActions && window.canvasActions.undo) {
      window.canvasActions.undo();
    }
  };

  const handleRedo = () => {
    if (window.canvasActions && window.canvasActions.redo) {
      window.canvasActions.redo();
    }
  };

  return (
    <div className="tool-palette">
      {tools.map(tool => (
        <button
          key={tool.id}
          className={`tool-button ${currentTool === tool.id ? 'active' : ''}`}
          onClick={() => setCurrentTool(tool.id)}
          title={tool.title}
        >
          {tool.icon}
        </button>
      ))}
      
      <div className="tool-separator" style={{ 
        height: '2px', 
        backgroundColor: '#555', 
        margin: '10px 0',
        width: '100%'
      }} />
      
      <button
        className="tool-button"
        onClick={handleUndo}
        title="Undo (Ctrl+Z)"
      >
        ↶
      </button>
      
      <button
        className="tool-button"
        onClick={handleRedo}
        title="Redo (Ctrl+Y)"
      >
        ↷
      </button>
      
      <button
        className="tool-button"
        onClick={handleClear}
        title="Clear Canvas"
        style={{ backgroundColor: '#d32f2f' }}
      >
        🗑️
      </button>

      <div className="size-slider-container">
        <label className="size-value">{brushSize}px</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="size-slider"
          title="Brush Size"
        />
      </div>
    </div>
  );
};

export default ToolPalette;