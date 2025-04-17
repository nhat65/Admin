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
  const [searchUsername, setSearchUsername] = useState('');
  const [searchId, setSearchId] = useState('');
  const [users, setUsers] = useState<UserInfo[]>([]);
  const initialUsers: UserInfo[] = [];

   // Pagination states
   const [currentPage, setCurrentPage] = useState(1);
   const usersPerPage = 5;
 
   // Loading states
   const [loadingSearch, setLoadingSearch] = useState(false);
   const [loadingDelete, setLoadingDelete] = useState<string | null>(null); 
   const [loadingNavigate, setLoadingNavigate] = useState<'add' | 'edit' | null>(null);
 
   const navigate = useNavigate();
 
   // Fetch users data from API
   useEffect(() => {
     const fetchUsers = async () => {
       try {
         const response = await axios.get<UserInfo[]>(API_ENDPOINTS.GET_USER_INFO);
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
 
   const handleDelete = (userId: string) => {
     if (window.confirm('Are you sure you want to delete this user?')) {
       setLoadingDelete(userId);
       const updatedUsers = users.filter(user => user.id !== userId); // Use 'id' instead of 'userId' here
       setUsers(updatedUsers);
       const totalPages = Math.ceil(updatedUsers.length / usersPerPage);
       if (currentPage > totalPages) {
         setCurrentPage(totalPages || 1);
       }
       setLoadingDelete(null);
     }
   };
 
   const handleReset = () => {
     setSearchUsername('');
     setSearchId('');
     setUsers(initialUsers);
     setCurrentPage(1);
   };
 
   const handleSearch = () => {
     setLoadingSearch(true);
     const filteredUsers = initialUsers.filter(user =>
       user.userName.toLowerCase().includes(searchUsername.toLowerCase()) &&
       (user.id?.toLowerCase() || '').includes(searchId.toLowerCase())
     );
     setUsers(filteredUsers);
     setCurrentPage(1);
     setLoadingSearch(false);
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
                   disabled={loadingSearch}
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
                   disabled={loadingSearch}
                 />
               </div>
             </div>
 
             <div className="flex w-full border-t-2">
               <div className="flex justify-end w-full mt-3">
                 <button
                   onClick={handleReset}
                   className="py-1 text-green-500 border border-green-500 rounded-3xl px-9"
                   disabled={loadingSearch}
                 >
                   Reset
                 </button>
                 <button
                   onClick={handleSearch}
                   className={`py-1 mx-3 text-white rounded-3xl px-9 flex items-center justify-center ${
                     loadingSearch ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                   }`}
                   disabled={loadingSearch}
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
                 disabled={loadingNavigate !== null}
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
                       <td className="px-4 py-2 border border-gray-300">{String(user.id).slice(0, 8)}</td>
                       <td className="px-4 py-2 border border-gray-300">{user.userName}</td>
                       <td className="px-4 py-2 border border-gray-300">{user.userFullName}</td>
                       <td className="px-4 py-2 border border-gray-300">{user.userAddress}</td>
                       <td className="px-4 py-2 border border-gray-300">{user.userPhone}</td>
                       <td className="px-4 py-2 border border-gray-300">{user.id}</td>
                       <td className="px-4 py-2 text-center border border-gray-300">
                         <button
                           onClick={() => handleEdit(user.id!)}
                           className="text-yellow-500"
                           disabled={loadingNavigate === 'edit'}
                         >
                           <FaEdit />
                         </button>
                         <button
                           onClick={() => handleDelete(user.id!)}
                           className="text-red-500 mx-4"
                           disabled={loadingDelete === user.id}
                         >
                           <FaTrash />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
 
             <div className="w-full flex justify-center items-center mt-6">
               <button
                 onClick={() => handlePageChange(currentPage - 1)}
                 disabled={currentPage === 1}
                 className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
               >
                 Prev
               </button>
               <div className="px-4 py-2">{currentPage}</div>
               <button
                 onClick={() => handlePageChange(currentPage + 1)}
                 disabled={currentPage === totalPages}
                 className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
               >
                 Next
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };
 
 export default ViewUsers;