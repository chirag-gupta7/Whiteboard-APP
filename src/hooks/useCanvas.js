import { useRef, useEffect } from 'react';

export const useCanvas = () => {
  const canvasRef = useRef(null);

  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext('2d') : null;
  };

  const clearCanvas = () => {
    const ctx = getContext();
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const resizeCanvas = (width, height) => {
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
  };

  const getCanvasData = () => {
    return canvasRef.current ? canvasRef.current.toDataURL() : null;
  };

  const loadCanvasData = (dataURL) => {
    const ctx = getContext();
    if (ctx && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = dataURL;
    }
  };

  return {
    canvasRef,
    getContext,
    clearCanvas,
    resizeCanvas,
    getCanvasData,
    loadCanvasData
  };
};