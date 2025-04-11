import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AddProductProps {}

const AddProduct: React.FC<AddProductProps> = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    quantity: '',
    category: '',
    description: '',
    images: '', // Comma-separated string for image URLs
    CpuType: '',
    RamType: '',
    RomType: '',
    ScreenSize: '',
    BatteryCapacity: '',
    DetailsType: '',
    ConnectType: '',
  });

  // State for loading
  const [loading, setLoading] = useState<'save' | 'cancel' | null>(null);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrls, setModalImageUrls] = useState<string[]>(formData.images ? formData.images.split(',').map(url => url.trim()) : []);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Handler for input changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
    // Preload modal with existing images
    setModalImageUrls(formData.images ? formData.images.split(',').map(url => url.trim()).filter(url => url) : []);
  };

  // Close the modal without saving
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImageUrl('');
    setModalImageUrls(formData.images ? formData.images.split(',').map(url => url.trim()).filter(url => url) : []);
  };

  // Add an image URL to the list in the modal
  const addImageUrl = () => {
    if (currentImageUrl.trim()) {
      setModalImageUrls(prev => [...prev, currentImageUrl.trim()]);
      setCurrentImageUrl(''); // Clear the input after adding
    }
  };

  // Remove an image URL from the list in the modal
  const removeImageUrl = (index: number) => {
    setModalImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Save the image URLs and close the modal
  const saveModal = () => {
    setFormData(prev => ({
      ...prev,
      images: modalImageUrls.join(', '), // Join URLs into a comma-separated string
    }));
    setIsModalOpen(false);
    setCurrentImageUrl('');
  };

  const handleCancel = () => {
    setLoading('cancel'); // Set loading state for cancel
    navigate('/products/viewProducts'); // Navigate immediately
    setLoading(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  const handleSave = () => {
    setLoading('save'); // Set loading state for save
    const productData = {
      ...formData,
      images: formData.images.split(',').map(url => url.trim()).filter(url => url), // Convert comma-separated string to array
    };
    console.log('Saving product:', productData);
    navigate('/products/viewProducts'); // Navigate immediately
    setLoading(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  return (
    <div>
      <div className="w-full p-4 bg-white rounded-lg shadow-sm">
        <div className="w-full pb-3 border-b-2">
          <label className="font-bold">Add Product</label>
        </div>
        
        <div className="grid w-full grid-cols-2 m-2 gap-x-5">
          <div className="space-y-10">
            <div>
              <label htmlFor="productName">Product Name*</label>
              <input
                type="text"
                id="productName"
                value={formData.productName}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter product name"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="price">Product Price*</label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter price"
                min="0"
                step="0.01"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="quantity">Quantity*</label>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter quantity"
                min="0"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="category">Category*</label>
              <select
                id="category"
                value={formData.category}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                disabled={loading !== null} // Disable select during loading
              >
                <option value="">--Select Category--</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="food">Food & Beverage</option>
                <option value="furniture">Furniture</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <label htmlFor="CpuType">CPU Type</label>
              <input
                type="text"
                id="CpuType"
                value={formData.CpuType}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter CPU type (e.g., Intel i7, Snapdragon 8)"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="RamType">RAM Type</label>
              <input
                type="text"
                id="RamType"
                value={formData.RamType}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter RAM type (e.g., 8GB DDR4)"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="RomType">ROM Type</label>
              <input
                type="text"
                id="RomType"
                value={formData.RomType}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter ROM type (e.g., 256GB SSD)"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="ScreenSize">Screen Size</label>
              <input
                type="text"
                id="ScreenSize"
                value={formData.ScreenSize}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter screen size (e.g., 15.6 inches)"
                disabled={loading !== null} // Disable input during loading
              />
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 m-2 mt-10 gap-x-5">
          <div className="space-y-10">
            <div>
              <label htmlFor="BatteryCapacity">Battery Capacity</label>
              <input
                type="text"
                id="BatteryCapacity"
                value={formData.BatteryCapacity}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter battery capacity (e.g., 5000mAh)"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="DetailsType">Details Type</label>
              <input
                type="text"
                id="DetailsType"
                value={formData.DetailsType}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter details type (e.g., Technical Specs)"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="ConnectType">Connect Type</label>
              <input
                type="text"
                id="ConnectType"
                value={formData.ConnectType}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter connect type (e.g., USB-C, Wi-Fi)"
                disabled={loading !== null} // Disable input during loading
              />
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <label>Images (Comma-separated URLs)*</label>
              <button
                onClick={openModal}
                className="w-full pl-3 mt-2 text-green-700 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none bg-green-50 hover:bg-green-100"
                disabled={loading !== null} // Disable button during loading
              >
                Add Images
              </button>
              {formData.images && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current Images:</p>
                  <ul className="list-disc list-inside">
                    {formData.images.split(',').map((url, index) => (
                      <li key={index} className="text-sm text-blue-500">
                        <a href={url.trim()} target="_blank" rel="noopener noreferrer">
                          {url.trim()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full p-3 mt-4 bg-gray-100 rounded-xl">
          <div>
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleInput}
              className="w-full pl-3 mt-2 border-2 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none min-h-[100px] p-2"
              placeholder="Enter product description"
              disabled={loading !== null} // Disable textarea during loading
            />
          </div>
        </div>

        <div className="flex w-full my-2 border-t-2">
          <div>*Required</div>
          <div className="flex justify-end w-full mt-3">
            <button
              onClick={handleCancel}
              className={`py-1 text-green-500 border border-green-500 rounded-3xl px-9 flex items-center justify-center ${
                loading === 'cancel' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading !== null} // Disable button during loading
            >
              {loading === 'cancel' ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2 text-green-500 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Cancelling...
                </>
              ) : (
                'Cancel'
              )}
            </button>
            <button
              onClick={handleSave}
              className={`py-1 mx-3 text-white rounded-3xl px-9 flex items-center justify-center ${
                loading === 'save' ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={loading !== null} // Disable button during loading
            >
              {loading === 'save' ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Image Input */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Add Product Images</h2>
            
            {/* Input for adding image URL */}
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={currentImageUrl}
                onChange={(e) => setCurrentImageUrl(e.target.value)}
                className="w-full pl-3 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              />
              <button
                onClick={addImageUrl}
                className="px-4 py-1 ml-2 text-white bg-green-500 rounded-3xl hover:bg-green-600"
                disabled={!currentImageUrl.trim()}
              >
                Add
              </button>
            </div>

            {/* Display added image URLs and images */}
            {modalImageUrls.length > 0 ? (
              <div className="mb-4 overflow-y-auto max-h-64">
                {modalImageUrls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-2 mb-2 border rounded-lg">
                    <div className="flex items-center">
                      <img
                        src={url}
                        alt={`Product Image ${index + 1}`}
                        className="object-cover w-16 h-16 mr-4 rounded"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL')} // Fallback for invalid URLs
                      />
                      <a href={url} target="_blank" rel="noopener noreferrer" className="max-w-xs text-blue-500 truncate">
                        {url}
                      </a>
                    </div>
                    <button
                      onClick={() => removeImageUrl(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-4 text-gray-500">No images added yet.</p>
            )}

            {/* Modal buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-1 text-gray-500 border border-gray-500 rounded-3xl hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveModal}
                className="px-4 py-1 text-white bg-green-500 rounded-3xl hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;