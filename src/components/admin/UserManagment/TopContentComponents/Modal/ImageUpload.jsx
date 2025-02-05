// ImageUpload.jsx
import React from 'react';

const ImageUpload = ({ handleImageChange, image }) => (
  <div className="py-2">
    <label className="block text-sm font-medium text-gray-700">Sube la imagen de la incidencia</label>
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
    />
    {image && (
      <div className="mt-4 flex flex-col justify-center">
        <p className="text-sm text-gray-600">Imagen seleccionada:</p>
        <img src={image} alt="Preview" className="mt-2 mx-auto w-60 h-60 object-cover rounded-lg" />
      </div>
    )}
  </div>
);

export default ImageUpload;
