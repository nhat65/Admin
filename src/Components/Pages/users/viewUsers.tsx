import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { IoMdArrowDropdownCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import usersData from '../../../data/users'; // Import fake user data

interface Props {}

const ViewUsers: React.FC<Props> = () => {
  const [searchUsername, setSearchUsername] = useState('');
  const [searchId, setSearchId] = useState('');
  const [users, setUsers] = useState(usersData);
  const initialUsers = [...usersData];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Loading states
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null); // Track which user is being deleted
  const [loadingNavigate, setLoadingNavigate] = useState<'add' | 'edit' | null>(null); // Track navigation type

  const navigate = useNavigate();

  const navigateAddUser = () => {
    setLoadingNavigate('add'); // Set loading state for add navigation
    navigate('/users/addUser'); // Navigate immediately
    setLoadingNavigate(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  const handleEdit = (userId: string) => {
    setLoadingNavigate('edit'); // Set loading state for edit navigation
    navigate(`/users/editUser/${userId}`); // Navigate immediately
    setLoadingNavigate(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoadingDelete(userId); // Set loading state for this specific user
      const updatedUsers = users.filter(user => user.userId !== userId);
      setUsers(updatedUsers);
      const totalPages = Math.ceil(updatedUsers.length / usersPerPage);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages || 1);
      }
      setLoadingDelete(null); // Clear loading state
    }
  };

  const handleReset = () => {
    setSearchUsername('');
    setSearchId('');
    setUsers(initialUsers);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearch = () => {
    setLoadingSearch(true); // Start loading
    const filteredUsers = initialUsers.filter(user => 
      user.username.toLowerCase().includes(searchUsername.toLowerCase()) &&
      user.userId.toLowerCase().includes(searchId.toLowerCase())
    );
    setUsers(filteredUsers);
    setCurrentPage(1); // Reset to first page after search
    setLoadingSearch(false); // End loading
  };

  // Pagination logic
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
          <div className="w-full h-auto p-4 bg-white rounded-lg shadow-sm">
            <div className="flex w-full">
              <div className="w-full pb-3 font-bold">Search Users</div>
              <div className="top-0 right-0">
                <button className="text-2xl text-gray-400">
                  <IoMdArrowDropdownCircle />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 mb-4 border-t-2 gap-x-5">
              <div className="my-2">
                <label htmlFor="username" className="">Username</label>
                <input
                  type="text"
                  id="username"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  className="inline-block w-full pl-3 mt-2 align-middle border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                  placeholder="Enter username"
                  disabled={loadingSearch} // Disable input during search
                />
              </div>
              <div className="my-2">
                <label htmlFor="userId" className="">User ID</label>
                <input
                  type="text"
                  id="userId"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                  placeholder="Enter user ID"
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
                onClick={navigateAddUser}
                className={`py-1 my-4 text-white rounded-3xl px-9 flex items-center justify-center ${
                  loadingNavigate === 'add' ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={loadingNavigate !== null} // Disable button during navigation
              >
                {loadingNavigate === 'add' ? (
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
                  '+ Add User'
                )}
              </button>
            </div>

            <div className="my-6 text-xl">
              <label htmlFor="text">({users.length}) Users Found</label>
            </div>

            <div className="w-full">
              <table className="w-full border border-collapse border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left border border-gray-300 w-[50px]">S.No</th>
                    <th className="px-4 py-2 text-left border border-gray-300">User ID</th>
                    <th className="px-4 py-2 text-left border border-gray-300">Username</th>
                    <th className="px-4 py-2 text-left border border-gray-300">Full Name</th>
                    <th className="px-4 py-2 text-left border border-gray-300">Address</th>
                    <th className="px-4 py-2 text-left border border-gray-300">Phone</th>
                    <th className="px-4 py-2 text-left border border-gray-300">Email</th>
                    <th className="px-4 py-2 text-left border border-gray-300 w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-center border border-gray-300">
                        {indexOfFirstUser + index + 1}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">{user.userId}</td>
                      <td className="px-4 py-2 border border-gray-300">{user.username}</td>
                      <td className="px-4 py-2 border border-gray-300">{user.fullname}</td>
                      <td className="px-4 py-2 border border-gray-300">{user.address}</td>
                      <td className="px-4 py-2 border border-gray-300">{user.phone}</td>
                      <td className="px-4 py-2 border border-gray-300">{user.email}</td>
                      <td className="flex px-6 py-2 space-x-2 border border-gray-300">
                        <button
                          onClick={() => handleDelete(user.userId)}
                          className={`p-2 rounded-full flex items-center justify-center ${
                            loadingDelete === user.userId ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-red-200'
                          }`}
                          disabled={loadingDelete !== null} // Disable button during deletion
                        >
                          {loadingDelete === user.userId ? (
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
                          onClick={() => handleEdit(user.userId)}
                          className={`p-2 rounded-full flex items-center justify-center ${
                            loadingNavigate === 'edit' ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-blue-200'
                          }`}
                          disabled={loadingNavigate !== null} // Disable button during navigation
                        >
                          {loadingNavigate === 'edit' ? (
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
                  Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} users
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

export default ViewUsers;