# Whiteboard App

A feature-rich canvas-based drawing application built with React and HTML5 Canvas API.

## Demo

https://github.com/chirag-gupta7/Whiteboard-APP/assets/Demo.mp4

[📹 Watch Demo Video](./Demo.mp4)

## Features

### Drawing Tools
- **Freehand Drawing**: Natural brush strokes with mouse or touch support
- **Eraser**: Remove parts of your drawing
- **Shapes**: Draw rectangles, circles, and lines
- **Text Tool**: Add text with customizable size and color

### Customization
- **Brush Size**: Adjustable from 1-50px with intuitive slider
- **Color Picker**: 20 predefined colors plus custom color picker
- **Grid Toggle**: Optional grid overlay for precise drawing

### Canvas Operations
- **Undo/Redo**: Up to 20 steps of history (Ctrl+Z / Ctrl+Y)
- **Clear Canvas**: Start fresh with confirmation dialog
- **Save Drawing**: Export as PNG file (Ctrl+S)
- **Load Background**: Import images as background (Ctrl+O)

### Layer Support
- **Multiple Layers**: Create and manage separate drawing layers
- **Layer Visibility**: Toggle layers on/off
- **Layer Management**: Add/remove layers with intuitive controls

### User Interface
- **Minimal Design**: Maximizes canvas space
- **Tool Palette**: Left sidebar with all drawing tools
- **Color Palette**: Top bar with color selection
- **Responsive**: Works on desktop, tablet, and mobile devices

## Installation

1. Navigate to the project directory:
   ```powershell
   cd "Whiteboard App"
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Basic Drawing
1. Select a tool from the left sidebar (brush, eraser, shapes, or text)
2. Choose a color from the top color palette
3. Adjust brush size using the slider in the tool palette
4. Click and drag on the canvas to draw

### Keyboard Shortcuts
- **Ctrl+Z**: Undo last action
- **Ctrl+Y** or **Ctrl+Shift+Z**: Redo last undone action
- **Ctrl+S**: Save drawing as PNG
- **Ctrl+O**: Load image as background
- **Enter**: Confirm text input (text tool)
- **Escape**: Cancel text input (text tool)

### Tools Guide

#### Brush Tool 🖌️
- Click and drag to draw freehand strokes
- Adjust size for different line weights
- Supports smooth curves and natural drawing

#### Eraser Tool 🧽
- Click and drag to erase parts of the drawing
- Size adjustable like the brush
- Completely removes pixels (not just covers with white)

#### Shape Tools
- **Line 📏**: Click and drag to draw straight lines
- **Rectangle ▭**: Click and drag to draw rectangles
- **Circle ○**: Click and drag to draw circles from center

#### Text Tool T
- Click anywhere on canvas to place text
- Type your message and press Enter to confirm
- Text size scales with brush size setting
- Press Escape to cancel text input

### Layer Management
- Use the layer dropdown in the top bar to switch between layers
- Click ➕ to add a new layer
- Click ➖ to remove the current layer (minimum 1 layer required)
- Click 👁️/🚫 to toggle layer visibility

### Grid Feature
- Toggle the grid overlay using the checkbox in the top bar
- 20px grid spacing helps with precise alignment
- Grid doesn't affect the saved image

## Technical Details

### Architecture
- **React 18**: Modern React with hooks and functional components
- **Canvas API**: Direct HTML5 Canvas manipulation for optimal performance
- **Custom Hooks**: Modular code with reusable hooks for history and canvas operations
- **Component-Based**: Clean separation of concerns with dedicated components

### Components
- `App.js`: Main application state and component orchestration
- `Canvas.js`: Core drawing canvas with event handling
- `ToolPalette.js`: Left sidebar with tools and controls
- `ColorPalette.js`: Top color selection bar
- `TopBar.js`: Application header with save/load and layer controls

### Performance Features
- **Efficient Rendering**: Only redraws necessary canvas areas
- **Memory Management**: Automatic cleanup of canvas states
- **Touch Support**: Full mobile and tablet compatibility
- **Responsive Design**: Adapts to different screen sizes

## Browser Compatibility

- Chrome 60+ ✅
- Firefox 55+ ✅
- Safari 12+ ✅
- Edge 79+ ✅

## Development

### Project Structure
```
src/
├── components/
│   ├── Canvas.js          # Main drawing canvas
│   ├── ColorPalette.js    # Color selection component
│   ├── ToolPalette.js     # Tool selection sidebar
│   └── TopBar.js          # Header with controls
├── hooks/
│   ├── useCanvas.js       # Canvas utility hook
│   └── useHistory.js      # Undo/redo functionality
├── App.js                 # Main application component
├── App.css                # Application styles
└── index.js               # Application entry point
```

### Build for Production
```powershell
npm run build
```

This creates an optimized production build in the `build` folder.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with Create React App
- Icons from Unicode emoji set
- Inspired by modern drawing applications

---

**Enjoy creating with Whiteboard App!** 🎨