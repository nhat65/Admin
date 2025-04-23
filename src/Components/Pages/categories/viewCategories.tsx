import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { IoMdArrowDropdownCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../../types/category';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../service/apiService';

interface Props {}

const ViewCategories: React.FC<Props> = () => {
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const initialCategories: Category[] = [];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 8; // Adjust this number as needed

  // Loading states
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null); // Track which category is being deleted
  const [loadingNavigate, setLoadingNavigate] = useState<'add' | 'edit' | null>(
    null
  ); // Track navigation type

  const navigate = useNavigate();

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

  const navigateSaveCategory = () => {
    setLoadingNavigate('add'); // Set loading state for add navigation
    navigate('/categories/addCategory'); // Navigate immediately
    setLoadingNavigate(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  const handleEdit = (categoryId: string) => {
    setLoadingNavigate('edit'); // Set loading state for edit navigation
    navigate(`/categories/editCategory/${categoryId}`); // Navigate immediately
    setLoadingNavigate(null); // Clear loading state (though this may not be noticeable due to navigation)
  };
  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setLoadingDelete(categoryId);
      try {
        await axios.delete(`${API_ENDPOINTS.DELETE_CATEGORY}/${categoryId}`);
        const updatedCategories = categories.filter(
          (category) => category.id !== categoryId
        );
        setCategories(updatedCategories);
        const totalPages = Math.ceil(
          updatedCategories.length / categoriesPerPage
        );
        if (currentPage > totalPages) {
          setCurrentPage(totalPages || 1);
        }
        alert('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      } finally {
        setLoadingDelete(null);
      }
    }
  };
  const handleReset = () => {
    setSearchName('');
    setSearchId('');
    setCategories(initialCategories);
    setCurrentPage(1); // Reset to first page
  };
  const handleSearch = async () => {
    setLoadingSearch(true);
    try {
      const response = await axios.get<Category[]>(
        API_ENDPOINTS.SEARCH_CATEGORY,
        {
          params: {
            categoryName: searchName,
          },
        }
      );
      setCategories(response.data);
      setCurrentPage(1); // Reset to first page after search
    } catch (error) {
      console.error('Error searching category:', error);
      alert('Failed to search categories. Please try again.');
    } finally {
      setLoadingSearch(false);
    }
  };

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-50">
      <div>
        <div className="grid grid-cols-1 gap-6">
          <div className="h-auto w-full rounded-lg bg-white p-4 shadow-sm">
            <div className="flex w-full">
              <div className="w-full pb-3 font-bold">Search Categories</div>
              <div className="right-0 top-0">
                <button className="text-2xl text-gray-400">
                  <IoMdArrowDropdownCircle />
                </button>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-x-5 border-t-2">
              <div className="my-2">
                <label htmlFor="categoryName" className="">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="mt-2 inline-block h-11 w-full rounded-xl border-2 pl-3 align-middle focus:border-gray-400 focus:shadow-md focus:outline-none"
                  placeholder="Enter category name"
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
                onClick={navigateSaveCategory}
                className={`my-4 flex items-center justify-center rounded-3xl px-9 py-1 text-white ${
                  loadingNavigate === 'add'
                    ? 'cursor-not-allowed bg-green-400'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={loadingNavigate !== null} // Disable button during navigation
              >
                {loadingNavigate === 'add' ? (
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
                  '+ Add Category'
                )}
              </button>
            </div>

            <div className="my-6 text-xl">
              <label htmlFor="text">
                ({categories.length}) Categories Found
              </label>
            </div>

            <div className="w-full">
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-[50px] border border-gray-300 px-4 py-2 text-left">
                      S.No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Category ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Category Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Description
                    </th>
                    <th className="w-[120px] border border-gray-300 px-4 py-2 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.map((category, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {indexOfFirstCategory + index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        #{category.id?.slice(0, 8)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {category.categoryName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {category.description}
                      </td>
                      <td className="flex space-x-2 border border-gray-300 px-6 py-8">
                        <button
                          onClick={() => handleDelete(category.id!)}
                          className={`flex items-center justify-center rounded-full p-2 ${
                            loadingDelete === category.id
                              ? 'cursor-not-allowed bg-gray-300'
                              : 'bg-gray-100 hover:bg-red-200'
                          }`}
                          disabled={loadingDelete !== null} // Disable button during deletion
                        >
                          {loadingDelete === category.id ? (
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
                          onClick={() => handleEdit(category.id!)}
                          className={`flex items-center justify-center rounded-full p-2 ${
                            loadingNavigate === 'edit'
                              ? 'cursor-not-allowed bg-gray-300'
                              : 'bg-gray-100 hover:bg-blue-200'
                          }`}
                          disabled={loadingNavigate !== null} // Disable button during navigation
                        >
                          {loadingNavigate === 'edit' ? (
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
                  Showing {indexOfFirstCategory + 1} to{' '}
                  {Math.min(indexOfLastCategory, categories.length)} of{' '}
                  {categories.length} categories
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

export default ViewCategories;
