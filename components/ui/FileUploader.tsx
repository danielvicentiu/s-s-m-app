'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';

interface FileWithPreview extends File {
  preview?: string;
  progress?: number;
  error?: string;
}

interface FileUploaderProps {
  accept?: string;
  maxSize?: number; // în bytes
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<void>;
  disabled?: boolean;
}

export function FileUploader({
  accept = '*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  onUpload,
  disabled = false,
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Validare dimensiune
    if (file.size > maxSize) {
      return `Fișierul depășește dimensiunea maximă de ${formatFileSize(maxSize)}`;
    }

    // Validare tip
    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map((type) => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const fileMimeType = file.type;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith('/*')) {
          const mimeCategory = type.split('/')[0];
          return fileMimeType.startsWith(mimeCategory);
        }
        return fileMimeType === type;
      });

      if (!isAccepted) {
        return `Tip de fișier neacceptat. Tipuri permise: ${accept}`;
      }
    }

    return null;
  };

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles || disabled) return;

      const fileArray = Array.from(newFiles);
      const validatedFiles: FileWithPreview[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        const fileWithPreview = Object.assign(file, {
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
          progress: 0,
          error: error || undefined,
        });
        validatedFiles.push(fileWithPreview);
      });

      if (multiple) {
        setFiles((prev) => [...prev, ...validatedFiles]);
      } else {
        // Cleanup previous preview URLs
        files.forEach((file) => {
          if (file.preview) URL.revokeObjectURL(file.preview);
        });
        setFiles(validatedFiles);
      }
    },
    [files, multiple, accept, maxSize, disabled]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleBrowseClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return newFiles;
    });
  };

  const handleUpload = async () => {
    const validFiles = files.filter((file) => !file.error);
    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      await onUpload(validFiles);

      // Cleanup și reset după upload reușit
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      setFiles([]);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Cleanup on unmount
  useState(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  });

  return (
    <div className="w-full">
      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`
          relative border-2 border-dashed rounded-2xl p-8
          transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload
            className={`w-12 h-12 mb-4 ${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }`}
          />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isDragging ? 'Eliberează pentru a încărca' : 'Trage și plasează fișierele aici'}
          </p>
          <p className="text-xs text-gray-500">
            sau click pentru a selecta
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {accept !== '*' && `Tipuri acceptate: ${accept} • `}
            Dimensiune maximă: {formatFileSize(maxSize)}
            {multiple && ' • Multiple fișiere permise'}
          </p>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 p-3 rounded-lg border
                ${file.error ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}
              `}
            >
              {/* Preview sau Icon */}
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                  <File className="w-5 h-5 text-gray-500" />
                </div>
              )}

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>

                {/* Error Message */}
                {file.error && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{file.error}</span>
                  </div>
                )}

                {/* Progress Bar */}
                {file.progress !== undefined && file.progress > 0 && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFile(index)}
                disabled={isUploading}
                className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={
            isUploading ||
            disabled ||
            files.every((file) => file.error) ||
            files.length === 0
          }
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors font-medium text-sm"
        >
          {isUploading
            ? 'Se încarcă...'
            : `Încarcă ${files.filter((f) => !f.error).length} fișier${
                files.filter((f) => !f.error).length !== 1 ? 'e' : ''
              }`}
        </button>
      )}
    </div>
  );
}
