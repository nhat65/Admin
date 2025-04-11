import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { IoMdArrowDropdownCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import productsData from '../../../data/products';

interface Props {}

const ViewProducts: React.FC<Props> = () => {
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [products, setProducts] = useState(productsData);
  const initialProducts = [...productsData];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  // Loading states
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null); // Track which product is being deleted
  const [loadingNavigate, setLoadingNavigate] = useState(false);

  const navigate = useNavigate();

  const navigateSaveProduct = () => {
    setLoadingNavigate(true);
    // Simulate navigation delay

      navigate('/products/addProduct');
      setLoadingNavigate(false);

  };

  const handleEdit = (productId: string) => {
    setLoadingNavigate(true);
    // Simulate navigation delay

      navigate(`/products/editProduct/${productId}`);
      setLoadingNavigate(false);

  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoadingDelete(productId); // Set loading state for this specific product
      // Simulate API call for deletion

        const updatedProducts = products.filter(product => product.productId !== productId);
        setProducts(updatedProducts);
        // Adjust current page if necessary after deletion
        const totalPages = Math.ceil(updatedProducts.length / productsPerPage);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages || 1);
        }
        setLoadingDelete(null); // Clear loading state

    }
  };

  const handleReset = () => {
    setSearchName('');
    setSearchId('');
    setProducts(initialProducts);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearch = () => {
    setLoadingSearch(true); // Start loading
    // Simulate API call for search

      const filteredProducts = initialProducts.filter(product => 
        product.name.toLowerCase().includes(searchName.toLowerCase()) &&
        product.productId.toLowerCase().includes(searchId.toLowerCase())
      );
      setProducts(filteredProducts);
      setCurrentPage(1); // Reset to first page after search
      setLoadingSearch(false); // End loading

  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-50">
      <div>
        <div className="grid grid-cols-1 gap-6">
          <div className="w-full h-auto p-4 bg-white rounded-lg shadow-sm">
            <div className="flex w-full">
              <div className="w-full pb-3 font-bold">Search Products</div>
              <div className="top-0 right-0">
                <button className="text-2xl text-gray-400">
                  <IoMdArrowDropdownCircle />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 mb-4 border-t-2 gap-x-5">
              <div className="my-2">
                <label htmlFor="productName" className="">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="inline-block w-full pl-3 mt-2 align-middle border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                  placeholder="Enter product name"
                  disabled={loadingSearch} // Disable input during search
                />
              </div>
              <div className="my-2">
                <label htmlFor="productId" className="">Product ID</label>
                <input
                  type="text"
                  id="productId"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                  placeholder="Enter product ID"
                  disabled={loadingSearch} // Disable input during search
                />
              </div>
            </div>

            <div className="flex w-full border-t-2">
              <div className="flex justify-end w-full mt-3">
                <button
                  onClick={handleReset}
                  className="py-1 text-green-500 border border-green-500 rounded-3xl px-9"
                  disabled={loadingSearch} // Disable button during search
                >
                  Reset
                </button>
                <button
                  onClick={handleSearch}
                  className={`py-1 mx-3 text-white rounded-3xl px-9 flex items-center justify-center ${
                    loadingSearch ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                  }`}
                  disabled={loadingSearch} // Disable button during search
                >
                  {loadingSearch ? (
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
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full h-auto p-4 bg-white rounded-lg shadow-sm">
            <div className="border-b-2">
              <button
                onClick={navigateSaveProduct}
                className={`py-1 my-4 text-white rounded-3xl px-9 flex items-center justify-center ${
                  loadingNavigate ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={loadingNavigate} // Disable button during navigation
              >
                {loadingNavigate ? (
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
                    Loading...
                  </>
                ) : (
                  '+ Add Product'
                )}
              </button>
            </div>

            <div className="my-6 text-xl">
              <label htmlFor="text">({products.length}) Products Found</label>
            </div>

            <div className="w-full">
              <table className="w-full border border-collapse border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left border border-gray-300 w-[50px]">S.No</th>
                    <th className="px-4 py-2 text-left border border-gray-300">Product ID</th>
                    <th className="px-4 py-2 text-left border border-gray-300">Product Name</th>
                    <th className="px-4 py-2 text-left border border-gray-300">Price</th>
                    <th className="px-4 py-2 text-left border border-gray-300">Quantity</th>
                    <th className="px-4 py-2 text-left border border-gray-300">Category</th>
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
                      <td className="px-4 py-2 border border-gray-300">{product.category}</td>
                      <td className="flex px-6 py-2 space-x-2 border border-gray-300">
                        <button
                          onClick={() => handleDelete(product.productId)}
                          className={`p-2 rounded-full flex items-center justify-center ${
                            loadingDelete === product.productId ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-red-200'
                          }`}
                          disabled={loadingDelete === product.productId} // Disable button during deletion
                        >
                          {loadingDelete === product.productId ? (
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
                          onClick={() => handleEdit(product.productId)}
                          className={`p-2 rounded-full flex items-center justify-center ${
                            loadingNavigate ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-blue-200'
                          }`}
                          disabled={loadingNavigate} // Disable button during navigation
                        >
                          {loadingNavigate ? (
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
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div>
                  Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, products.length)} of {products.length} products
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border rounded-md ${
                        currentPage === page ? 'bg-green-500 text-white' : 'bg-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;