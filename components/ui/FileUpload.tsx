'use client';

import React, { useRef, useState } from 'react';
import { useObjectUrl } from '@/lib/hooks/useObjectUrl';
import { Upload, X, FileImage, FileVideo, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  aspectRatio?: '1:1' | '9:16' | 'free';
  maxPhotoSizeMB?: number;
  maxVideoSizeMB?: number;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  aspectRatio = 'free',
  maxPhotoSizeMB = 5,
  maxVideoSizeMB = 15,
  label = 'Upload Photo or Video'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const previewUrl = useObjectUrl(selectedFile);

  const handleFile = (file: File) => {
    setError(null);
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      setError('Invalid file type. Please upload a photo (JPEG, PNG, WEBP) or video (MP4).');
      return;
    }

    if (isVideo && file.type !== 'video/mp4') {
      setError('Only MP4 video format is supported.');
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);

    if (isImage && fileSizeMB > maxPhotoSizeMB) {
      setError(`Image exceeds maximum size of ${maxPhotoSizeMB}MB.`);
      return;
    }

    if (isVideo && fileSizeMB > maxVideoSizeMB) {
      setError(`Video exceeds maximum size of ${maxVideoSizeMB}MB.`);
      return;
    }

    setSelectedFile(file);
    onChange(file);

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(null), 800); // clear bar
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    setUploadProgress(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAspectClass = () => {
    if (aspectRatio === '1:1') return 'aspect-square';
    if (aspectRatio === '9:16') return 'aspect-[9/16]';
    return 'aspect-video';
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">
        {label}
      </span>

      <div
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative overflow-hidden w-full ${getAspectClass()} border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
          isDragOver 
            ? 'border-primary bg-primary-soft/40' 
            : selectedFile 
              ? 'border-line bg-bg-alt/30' 
              : 'border-line hover:border-primary hover:bg-bg-alt/25'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/webp,video/mp4"
          className="hidden"
        />

        {previewUrl ? (
          <div className="absolute inset-0 w-full h-full group">
            {selectedFile?.type.startsWith('video/') ? (
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                controls
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Overlay to delete */}
            <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-danger-bg text-danger hover:bg-danger hover:text-white rounded-full transition-colors shadow-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-2 flex flex-col items-center justify-center">
            <div className="p-3 bg-bg-alt rounded-full text-ink-soft">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-ink">
                Drag and drop your file here, or <span className="text-primary font-bold">browse</span>
              </p>
              <p className="text-[10px] text-ink-soft">
                Supports JPG, PNG, WEBP (Max {maxPhotoSizeMB}MB) or MP4 Video (Max {maxVideoSizeMB}MB)
              </p>
            </div>
          </div>
        )}

        {/* Uploading progress bar */}
        {uploadProgress !== null && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-line">
            <div 
              className="h-full bg-primary transition-all duration-100" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-danger font-medium mt-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
