import React, { useState } from 'react';
 
const CLOUD_NAME = 'dfa8be4pm';
const UPLOAD_PRESET = 'Perfume-store';
 
const CloudinaryUpload = ({ onUpload, label = "Upload Image", currentImage = "" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
 
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
 
    setUploading(true);
 
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
 
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
 
      const data = await res.json();
 
      if (data.secure_url) {
        setPreview(data.secure_url);
        onUpload(data.secure_url);
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };
 
  return (
    <div className="flex flex-col gap-3">
      <label className="text-[9px] text-neutral-500 uppercase tracking-widest block">{label}</label>
 
      {/* Preview */}
      {preview && (
        <div className="w-full h-32 bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
 
      {/* Upload Button */}
      <label className={`cursor-pointer flex items-center justify-center gap-2 border border-dashed border-neutral-700 rounded-lg p-3 text-[10px] uppercase tracking-widest transition-colors ${uploading ? 'text-neutral-600' : 'text-neutral-400 hover:border-neutral-500 hover:text-white'}`}>
        {uploading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {preview ? 'Change Image' : 'Upload Image'}
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
 
      {/* Or paste URL */}
      <input
        type="text"
        placeholder="Or paste image URL..."
        className="bg-neutral-900 border border-neutral-800 p-2 rounded-lg outline-none text-xs focus:border-neutral-500 text-white"
        value={preview}
        onChange={(e) => { setPreview(e.target.value); onUpload(e.target.value); }}
      />
    </div>
  );
};
 
export default CloudinaryUpload;
 