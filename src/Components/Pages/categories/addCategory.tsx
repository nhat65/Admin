import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AddCategoryProps {}

const AddCategory: React.FC<AddCategoryProps> = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    status: 'Active', // Default status
  });

  // State for loading
  const [loading, setLoading] = useState<'save' | 'cancel' | null>(null);

  // Handler for input changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCancel = () => {
    setLoading('cancel'); // Set loading state for cancel
    navigate('/categories/viewCategories'); // Navigate immediately
    setLoading(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  const handleSave = () => {
    setLoading('save'); // Set loading state for save
    console.log('Saving category:', formData);
    navigate('/categories/viewCategories'); // Navigate immediately
    setLoading(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  return (
    <div>
      <div className="w-full p-4 bg-white rounded-lg shadow-sm">
        <div className="w-full pb-3 border-b-2">
          <label className="font-bold">Add Category</label>
        </div>
        
        <div className="grid w-full grid-cols-2 m-2 gap-x-5">
          <div className="space-y-10">
            <div>
              <label htmlFor="categoryName">Category Name*</label>
              <input
                type="text"
                id="categoryName"
                value={formData.categoryName}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter category name"
                disabled={loading !== null} // Disable input during loading
              />
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <label htmlFor="status">Status*</label>
              <select
                id="status"
                value={formData.status}
                onChange={handleInput}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                disabled={loading !== null} // Disable select during loading
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
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
              placeholder="Enter category description"
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
    </div>
  );
};

export default AddCategory;