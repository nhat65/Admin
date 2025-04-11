import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSelect = (option: string) => {
    if (option === "Logout") {
      // Handle logout by navigating to the login page
      navigate("/login");
    } else {
      // Call the onSelect callback for other options
      onSelect(option);
    }
    setIsOpen(false); // Close the dropdown after selection
  };

  // Add "Logout" to the options list
  const allOptions = [...options, "Logout"];

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-center w-full py-2 pr-4 text-sm font-medium text-white rounded-md bg-none focus:outline-none"
        >
          <svg
            className="w-5 h-5 ml-2 -mr-1 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.018l3.72-3.79a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.25 8.25a.75.75 0 01-.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div
          className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1">
            {allOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className={`block w-full px-4 py-2 text-sm text-left ${
                  option === "Logout" ? "text-red-600" : "text-gray-700"
                } hover:bg-gray-100`}
                role="menuitem"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;