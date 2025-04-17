import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { IoMdArrowDropdownCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { ProductInfo } from '../../../types/productInfo';
import { Category } from '../../../types/category';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../service/apiService';

interface Props {}

const ViewProducts: React.FC<Props> = () => {
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const initialProducts: ProductInfo[] = [];
  const [categories, setCategories] = useState<Category[]>([]);
  const initialCategories: Category[] = [];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Loading states
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null); // Track which product is being deleted
  const [loadingNavigate, setLoadingNavigate] = useState(false);

  const navigate = useNavigate();
  // Fetch products data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductInfo[]>(
          API_ENDPOINTS.GET_PRODUCT_INFO
        );
        setProducts(response.data); // Set fetched users
        initialProducts.push(...response.data); // Store initial users for reset
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories data from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>(
          API_ENDPOINTS.GET_CATEGORIES
        );
        setCategories(response.data); // Set fetched users
        initialCategories.push(...response.data); // Store initial users for reset
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchCategories();
  }, []);

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

      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
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

    const filteredProducts = initialProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchName.toLowerCase()) &&
        product.id?.toLowerCase().includes(searchId.toLowerCase())
    );
    setProducts(filteredProducts);
    setCurrentPage(1); // Reset to first page after search
    setLoadingSearch(false); // End loading
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-50">
      <div>
        <div className="grid grid-cols-1 gap-6">
          <div className="h-auto w-full rounded-lg bg-white p-4 shadow-sm">
            <div className="flex w-full">
              <div className="w-full pb-3 font-bold">Search Products</div>
              <div className="right-0 top-0">
                <button className="text-2xl text-gray-400">
                  <IoMdArrowDropdownCircle />
                </button>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-x-5 border-t-2">
              <div className="my-2">
                <label htmlFor="productName" className="">
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="mt-2 inline-block h-11 w-full rounded-xl border-2 pl-3 align-middle focus:border-gray-400 focus:shadow-md focus:outline-none"
                  placeholder="Enter product name"
                  disabled={loadingSearch} // Disable input during search
                />
              </div>
              <div className="my-2">
                <label htmlFor="productId" className="">
                  Product ID
                </label>
                <input
                  type="text"
                  id="productId"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                  placeholder="Enter product ID"
                  disabled={loadingSearch} // Disable input during search
                />
              </div>
            </div>

            <div className="flex w-full border-t-2">
              <div className="mt-3 flex w-full justify-end">
                <button
                  onClick={handleReset}
                  className="rounded-3xl border border-green-500 px-9 py-1 text-green-500"
                  disabled={loadingSearch} // Disable button during search
                >
                  Reset
                </button>
                <button
                  onClick={handleSearch}
                  className={`mx-3 flex items-center justify-center rounded-3xl px-9 py-1 text-white ${
                    loadingSearch
                      ? 'cursor-not-allowed bg-green-400'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                  disabled={loadingSearch} // Disable button during search
                >
                  {loadingSearch ? (
                    <>
                      <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
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

          <div className="h-auto w-full rounded-lg bg-white p-4 shadow-sm">
            <div className="border-b-2">
              <button
                onClick={navigateSaveProduct}
                className={`my-4 flex items-center justify-center rounded-3xl px-9 py-1 text-white ${
                  loadingNavigate
                    ? 'cursor-not-allowed bg-green-400'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={loadingNavigate} // Disable button during navigation
              >
                {loadingNavigate ? (
                  <>
                    <svg
                      className="mr-2 h-5 w-5 animate-spin text-white"
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
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-[50px] border border-gray-300 px-4 py-2 text-left">
                      S.No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Product ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Product Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Price
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Category
                    </th>
                    <th className="w-[120px] border border-gray-300 px-4 py-2 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {indexOfFirstProduct + index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        #{product.id?.slice(0, 8)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {product.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {product.price.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {product.quantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {categories.find((cat) => cat.id === product.categoryId)
                          ?.categoryName ?? 'Unknown'}
                      </td>
                      <td className="flex space-x-2 border border-gray-300 px-6 py-2">
                        <button
                          onClick={() => handleDelete(product.id!)}
                          className={`flex items-center justify-center rounded-full p-2 ${
                            loadingDelete === product.id
                              ? 'cursor-not-allowed bg-gray-300'
                              : 'bg-gray-100 hover:bg-red-200'
                          }`}
                          disabled={loadingDelete === product.id} // Disable button during deletion
                        >
                          {loadingDelete === product.id ? (
                            <svg
                              className="h-5 w-5 animate-spin text-gray-500"
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
                          onClick={() => handleEdit(product.id!)}
                          className={`flex items-center justify-center rounded-full p-2 ${
                            loadingNavigate
                              ? 'cursor-not-allowed bg-gray-300'
                              : 'bg-gray-100 hover:bg-blue-200'
                          }`}
                          disabled={loadingNavigate} // Disable button during navigation
                        >
                          {loadingNavigate ? (
                            <svg
                              className="h-5 w-5 animate-spin text-gray-500"
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
              <div className="mt-4 flex items-center justify-between">
                <div>
                  Showing {indexOfFirstProduct + 1} to{' '}
                  {Math.min(indexOfLastProduct, products.length)} of{' '}
                  {products.length} products
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-md border px-3 py-1 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`rounded-md border px-3 py-1 ${
                          currentPage === page
                            ? 'bg-green-500 text-white'
                            : 'bg-white'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-md border px-3 py-1 disabled:opacity-50"
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
