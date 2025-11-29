import React, { useRef } from 'react';

const TopBar = ({ 
  showGrid, 
  setShowGrid, 
  layers, 
  setLayers, 
  currentLayer, 
  setCurrentLayer 
}) => {
  const fileInputRef = useRef(null);

  const handleSave = () => {
    if (window.canvasActions && window.canvasActions.export) {
      window.canvasActions.export();
    }
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (window.canvasActions && window.canvasActions.loadImage) {
        window.canvasActions.loadImage(file);
      }
    }
    // Reset the input value so the same file can be loaded again
    e.target.value = '';
  };

  const addLayer = () => {
    const newLayer = {
      id: layers.length,
      name: `Layer ${layers.length + 1}`,
      visible: true
    };
    setLayers([...layers, newLayer]);
    setCurrentLayer(newLayer.id);
  };

  const removeLayer = () => {
    if (layers.length > 1) {
      const newLayers = layers.filter(layer => layer.id !== currentLayer);
      setLayers(newLayers);
      setCurrentLayer(newLayers[0]?.id || 0);
    }
  };

  const toggleLayerVisibility = (layerId) => {
    setLayers(layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ));
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              if (window.canvasActions && window.canvasActions.redo) {
                window.canvasActions.redo();
              }
            } else {
              if (window.canvasActions && window.canvasActions.undo) {
                window.canvasActions.undo();
              }
            }
            break;
          case 'y':
            e.preventDefault();
            if (window.canvasActions && window.canvasActions.redo) {
              window.canvasActions.redo();
            }
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'o':
            e.preventDefault();
            handleLoad();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="top-bar">
      <div className="top-bar-section">
        <div className="app-title">Whiteboard App</div>
      </div>
      
      <div className="top-bar-section">
        <button 
          className="top-bar-button"
          onClick={handleSave}
          title="Save as PNG (Ctrl+S)"
        >
          💾 Save
        </button>
        
        <button 
          className="top-bar-button"
          onClick={handleLoad}
          title="Load Image (Ctrl+O)"
        >
          📁 Load
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <div className="grid-toggle">
          <input
            type="checkbox"
            id="grid-toggle"
            className="grid-checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
          />
          <label htmlFor="grid-toggle">Grid</label>
        </div>
      </div>
      
      <div className="top-bar-section">
        <div className="layer-controls">
          <span style={{ fontSize: '14px' }}>Layers:</span>
          
          <select
            value={currentLayer}
            onChange={(e) => setCurrentLayer(parseInt(e.target.value))}
            className="layer-select"
          >
            {layers.map(layer => (
              <option key={layer.id} value={layer.id}>
                {layer.name} {layer.visible ? '👁️' : '🚫'}
              </option>
            ))}
          </select>
          
          <button
            className="top-bar-button"
            onClick={addLayer}
            title="Add Layer"
            style={{ padding: '5px 10px', fontSize: '12px' }}
          >
            ➕
          </button>
          
          <button
            className="top-bar-button"
            onClick={removeLayer}
            disabled={layers.length <= 1}
            title="Remove Layer"
            style={{ 
              padding: '5px 10px', 
              fontSize: '12px',
              opacity: layers.length <= 1 ? 0.5 : 1
            }}
          >
            ➖
          </button>
          
          <button
            className="top-bar-button"
            onClick={() => toggleLayerVisibility(currentLayer)}
            title="Toggle Layer Visibility"
            style={{ padding: '5px 10px', fontSize: '12px' }}
          >
            {layers.find(l => l.id === currentLayer)?.visible ? '👁️' : '🚫'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;