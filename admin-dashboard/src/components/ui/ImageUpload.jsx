import React, { useState, useRef } from 'react';
import { 
  PhotoIcon, XMarkIcon, ArrowUpTrayIcon 
} from '@heroicons/react/24/outline';
import { uploadAPI } from '../../services/api';

const ImageUpload = ({ 
  onImageUpload, 
  multiple = false, 
  maxFiles = 5,
  acceptedTypes = ['image/*'],
  maxSize = 5 * 1024 * 1024, // 5MB
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Check file type with wildcard support (e.g., image/*)
      const isTypeAllowed = acceptedTypes.some((t) => {
        if (t === file.type) return true;
        if (t.endsWith('/*')) {
          const prefix = t.slice(0, -1);
          return file.type.startsWith(prefix);
        }
        return false;
      });
      if (!isTypeAllowed) {
        alert(`File type ${file.type} is not supported`);
        return false;
      }
      
      // Check file size
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Check if adding these files would exceed maxFiles
    if (!multiple && validFiles.length > 1) {
      alert('Only one file can be uploaded');
      return;
    }

    if (multiple && uploadedFiles.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);

    try {
      const response = await uploadAPI.uploadProductImages(validFiles);
      const uploaded = response?.data?.data || [];
      const newFiles = uploaded.map((img) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: img.fileName || 'image',
        size: img.size,
        type: img.mimetype,
        url: img.url,
        uploaded: true
      }));

      const next = multiple ? [...uploadedFiles, ...newFiles] : newFiles;
      setUploadedFiles(next);

      if (onImageUpload) {
        onImageUpload(next);
      }
    } catch (err) {
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    
    if (onImageUpload) {
      onImageUpload(updatedFiles);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            <button
              type="button"
              onClick={openFileDialog}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Click to upload
            </button>
            {' '}or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} up to {maxSize / (1024 * 1024)}MB
            {multiple && ` (max ${maxFiles} files)`}
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <ArrowUpTrayIcon className="h-5 w-5 text-blue-600 animate-pulse mr-2" />
            <span className="text-sm text-blue-600">Uploading files...</span>
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <button
                      onClick={() => removeFile(file.id)}
                      className="opacity-0 group-hover:opacity-100 text-white bg-red-500 hover:bg-red-600 rounded-full p-1 transition-all duration-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 