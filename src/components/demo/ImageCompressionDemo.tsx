import React, { useState } from 'react';
import { 
  compressImage, 
  COMPRESSION_PRESETS, 
  formatFileSize,
  getBase64SizeInKB,
  isImageSizeSuitable,
  CompressionResult 
} from '@/src/utils/imageCompressor';

const ImageCompressionDemo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [compressedImage, setCompressedImage] = useState<string>('');
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsCompressing(true);

    // Create original preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Compress the image
      const result = await compressImage(file, COMPRESSION_PRESETS.PROFILE);
      setCompressedImage(result.compressedImage);
      setCompressionResult(result);
    } catch (error) {
      console.error('Compression failed:', error);
      alert('Failed to compress image');
    } finally {
      setIsCompressing(false);
    }
  };

  const resetDemo = () => {
    setSelectedFile(null);
    setOriginalPreview('');
    setCompressedImage('');
    setCompressionResult(null);
    setIsCompressing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Image Compression Demo</h2>
        <p className="text-gray-600">
          Compress images for Firestore storage (target: under 50KB)
        </p>
      </div>

      {/* File Input */}
      <div className="text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {selectedFile && (
          <button
            onClick={resetDemo}
            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        )}
      </div>

      {isCompressing && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Compressing image...</p>
        </div>
      )}

      {/* Comparison */}
      {originalPreview && compressedImage && compressionResult && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Original Image</h3>
            <div className="border rounded-lg overflow-hidden">
              <img
                src={originalPreview}
                alt="Original"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>Size:</strong> {formatFileSize(compressionResult.originalSize)}</p>
              <p><strong>Suitable for Firestore:</strong> 
                <span className="text-red-600 ml-1">
                  {isImageSizeSuitable(originalPreview) ? '✓ Yes' : '✗ No (too large)'}
                </span>
              </p>
            </div>
          </div>

          {/* Compressed */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Compressed Image</h3>
            <div className="border rounded-lg overflow-hidden">
              <img
                src={compressedImage}
                alt="Compressed"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p><strong>Size:</strong> {formatFileSize(compressionResult.compressedSize)}</p>
              <p><strong>Size in KB:</strong> {getBase64SizeInKB(compressedImage).toFixed(2)} KB</p>
              <p><strong>Compression:</strong> {compressionResult.compressionRatio.toFixed(1)}% smaller</p>
              <p><strong>Suitable for Firestore:</strong> 
                <span className="text-green-600 ml-1">
                  {isImageSizeSuitable(compressedImage) ? '✓ Yes' : '✗ No (still too large)'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Compression Presets Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Available Compression Presets:</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>FIRESTORE:</strong> 200x200px, 50% quality, max 30KB
          </div>
          <div>
            <strong>THUMBNAIL:</strong> 150x150px, 60% quality, max 20KB
          </div>
          <div>
            <strong>PROFILE:</strong> 300x300px, 70% quality, max 50KB
          </div>
          <div>
            <strong>SMALL:</strong> 400x400px, 80% quality, max 80KB
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressionDemo;