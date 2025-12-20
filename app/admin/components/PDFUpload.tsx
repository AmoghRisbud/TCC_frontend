'use client';

import React, { useState, useRef, useEffect } from 'react';

interface PDFUploadProps {
  currentPDF?: string;
  onPDFChange: (pdfUrl: string) => void;
  label?: string;
}

export default function PDFUpload({ 
  currentPDF, 
  onPDFChange,
  label = 'PDF Document'
}: PDFUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>(currentPDF || '');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Generate unique ID for this instance
  const uniqueId = useRef(`pdf-upload-${Math.random().toString(36).substring(7)}`).current;
  
  // Sync pdfUrl with currentPDF prop changes
  useEffect(() => {
    setPdfUrl(currentPDF || '');
  }, [currentPDF]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    // Validate file size (max 10MB for PDFs)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setPdfUrl(data.url);
      onPDFChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload PDF');
      setPdfUrl(currentPDF || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPdfUrl('');
    onPDFChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="flex items-start gap-4">
        {/* PDF Preview/Info */}
        {pdfUrl && (
          <div className="relative flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
            <svg className="w-8 h-8 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{pdfUrl.split('/').pop()}</p>
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                View PDF
              </a>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="flex-shrink-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              title="Remove PDF"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id={uniqueId}
          />
          <label
            htmlFor={uniqueId}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {pdfUrl ? 'Change PDF' : 'Upload PDF'}
              </>
            )}
          </label>
          <p className="mt-1 text-xs text-gray-500">
            PDF files only (max 10MB)
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Manual URL Input (fallback) */}
      <details className="mt-2">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
          Or enter PDF URL manually
        </summary>
        <input
          type="text"
          value={pdfUrl}
          onChange={(e) => {
            setPdfUrl(e.target.value);
            onPDFChange(e.target.value);
          }}
          placeholder="/research/document.pdf"
          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded text-sm"
        />
      </details>
    </div>
  );
}
