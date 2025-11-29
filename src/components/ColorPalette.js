import React from 'react';

const ColorPalette = ({ currentColor, setCurrentColor }) => {
  const predefinedColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000',
    '#800000', '#808000', '#008080', '#C0C0C0', '#FF69B4'
  ];

  return (
    <div className="color-palette">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontWeight: 'bold', color: '#333' }}>Colors:</span>
        
        {predefinedColors.map(color => (
          <button
            key={color}
            className={`color-button ${currentColor === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => setCurrentColor(color)}
            title={color}
          />
        ))}
        
        <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', color: '#333' }}>Custom:</span>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="custom-color-input"
            title="Custom Color Picker"
          />
        </div>
        
        <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '14px', color: '#333' }}>Current:</span>
          <div
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: currentColor,
              border: '2px solid #333',
              borderRadius: '50%'
            }}
            title={`Current Color: ${currentColor}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;