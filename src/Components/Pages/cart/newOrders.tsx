import React, { useState } from 'react';
import { IoMdArrowDropdownCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import ordersData from '../../../data/orders'; // Import fake order data
import { FaShoppingCart, FaTruck, FaCheckCircle, FaCheck } from 'react-icons/fa';

interface Props {}

const ViewNewOrders: React.FC<Props> = () => {
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [orders, setOrders] = useState(ordersData);
  const initialOrders = [...ordersData];
  const [statusFilter, setStatusFilter] = useState<string | null>(null); // Track selected status filter

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Loading states
  const [loadingSearch, setLoadingSearch] = useState(false); // For search and card filter
  const [loadingConfirm, setLoadingConfirm] = useState<string | null>(null); // Track which order is being confirmed
  const [loadingNavigate, setLoadingNavigate] = useState<boolean>(false); // For navigation to Add Order

  const navigate = useNavigate();

  const navigateAddOrder = () => {
    setLoadingNavigate(true); // Set loading state for navigation
    navigate('/orders/addOrder'); // Navigate immediately
    setLoadingNavigate(false); // Clear loading state (though this may not be noticeable due to navigation)
  };

  const handleConfirmOrder = (orderId: string) => {
    setLoadingConfirm(orderId); // Set loading state for this specific order
    const updatedOrders = orders.map(order => 
      order.orderId === orderId && order.status === 'Pending'
        ? { ...order, status: 'Processing' }
        : order
    );
    setOrders(updatedOrders);
    setLoadingConfirm(null); // Clear loading state
  };

  const handleReset = () => {
    setSearchCustomerName('');
    setSearchId('');
    setOrders(initialOrders);
    setStatusFilter(null); // Reset status filter
    setCurrentPage(1);
  };

  const handleSearch = (filter: string | null = statusFilter) => {
    setLoadingSearch(true); // Start loading
    let filteredOrders = initialOrders;

    // Apply search filters
    filteredOrders = filteredOrders.filter(order => 
      order.customerName.toLowerCase().includes(searchCustomerName.toLowerCase()) &&
      order.orderId.toLowerCase().includes(searchId.toLowerCase())
    );

    // Apply status filter if set
    if (filter) {
      if (filter === 'Pending') {
        filteredOrders = filteredOrders.filter(order => order.status === 'Pending');
      } else if (filter === 'Delivery') {
        filteredOrders = filteredOrders.filter(order => order.status === 'Shipped' || order.status === 'Processing');
      } else if (filter === 'Completed') {
        filteredOrders = filteredOrders.filter(order => order.status === 'Delivered');
      }
    }

    setOrders(filteredOrders);
    setCurrentPage(1);
    setLoadingSearch(false); // End loading
  };

  // Handle card click to filter by status
  const handleCardClick = (filter: string) => {
    setStatusFilter(filter);
    handleSearch(filter); // Pass the filter directly to ensure immediate application
  };

  // Calculate summary data based on initial orders
  const summaryData = {
    newOrders: initialOrders.filter(order => order.status === 'Pending').length,
    delivery: initialOrders.filter(order => order.status === 'Shipped' || order.status === 'Processing').length,
    completed: initialOrders.filter(order => order.status === 'Delivered').length,
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Determine if the "Actions" column should be shown
  const showActionsColumn = statusFilter === 'Pending' || statusFilter === null;

  return (
    <div className="bg-gray-50">
      <div className="grid grid-cols-1 gap-6">
        {/* Part 1: Summary Cards Section */}
        <div className="w-full h-auto p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between w-full pb-3 border-b-2">
            <label className="font-bold">Order Summary</label>
            {statusFilter && (
              <button
                onClick={handleReset}
                className="text-sm text-blue-500 hover:underline"
                disabled={loadingSearch} // Disable during search
              >
                Show All Orders
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
            {/* Card 1: New Order */}
            <div
              onClick={() => handleCardClick('Pending')}
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors ${
                statusFilter === 'Pending' ? 'border-2 border-blue-500' : ''
              } ${loadingSearch ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center">
                <FaShoppingCart className="mr-3 text-2xl text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">New Order</h3>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{summaryData.newOrders}</p>
            </div>

            {/* Card 2: Delivery */}
            <div
              onClick={() => handleCardClick('Delivery')}
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors ${
                statusFilter === 'Delivery' ? 'border-2 border-blue-500' : ''
              } ${loadingSearch ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center">
                <FaTruck className="mr-3 text-2xl text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Delivery</h3>
                  <p className="text-sm text-gray-600">Shipped/Processing Orders</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{summaryData.delivery}</p>
            </div>

            {/* Card 3: Completed */}
            <div
              onClick={() => handleCardClick('Completed')}
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors ${
                statusFilter === 'Completed' ? 'border-2 border-blue-500' : ''
              } ${loadingSearch ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center">
                <FaCheckCircle className="mr-3 text-2xl text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
                  <p className="text-sm text-gray-600">Delivered Orders</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{summaryData.completed}</p>
            </div>
          </div>
        </div>

        {/* Part 2: Search Orders Section */}
        <div className="w-full h-auto p-4 bg-white rounded-lg shadow-sm">
          <div className="flex w-full">
            <div className="w-full pb-3 font-bold">Search Orders</div>
            <div className="top-0 right-0">
              <button className="text-2xl text-gray-400">
                <IoMdArrowDropdownCircle />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 mb-4 border-t-2 gap-x-5">
            <div className="my-2">
              <label htmlFor="customerName" className="">Customer Name</label>
              <input
                type="text"
                id="customerName"
                value={searchCustomerName}
                onChange={(e) => setSearchCustomerName(e.target.value)}
                className="inline-block w-full pl-3 mt-2 align-middle border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter customer name"
                disabled={loadingSearch} // Disable input during search
              />
            </div>
            <div className="my-2">
              <label htmlFor="orderId" className="">Order ID</label>
              <input
                type="text"
                id="orderId"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-3 mt-2 border-2 h-11 rounded-xl focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter order ID"
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
                onClick={() => handleSearch()}
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

        {/* Part 3: Orders List Section */}
        <div className="w-full h-auto p-4 bg-white rounded-lg shadow-sm">
          <div className="border-b-2">
            <button
              onClick={navigateAddOrder}
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
                '+ Add Order'
              )}
            </button>
          </div>

          <div className="my-6 text-xl">
            <label htmlFor="text">({orders.length}) Orders Found</label>
          </div>

          <div className="w-full">
            <table className="w-full border border-collapse border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left border border-gray-300 w-[50px]">S.No</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Order ID</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Customer Name</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Total Amount</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Status</th>
                  <th className="px-4 py-2 text-left border border-gray-300">Date</th>
                  {showActionsColumn && (
                    <th className="px-4 py-2 text-left border border-gray-300 w-[120px]">
                      {statusFilter === 'Pending' ? 'Confirm Order' : 'Actions'}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-center border border-gray-300">
                      {indexOfFirstOrder + index + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">{order.orderId}</td>
                    <td className="px-4 py-2 border border-gray-300">{order.customerName}</td>
                    <td className="px-4 py-2 border border-gray-300">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-2 border border-gray-300">{order.status}</td>
                    <td className="px-4 py-2 border border-gray-300">{order.date}</td>
                    {showActionsColumn && (
                      <td className="px-10 py-2 border border-gray-300">
                        {order.status === 'Pending' ? (
                          <button
                            onClick={() => handleConfirmOrder(order.orderId)}
                            className={`p-2 rounded-full flex items-center justify-center ${
                              loadingConfirm === order.orderId ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-green-200'
                            }`}
                            disabled={loadingConfirm !== null} // Disable button during confirmation
                          >
                            {loadingConfirm === order.orderId ? (
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
                              <FaCheck className="text-gray-500" />
                            )}
                          </button>
                        ) : (
                          <button
                            className="p-2 bg-green-400 rounded-full"
                            disabled
                          >
                            <FaCheck className="text-gray-500" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
              <div>
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} orders
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
  );
};

export default ViewNewOrders;