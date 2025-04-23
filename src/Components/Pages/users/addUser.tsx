import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserInfo } from '../../../types/userInfo';
import { API_ENDPOINTS } from '../../../service/apiService';

interface AddUserProps {}

const AddUser: React.FC<AddUserProps> = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserInfo>({
    userName: '',
    userPassword: '',
    userFullName: '',
    userAddress: '',
    userPhone: '',
  });

  // State for loading
  const [loading, setLoading] = useState<'save' | 'cancel' | null>(null);

  // Handler for input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Validation
  const validateUser = (user: UserInfo): string | null => {
    if (!user.userName.trim()) return 'Username is required';
    if (!user.userPassword.trim()) return 'Password is required';
    if (!user.userFullName.trim()) return 'Full name is required';
    if (!user.userAddress.trim()) return 'Address is required';
    if (!user.userPhone.trim()) return 'Phone number is required';
    return null;
  };

  // Handle cancel
  const handleCancel = () => {
    setLoading('cancel');
    navigate('/users/viewUsers');
    setLoading(null);
  };

  // Handle save
  const handleSave = async () => {
    try {
      setLoading('save');

      const userToSave: UserInfo = {
        userName: user.userName.trim(),
        userPassword: user.userPassword.trim(),
        userFullName: user.userFullName.trim(),
        userAddress: user.userAddress.trim(),
        userPhone: user.userPhone.trim(),
      };

      // Validation
      const error = validateUser(userToSave);
      if (error) {
        alert(error);
        setLoading(null);
        return;
      }

      // Call API POST
      await axios.post(API_ENDPOINTS.POST_USER_INFO, userToSave);
      alert('User saved successfully!');
      navigate('/users/viewUsers');
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Please check your inputs or try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="w-full rounded-lg bg-white p-4 shadow-sm">
        <div className="w-full border-b-2 pb-3">
          <label className="font-bold">Add User</label>
        </div>

        <div className="m-2 grid w-full grid-cols-2 gap-x-5">
          <div className="space-y-10">
            <div>
              <label htmlFor="userName">Username*</label>
              <input
                type="text"
                id="userName"
                value={user.userName}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter username"
                disabled={loading !== null}
              />
            </div>
            <div>
              <label htmlFor="userPassword">Password*</label>
              <input
                type="password"
                id="userPassword"
                value={user.userPassword}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter password"
                disabled={loading !== null}
              />
            </div>
            <div>
              <label htmlFor="userFullName">Full Name*</label>
              <input
                type="text"
                id="userFullName"
                value={user.userFullName}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter full name"
                disabled={loading !== null}
              />
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <label htmlFor="userPhone">Phone Number*</label>
              <input
                type="text"
                id="userPhone"
                value={user.userPhone}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter phone number"
                disabled={loading !== null}
              />
            </div>
            <div>
              <label htmlFor="userAddress">Address*</label>
              <textarea
                id="userAddress"
                value={user.userAddress}
                onChange={handleInputChange}
                className="mt-2 min-h-[100px] w-full rounded-xl border-2 p-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter address"
                disabled={loading !== null}
              />
            </div>
          </div>
        </div>

        <div className="my-2 flex w-full border-t-2">
          <div>*Required</div>
          <div className="mt-3 flex w-full justify-end">
            <button
              onClick={handleCancel}
              className={`flex items-center justify-center rounded-3xl border border-green-500 px-9 py-1 text-green-500 ${
                loading === 'cancel' ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={loading !== null}
            >
              {loading === 'cancel' ? (
                <>
                  <svg
                    className="mr-2 h-5 w-5 animate-spin text-green-500"
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
              className={`mx-3 flex items-center justify-center rounded-3xl px-9 py-1 text-white ${
                loading === 'save'
                  ? 'cursor-not-allowed bg-green-400'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={loading !== null}
            >
              {loading === 'save' ? (
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
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
