import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usersData from '../../../data/users'; // Import fake user data
import paymentsData from '../../../data/payments'; // Import fake payment data
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';

interface EditUserProps {}

const EditUser: React.FC<EditUserProps> = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Find the user from fake data based on userId
  const initialUser = usersData.find(user => user.userId === userId) || {
    username: '',
    fullname: '',
    address: '',
    phone: '',
    email: '',
    password: '',
  };

  const [user, setUser] = useState({ ...initialUser });

  // Loading states
  const [loading, setLoading] = useState<'save' | 'cancel' | null>(null); // For save and cancel actions
  const [loadingPaymentAction, setLoadingPaymentAction] = useState<{ action: 'edit' | 'delete'; paymentId: string } | null>(null); // For payment actions

  // Pagination for payments
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const paymentsPerPage = 5;

  // Filter payments for this user
  const userPayments = paymentsData.filter(payment => payment.userId === userId);

  useEffect(() => {
    setUser(initialUser);
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setLoading('cancel'); // Set loading state for cancel
    navigate('/users/viewUsers'); // Navigate immediately
    setLoading(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  const handleSave = () => {
    setLoading('save'); // Set loading state for save
    console.log('Saving user:', user);
    navigate('/users/viewUsers'); // Navigate immediately
    setLoading(null); // Clear loading state (though this may not be noticeable due to navigation)
  };

  // Handlers for payment actions
  const handleDeletePayment = (paymentId: string) => {
    setLoadingPaymentAction({ action: 'delete', paymentId }); // Set loading state for delete
    console.log(`Delete payment with ID: ${paymentId}`);
    setLoadingPaymentAction(null); // Clear loading state
  };

  const handleEditPayment = (paymentId: string) => {
    setLoadingPaymentAction({ action: 'edit', paymentId }); // Set loading state for edit
    console.log(`Edit payment with ID: ${paymentId}`);
    // Navigate to an edit payment page if needed
    // navigate(`/payments/editPayment/${paymentId}`);
    setLoadingPaymentAction(null); // Clear loading state
  };

  // Payment pagination logic
  const indexOfLastPayment = currentPaymentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = userPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPaymentPages = Math.ceil(userPayments.length / paymentsPerPage);

  const handlePaymentPageChange = (pageNumber: number) => {
    setCurrentPaymentPage(pageNumber);
  };

  return (
    <div className="bg-gray-50">
      <div className="grid grid-cols-1 gap-6">
        {/* Part 1: User Edit Section */}
        <div className="w-full h-auto p-4 bg-white rounded-lg shadow-sm">
          <div className="w-full pb-3 border-b-2">
            <label className="font-bold">Edit User</label>
          </div>

          <div className="grid w-full grid-cols-2 m-2 gap-x-5 gap-y-6">
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter username"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={user.fullname}
                onChange={handleInputChange}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter full name"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={user.address}
                onChange={handleInputChange}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter address"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter phone number"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter email"
                disabled={loading !== null} // Disable input during loading
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleInputChange}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter new password"
                disabled={loading !== null} // Disable input during loading
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

        {/* Part 2: Payments List Section */}
        <div className="w-full h-auto p-4 bg-white rounded-lg shadow-sm">
          <div className="w-full pb-3 border-b-2">
            <label className="font-bold">Payments for this User ({userPayments.length})</label>
          </div>

          <div className="w-full mt-4">
            <table className="w-full border border-collapse border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left border border-gray-300 w-[50px]">S.No</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Payment ID</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Amount</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Date</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Status</th>
                  <th className="px-4 py-2 text-left border border-gray-300 w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-center border border-gray-300">
                      {indexOfFirstPayment + index + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">{payment.paymentId}</td>
                    <td className="px-4 py-2 border border-gray-300">${payment.amount.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-gray-300">{payment.date}</td>
                    <td className="px-4 py-2 border border-gray-300">{payment.status}</td>
                    <td className="flex px-4 py-2 space-x-2 border border-gray-300">
                      <button
                        onClick={() => handleDeletePayment(payment.paymentId)}
                        className={`p-2 rounded-full flex items-center justify-center ${
                          loadingPaymentAction?.action === 'delete' && loadingPaymentAction?.paymentId === payment.paymentId
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-red-200'
                        }`}
                        disabled={loadingPaymentAction !== null} // Disable button during any payment action
                      >
                        {loadingPaymentAction?.action === 'delete' && loadingPaymentAction?.paymentId === payment.paymentId ? (
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
                        onClick={() => handleEditPayment(payment.paymentId)}
                        className={`p-2 rounded-full flex items-center justify-center ${
                          loadingPaymentAction?.action === 'edit' && loadingPaymentAction?.paymentId === payment.paymentId
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-blue-200'
                        }`}
                        disabled={loadingPaymentAction !== null} // Disable button during any payment action
                      >
                        {loadingPaymentAction?.action === 'edit' && loadingPaymentAction?.paymentId === payment.paymentId ? (
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
                {userPayments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-2 text-center border border-gray-300">
                      No payments found for this user
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Payment Pagination Controls */}
            {userPayments.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div>
                  Showing {indexOfFirstPayment + 1} to {Math.min(indexOfLastPayment, userPayments.length)} of {userPayments.length} payments
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePaymentPageChange(currentPaymentPage - 1)}
                    disabled={currentPaymentPage === 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPaymentPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePaymentPageChange(page)}
                      className={`px-3 py-1 border rounded-md ${
                        currentPaymentPage === page ? 'bg-green-500 text-white' : 'bg-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePaymentPageChange(currentPaymentPage + 1)}
                    disabled={currentPaymentPage === totalPaymentPages}
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

export default EditUser;