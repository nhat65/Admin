import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { IoMdArrowDropdownCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { UserInfo } from '../../../types/userInfo';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../service/apiService';

interface Props {}

const ViewUsers: React.FC<Props> = () => {
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [users, setUsers] = useState<UserInfo[]>([]);
  const initialUsers: UserInfo[] = [];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Loading states
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
  const [loadingNavigate, setLoadingNavigate] = useState<'add' | 'edit' | null>(
    null
  );

  const navigate = useNavigate();

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<UserInfo[]>(
          API_ENDPOINTS.GET_USER_INFO
        );
        setUsers(response.data); // Set fetched users
        initialUsers.push(...response.data); // Store initial users for reset
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const navigateAddUser = () => {
    setLoadingNavigate('add');
    navigate('/users/addUser');
    setLoadingNavigate(null);
  };
  const handleEdit = (userId: string) => {
    setLoadingNavigate('edit');
    navigate(`/users/editUser/${userId}`);
    setLoadingNavigate(null);
  };
  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoadingDelete(userId);
      try {
        await axios.delete(`${API_ENDPOINTS.DELETE_USER_INFO}/${userId}`);
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        const totalPages = Math.ceil(updatedUsers.length / usersPerPage);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages || 1);
        }
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      } finally {
        setLoadingDelete(null);
      }
    }
  };

  const handleReset = () => {
    setSearchName('');
    setSearchId('');
    setUsers(initialUsers);
    setCurrentPage(1);
  };
  const handleSearch = async () => {
    setLoadingSearch(true);
    try {
      const response = await axios.get<UserInfo[]>(
        API_ENDPOINTS.SEARCH_USER_INFO,
        {
          params: {
            userName: searchName,
          },
        }
      );
      setUsers(response.data);
      setCurrentPage(1); // Reset to first page after search
    } catch (error) {
      console.error('Error searching user:', error);
      alert('Failed to search user. Please try again.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-gray-50">
      <div>
        <div className="grid grid-cols-1 gap-6">
          <div className="h-auto w-full rounded-lg bg-white p-4 shadow-sm">
            <div className="flex w-full">
              <div className="w-full pb-3 font-bold">Search Users</div>
              <div className="right-0 top-0">
                <button className="text-2xl text-gray-400">
                  <IoMdArrowDropdownCircle />
                </button>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-x-5 border-t-2">
              <div className="my-2">
                <label htmlFor="username" className="">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="mt-2 inline-block h-11 w-full rounded-xl border-2 pl-3 align-middle focus:border-gray-400 focus:shadow-md focus:outline-none"
                  placeholder="Enter username"
                  disabled={loadingSearch}
                />
              </div>
            </div>

            <div className="flex w-full border-t-2">
              <div className="mt-3 flex w-full justify-end">
                <button
                  onClick={handleReset}
                  className="rounded-3xl border border-green-500 px-9 py-1 text-green-500"
                  disabled={loadingSearch}
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
                  disabled={loadingSearch}
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
                onClick={navigateAddUser}
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
              <label htmlFor="text">({users.length}) Users Found</label>
            </div>

            <div className="w-full">
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-[50px] border border-gray-300 px-4 py-2 text-left">
                      S.No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      User ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Gmail
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Full Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Address
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Phone
                    </th>
                    <th className="w-[120px] border border-gray-300 px-4 py-2 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {indexOfFirstUser + index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        #{user.id?.slice(0, 8)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.userName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.userFullName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.userAddress}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.userPhone}
                      </td>
                      <td className="flex space-x-2 border border-gray-300 px-6 py-8">
                        <button
                          onClick={() => handleDelete(user.id!)}
                          className={`flex items-center justify-center rounded-full p-2 ${
                            loadingDelete === user.id
                              ? 'cursor-not-allowed bg-gray-300'
                              : 'bg-gray-100 hover:bg-red-200'
                          }`}
                          disabled={loadingDelete !== null} // Disable button during deletion
                        >
                          {loadingDelete === user.id ? (
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
                          onClick={() => handleEdit(user.id!)}
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
                  Showing {indexOfFirstUser + 1} to{' '}
                  {Math.min(indexOfLastUser, users.length)} of {users.length}{' '}
                  categories
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

export default ViewUsers;
