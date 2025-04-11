import React, { useState } from 'react';
import { CiUser } from 'react-icons/ci';
import { PiKeyLight } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';

interface Props {}

const Login: React.FC<Props> = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // State for error message
  const [error, setError] = useState('');

  // State for loading
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle login event
  const handleLogin = () => {
    const { username, password } = formData;

    // Set loading to true
    setLoading(true);
    setError(''); // Clear any previous error

      // Simple validation against hardcoded credentials
      if (username === 'Admin' && password === 'admin123') {
        console.log('Login successful:', { username });
        navigate('/products/viewProducts'); // Navigate to dashboard
      } else {
        setError('Invalid username or password');
      }
      // Set loading to false after the "API call" completes
      setLoading(false);

  };

  // Handle "Enter" key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) { // Prevent login if already loading
      handleLogin();
    }
  };

  return (
    <div className="z-50 w-full h-screen bg-orange-500">
      <div className="z-40 w-[90rem] h-screen bg-white rounded-r-full">
        <div className="flex flex-col items-center justify-center w-full h-screen gap-y-3">
          <label htmlFor="text" className="text-4xl font-bold text-gray-500">Login</label>
          <div className="h-auto bg-gray-200 w-[30rem] flex p-6 rounded-xl flex-col m-4 text-gray-500">
            <p>Username: Admin</p>
            <p>Password: admin123</p>
          </div>

          <div className="h-auto w-[30rem] flex flex-col gap-y-2">
            <div className="flex items-center gap-2 text-gray-500">
              <CiUser />
              <label htmlFor="username">Username</label>
            </div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="h-12 px-3 border rounded-xl placeholder:pl-3 placeholder:select-none"
              disabled={loading} // Disable input during loading
            />
          </div>

          <div className="h-auto w-[30rem] flex flex-col gap-y-2">
            <div className="flex items-center gap-2 text-gray-500">
              <PiKeyLight />
              <label htmlFor="password">Password</label>
            </div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="h-12 px-3 border rounded-xl placeholder:pl-3 placeholder:select-none"
              disabled={loading} // Disable input during loading
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-[30rem] text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className={`w-[30rem] p-3 rounded-3xl text-white font-bold my-4 flex items-center justify-center ${
              loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
            }`}
            disabled={loading} // Disable button during loading
          >
            {loading ? (
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
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <Link to="" className="text-orange-500">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;