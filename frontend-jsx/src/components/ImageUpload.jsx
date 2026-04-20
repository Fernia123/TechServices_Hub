import { useState, useRef } from 'react';

export function ImageUpload({ onChange, disabled, existingImageUrl }) {
  const [preview, setPreview] = useState(existingImageUrl || null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    onChange(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(existingImageUrl || null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">Imagen del Servicio</label>
      <div className="flex items-center gap-5">
        <div className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 ${preview ? 'border-blue-500' : 'border-dashed border-gray-300'} flex items-center justify-center bg-gray-50`}>
          {preview ? (
            <>
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-transform hover:scale-110 shadow-sm"
                >
                  <span className="block w-3 h-3 text-[10px] leading-3">✕</span>
                </button>
              )}
            </>
          ) : (
            <span className="text-2xl text-gray-300">🖼️</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
          >
            <span>⬆️</span> {preview ? 'Cambiar imagen' : 'Seleccionar archivo'}
          </button>
        </div>
      </div>
    </div>
  );
}