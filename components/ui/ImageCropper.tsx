'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
  onSave: (blob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export default function ImageCropper({
  onSave,
  onCancel,
  aspectRatio = 1,
  maxWidth = 400,
  maxHeight = 400,
}: ImageCropperProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cropSize = 300;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const drawCanvas = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = cropSize;
    canvas.height = cropSize;

    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, cropSize, cropSize);

    const imgWidth = image.width * zoom;
    const imgHeight = image.height * zoom;

    ctx.save();
    ctx.translate(cropSize / 2, cropSize / 2);
    ctx.drawImage(
      image,
      -imgWidth / 2 + position.x,
      -imgHeight / 2 + position.y,
      imgWidth,
      imgHeight
    );
    ctx.restore();

    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, cropSize, cropSize);

    // Clear center circle
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw circle border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
    ctx.stroke();
  }, [image, zoom, position]);

  const drawPreview = useCallback(() => {
    if (!image || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previewSize = 100;
    canvas.width = previewSize;
    canvas.height = previewSize;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, previewSize, previewSize);

    const imgWidth = image.width * zoom;
    const imgHeight = image.height * zoom;

    const scale = previewSize / cropSize;

    ctx.save();
    ctx.translate(previewSize / 2, previewSize / 2);
    ctx.beginPath();
    ctx.arc(0, 0, previewSize / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      image,
      (-imgWidth / 2 + position.x) * scale,
      (-imgHeight / 2 + position.y) * scale,
      imgWidth * scale,
      imgHeight * scale
    );
    ctx.restore();
  }, [image, zoom, position]);

  useEffect(() => {
    drawCanvas();
    drawPreview();
  }, [drawCanvas, drawPreview]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleSave = () => {
    if (!image || !canvasRef.current) return;

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = maxWidth;
    outputCanvas.height = maxHeight;
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, maxWidth, maxHeight);

    const imgWidth = image.width * zoom;
    const imgHeight = image.height * zoom;

    const scale = maxWidth / cropSize;

    ctx.save();
    ctx.translate(maxWidth / 2, maxHeight / 2);
    ctx.beginPath();
    ctx.arc(0, 0, maxWidth / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      image,
      (-imgWidth / 2 + position.x) * scale,
      (-imgHeight / 2 + position.y) * scale,
      imgWidth * scale,
      imgHeight * scale
    );
    ctx.restore();

    outputCanvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
      }
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Decupare Imagine Avatar
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!image ? (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Încarcă o imagine pentru avatar
              </p>
              <p className="text-sm text-gray-500">
                Click pentru a selecta un fișier
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div ref={containerRef} className="relative inline-block">
                <canvas
                  ref={canvasRef}
                  width={cropSize}
                  height={cropSize}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`border border-gray-300 rounded-2xl ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  style={{ touchAction: 'none' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleZoomChange(-0.1)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <button
                onClick={() => handleZoomChange(0.1)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Previzualizare
                </p>
                <p className="text-xs text-gray-500">
                  Așa va arăta avatarul tău
                </p>
              </div>
              <div className="rounded-full overflow-hidden border-2 border-gray-200">
                <canvas
                  ref={previewCanvasRef}
                  width={100}
                  height={100}
                  className="block"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Schimbă Imaginea
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Salvează Avatar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
