import { useState, useRef } from 'react';

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  existingImageUrl?: string;
}

export function ImageUpload({ onChange, disabled, existingImageUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    onChange(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
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
        <div className={`relative w-28 h-28 rounded-xl border-2 ${preview ? 'border-blue-200' : 'border-dashed border-gray-300 bg-gray-50'} flex items-center justify-center overflow-hidden shrink-0`}>
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
          <p className="text-[11px] text-gray-400 italic">Formatos: PNG, JPG (Máx. 5MB)</p>
        </div>
      </div>
    </div>
  );
}