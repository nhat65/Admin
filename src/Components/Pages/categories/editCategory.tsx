import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import categoriesData from '../../../data/categories';
import productsData from '../../../data/products';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';

interface EditCategoryProps {}

const EditCategory: React.FC<EditCategoryProps> = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Category state
  const initialCategory = categoriesData.find(category => category.categoryId === categoryId) || {
    name: '',
    description: '',
    status: 'Active',
  };
  const [category, setCategory] = useState(initialCategory);

  // Loading states
  const [loading, setLoading] = useState<'save' | 'cancel' | null>(null); // For save and cancel actions
  const [loadingProductAction, setLoadingProductAction] = useState<{ action: 'edit' | 'delete'; productId: string } | null>(null); // For product actions

  // Pagination for products
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const productsPerPage = 5;

  // Filter products for this category
  const categoryProducts = productsData.filter(product => product.category === category.name);

  useEffect(() => {
    setCategory(initialCategory);
  }, [categoryId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleEditProduct = (productId: string) => {
    setLoadingProductAction({ action: 'edit', productId }); // Set loading state for edit
    navigate(`/products/editProduct/${productId}`); // Navigate immediately
    setLoadingProductAction(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  const handleDeleteProduct = (productId: string) => {
    setLoadingProductAction({ action: 'delete', productId }); // Set loading state for delete
    console.log(`Delete product with ID: ${productId}`);
    setLoadingProductAction(null); // Clear loading state
  };

  const handleCancel = () => {
    setLoading('cancel'); // Set loading state for cancel
    navigate('/categories/viewCategories'); // Navigate immediately
    setLoading(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  const handleSave = () => {
    setLoading('save'); // Set loading state for save
    console.log('Saving category:', category);
    navigate('/categories/viewCategories'); // Navigate immediately
    setLoading(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  // Product pagination logic
  const indexOfLastProduct = currentProductPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = categoryProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalProductPages = Math.ceil(categoryProducts.length / productsPerPage);

  const handleProductPageChange = (pageNumber: number) => {
    setCurrentProductPage(pageNumber);
  };

  return (
    <div className="bg-gray-50">
      <div className="grid grid-cols-1 gap-6">
        {/* Part 1: Category Edit/View Section */}
        <div className="w-full h-auto p-4 bg-white rounded-lg shadow-sm">
          <div className="w-full pb-3 border-b-2">
            <label className="font-bold">Edit Category</label>
          </div>
          
          <div className="grid w-full grid-cols-2 m-2 gap-x-5">
            <div className="space-y-10">
              <div>
                <label htmlFor="name">Category Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={category.name}
                  onChange={handleInputChange}
                  className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                  placeholder="Enter category name"
                  disabled={loading !== null} // Disable input during loading
                />
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={category.status}
                  onChange={handleInputChange}
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
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={category.description}
                onChange={handleInputChange}
                className="w-full pl-3 mt-2 border-2 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none min-h-[100px] p-2"
                placeholder="Enter category description"
                disabled={loading !== null} // Disable textarea during loading
              />
            </div>
          </div>

          {/* Cancel and Save Buttons */}
          <div className="flex w-full my-2 border-t-2">
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

        {/* Part 2: Products in Category Section with Pagination */}
        <div className="w-full h-auto p-4 bg-white rounded-lg shadow-sm">
          <div className="w-full pb-3 border-b-2">
            <label className="font-bold">Products in this Category ({categoryProducts.length})</label>
          </div>

          <div className="w-full mt-4">
            <table className="w-full border border-collapse border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left border border-gray-300 w-[50px]">S.No</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Product ID</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Product Name</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Price</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Quantity</th>
                  <th className="px-4 py-2 text-left border border-gray-300 w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-center border border-gray-300">
                      {indexOfFirstProduct + index + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">{product.productId}</td>
                    <td className="px-4 py-2 border border-gray-300">{product.name}</td>
                    <td className="px-4 py-2 border border-gray-300">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-gray-300">{product.quantity}</td>
                    <td className="flex px-4 py-2 space-x-2 border border-gray-300">
                      <button
                        onClick={() => handleDeleteProduct(product.productId)}
                        className={`p-2 rounded-full flex items-center justify-center ${
                          loadingProductAction?.action === 'delete' && loadingProductAction?.productId === product.productId
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-red-200'
                        }`}
                        disabled={loadingProductAction !== null} // Disable button during any product action
                      >
                        {loadingProductAction?.action === 'delete' && loadingProductAction?.productId === product.productId ? (
                          <svg
                            className="w-5 h-5 text-gray-500 animate-spin"
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
                        ) : (
                          <FaTrash className="text-gray-500" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditProduct(product.productId)}
                        className={`p-2 rounded-full flex items-center justify-center ${
                          loadingProductAction?.action === 'edit' && loadingProductAction?.productId === product.productId
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-blue-200'
                        }`}
                        disabled={loadingProductAction !== null} // Disable button during any product action
                      >
                        {loadingProductAction?.action === 'edit' && loadingProductAction?.productId === product.productId ? (
                          <svg
                            className="w-5 h-5 text-gray-500 animate-spin"
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
                        ) : (
                          <FaEdit className="text-gray-500" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
                {categoryProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-2 text-center border border-gray-300">
                      No products found in this category
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Product Pagination Controls */}
            {categoryProducts.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div>
                  Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, categoryProducts.length)} of {categoryProducts.length} products
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleProductPageChange(currentProductPage - 1)}
                    disabled={currentProductPage === 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalProductPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handleProductPageChange(page)}
                      className={`px-3 py-1 border rounded-md ${
                        currentProductPage === page ? 'bg-green-500 text-white' : 'bg-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handleProductPageChange(currentProductPage + 1)}
                    disabled={currentProductPage === totalProductPages}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;