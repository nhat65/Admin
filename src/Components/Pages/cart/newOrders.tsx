import React, { useEffect, useState } from 'react';
import { IoMdArrowDropdownCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaTruck,
  FaCheckCircle,
  FaCheck,
} from 'react-icons/fa';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../service/apiService';
import { CartInfo } from '../../../types/cartInfo';
import { parse, format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Props {}

const ViewNewOrders: React.FC<Props> = () => {
  const [searchId, setSearchId] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<CartInfo[]>([]);
  const [allTransactions, setAllTransactions] = useState<CartInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState<string | null>(null);
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    GetAllTransactions();
  }, []);

  const GetAllTransactions = async () => {
    try {
      const response = await axios.get<CartInfo[]>(
        API_ENDPOINTS.GET_TRANSACTIONS
      );
      const allData = response.data;

      // sort transaction by dateOrder des
      const sortedData = allData.sort((a, b) => {
        const dateA = parse(a.dateOrder, 'dd/MM/yyyy HH:mm', new Date());
        const dateB = parse(b.dateOrder, 'dd/MM/yyyy HH:mm', new Date());
        return dateB.getTime() - dateA.getTime();
      });

      setAllTransactions(sortedData);
      setTransactions(
        sortedData.filter((order) => order.status === 'NewOrder')
      );
      setStatusFilter('NewOrder');
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    setLoadingConfirm(orderId);
    try {
      // Call the UPDATE_CART_STATUS API with PUT method
      await axios.put(API_ENDPOINTS.UPDATE_CART_STATUS, {
        cartInfoId: orderId,
        status: 'Delivery',
      });

      // Update local state on success
      const updatedOrders = transactions.map((order) =>
        order.id === orderId && order.status === 'NewOrder'
          ? { ...order, status: 'Delivery' }
          : order
      );
      const updatedAllOrders = allTransactions.map((order) =>
        order.id === orderId && order.status === 'NewOrder'
          ? { ...order, status: 'Delivery' }
          : order
      );
      setTransactions(updatedOrders);
      setAllTransactions(updatedAllOrders);
      alert('Order confirmed successfully!');
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Failed to confirm order. Please try again.');
    } finally {
      setLoadingConfirm(null);
    }
  };

  const handleReset = () => {
    setSearchName('');
    setSearchId('');
    setStatusFilter(null);
    setTransactions(allTransactions);
    setCurrentPage(1);
  };

  const handleSearch = async (filter: string | null = statusFilter) => {
    setLoadingSearch(true);
    try {
      if (filter) {
        const filteredOrders = allTransactions.filter(
          (order) => order.status === filter
        );
        setTransactions(filteredOrders);
      } else if (searchName) {
        // Gọi API nếu có searchName
        const response = await axios.get<CartInfo[]>(
          API_ENDPOINTS.SEARCH_TRANSACTIONS,
          {
            params: {
              userName: searchName,
            },
          }
        );
        setTransactions(response.data);
      } else {
        setTransactions(allTransactions);
      }
      setCurrentPage(1);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleCardClick = (filter: string) => {
    setStatusFilter(filter);
    handleSearch(filter);
  };

  const summaryData = {
    newOrders: allTransactions.filter((order) => order.status === 'NewOrder')
      .length,
    delivery: allTransactions.filter((order) => order.status === 'Delivery')
      .length,
    completed: allTransactions.filter((order) => order.status === 'Completed')
      .length,
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = transactions.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(transactions.length / ordersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString: string) => {
    try {
      // Parse string with format "dd/MM/yyyy HH:mm"
      const date = parse(dateString, 'dd/MM/yyyy HH:mm', new Date());
      // Format as desired, e.g., "MM/dd/yyyy"
      return format(date, 'MM/dd/yyyy');
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return 'Unknown Date';
    }
  };

  const showActionsColumn =
    statusFilter === 'NewOrder' || statusFilter === null;

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="bg-gray-50">
      <div className="grid grid-cols-1 gap-6">
        {/* Part 1: Summary Cards Section */}
        <div className="h-auto w-full rounded-lg bg-white p-4 shadow-sm">
          <div className="flex w-full items-center justify-between border-b-2 pb-3">
            <label className="font-bold">Order Summary</label>
            {statusFilter && (
              <button
                onClick={handleReset}
                className="text-sm text-blue-500 hover:underline"
                disabled={loadingSearch}
              >
                Show All Orders
              </button>
            )}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
              onClick={() => handleCardClick('NewOrder')}
              className={`flex cursor-pointer items-center justify-between rounded-lg bg-blue-50 p-4 shadow-sm transition-colors hover:bg-blue-100 ${
                statusFilter === 'NewOrder' ? 'border-2 border-blue-500' : ''
              } ${loadingSearch ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="flex items-center">
                <FaShoppingCart className="mr-3 text-2xl text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    New Order
                  </h3>
                  <p className="text-sm text-gray-600">New Orders</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {summaryData.newOrders}
              </p>
            </div>
            <div
              onClick={() => handleCardClick('Delivery')}
              className={`flex cursor-pointer items-center justify-between rounded-lg bg-blue-50 p-4 shadow-sm transition-colors hover:bg-blue-100 ${
                statusFilter === 'Delivery' ? 'border-2 border-blue-500' : ''
              } ${loadingSearch ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="flex items-center">
                <FaTruck className="mr-3 text-2xl text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Delivery
                  </h3>
                  <p className="text-sm text-gray-600">Delivery Orders</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {summaryData.delivery}
              </p>
            </div>
            <div
              onClick={() => handleCardClick('Completed')}
              className={`flex cursor-pointer items-center justify-between rounded-lg bg-blue-50 p-4 shadow-sm transition-colors hover:bg-blue-100 ${
                statusFilter === 'Completed' ? 'border-2 border-blue-500' : ''
              } ${loadingSearch ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="flex items-center">
                <FaCheckCircle className="mr-3 text-2xl text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Completed
                  </h3>
                  <p className="text-sm text-gray-600">Completed Orders</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {summaryData.completed}
              </p>
            </div>
          </div>
        </div>

        {/* Part 2: Search Orders Section */}
        <div className="h-auto w-full rounded-lg bg-white p-4 shadow-sm">
          <div className="flex w-full">
            <div className="w-full pb-3 font-bold">Search Orders</div>
            <div className="right-0 top-0">
              <button className="text-2xl text-gray-400">
                <IoMdArrowDropdownCircle />
              </button>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-x-5 border-t-2">
            <div className="my-2">
              <label htmlFor="customerMail" className="">
                Customer Mail
              </label>
              <input
                type="text"
                id="customerMail"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="mt-2 inline-block h-11 w-full rounded-xl border-2 pl-3 align-middle focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter customer mail"
                disabled={loadingSearch}
              />
            </div>
            <div className="my-2">
              <label htmlFor="orderId" className="">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter order ID"
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
                onClick={() => handleSearch()}
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

        {/* Part 3: Orders List Section */}
        <div className="h-auto w-full rounded-lg bg-white p-4 shadow-sm">
          <div className="my-6 text-xl">
            <label>({transactions.length}) Orders Found</label>
          </div>
          <div className="w-full">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-[50px] border border-gray-300 px-4 py-2 text-left">
                    S.No
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Order ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Customer Mail
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Total Amount
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Date
                  </th>
                  {showActionsColumn && (
                    <th className="w-[120px] border border-gray-300 px-4 py-2 text-left">
                      {statusFilter === 'NewOrder'
                        ? 'Confirm Order'
                        : 'Actions'}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((transaction, index) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {indexOfFirstOrder + index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      #{transaction.id?.slice(0, 8)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-blue-500 underline hover:text-blue-700">
                      <Link to="/users/viewUsers">{transaction.userName}</Link>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.totalPrice.toLocaleString('vi-VN')}₫
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {formatDate(transaction.dateOrder)}
                    </td>
                    {showActionsColumn && (
                      <td className="border border-gray-300 px-10 py-2">
                        {transaction.status === 'NewOrder' ? (
                          <button
                            onClick={() =>
                              handleConfirmOrder(transaction.id ?? '')
                            }
                            className={`flex items-center justify-center rounded-full p-2 ${
                              loadingConfirm === transaction.id
                                ? 'cursor-not-allowed bg-gray-300'
                                : 'bg-gray-100 hover:bg-green-200'
                            }`}
                            disabled={loadingConfirm !== null}
                          >
                            {loadingConfirm === transaction.id ? (
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
                              <FaCheck className="text-gray-500" />
                            )}
                          </button>
                        ) : (
                          <button
                            className="rounded-full bg-green-400 p-2"
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
            <div className="mt-4 flex items-center justify-between">
              <div>
                Showing {indexOfFirstOrder + 1} to{' '}
                {Math.min(indexOfLastOrder, transactions.length)} of{' '}
                {transactions.length} orders
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
  );
};

export default ViewNewOrders;
