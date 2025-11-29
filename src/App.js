import React, { useState } from 'react';
import Canvas from './components/Canvas';
import ToolPalette from './components/ToolPalette';
import ColorPalette from './components/ColorPalette';
import TopBar from './components/TopBar';
import './App.css';

function App() {
  const [currentTool, setCurrentTool] = useState('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [showGrid, setShowGrid] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [layers, setLayers] = useState([{ id: 0, name: 'Layer 1', visible: true }]);

  return (
    <div className="app">
      <TopBar 
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        layers={layers}
        setLayers={setLayers}
        currentLayer={currentLayer}
        setCurrentLayer={setCurrentLayer}
      />
      <ColorPalette 
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
      />
      <div className="main-content">
        <ToolPalette 
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
        />
        <Canvas 
          currentTool={currentTool}
          brushSize={brushSize}
          currentColor={currentColor}
          showGrid={showGrid}
          currentLayer={currentLayer}
          layers={layers}
        />
      </div>
    </div>
  );
}

export default App;