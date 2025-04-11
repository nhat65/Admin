import React from 'react';
import { FaBars } from 'react-icons/fa6';
import Dropdown from './Dropdown';
import { useLocation, Link } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const location = useLocation(); // Get current location from React Router

  const handleSelect = (value: string) => {
    console.log('Selected:', value);
  };

  // Function to format the pathname into a readable breadcrumb
  const getBreadcrumb = () => {
    const pathnames = location.pathname.split('/').filter(x => x); // Split path and remove empty segments
    
    // Format each segment: Capitalize first letter and add spaces between words
    const formattedPathnames = pathnames.map(path => {
      // Replace camelCase or kebab-case with spaces and capitalize each word
      const spacedPath = path
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .trim(); // Remove leading/trailing spaces
      return spacedPath
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    });

    return formattedPathnames.length > 0 ? `Admin / ${formattedPathnames.join(' / ')}` : 'Admin';
  };

  // Define navigation links for different sections
  const navLinks = {
    products: [
      { to: '/products/viewProducts', label: 'Product List' },
      { to: '/products/addProduct', label: 'Add Product' },
    ],
    categories: [
      { to: '/categories/viewCategories', label: 'Category List' },
      { to: '/categories/addCategory', label: 'Add Category' },
    ],
    users: [
      { to: '/users/viewUsers', label: 'User List' },
      { to: '/users/addUser', label: 'Add User' },
    ],
  };

  // Determine the current section based on the route
  const getCurrentSection = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('products')) return 'products';
    if (path.includes('categories')) return 'categories';
    if (path.includes('users')) return 'users';
    return null; // Default to null (no section) if no match
  };

  const currentSection = getCurrentSection();
  const currentNavLinks = currentSection ? navLinks[currentSection] : [];

  return (
    <div className="flex h-[7.5rem]">
      {/* Navbar */}
      <div className="flex w-auto h-auto">
        <div className="fixed top-0 left-0 z-40 flex flex-col w-full">
          {/* First Row: Toggle Button, Breadcrumb, and User Profile */}
          <div className="flex h-[4rem] items-center bg-gradient-to-r from-[#ffc500] to-[#ff8226]">
            {/* Toggle Sidebar Button */}
            <button
              className={`text-white transition-all duration-300 focus:outline-none ${
                isSidebarOpen ? 'ml-[260px]' : 'ml-5'
              }`}
              onClick={toggleSidebar}
            >
              <FaBars className="text-xl" />
            </button>
            {/* Breadcrumb */}
            <div className="ml-3 text-xs text-white">{getBreadcrumb()}</div>
            {/* User Profile Section */}
            <div className="ml-auto mr-10 flex h-[3.2rem] items-center rounded-full bg-[#ffffff26] text-white">
              <img
                src="https://th.bing.com/th/id/R.bb44b1e236b7580c7f2959c1d7a3d8b0?rik=VcpibGBJe%2b%2frQw&riu=http%3a%2f%2ffullhdwall.com%2fwp-content%2fuploads%2f2016%2f02%2fBest-cat-photo.jpeg&ehk=oyp5eUOaEqWAZ9V1eABMvvA7i4PevlSHbREquSpd8Vk%3d&risl=&pid=ImgRaw&r=0"
                alt="profile"
                className="h-[3.2rem] w-[3.2rem] rounded-full border-[3px] border-[#e6effa]"
              />
              <p className="hidden ml-4 md:block">Tấn Nhật</p>
              <Dropdown
                options={['Option 1', 'Option 2', 'Option 3']}
                onSelect={handleSelect}
              />
            </div>
          </div>

          {/* Second Row: Dynamic Navigation Links */}
          {currentNavLinks.length > 0 && (
            <div
              className={`flex px-5 py-2 space-x-3 bg-white transition-all duration-300 ${
                isSidebarOpen ? 'ml-[260px]' : 'ml-5'
              }`}
            >
              {currentNavLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    location.pathname === link.to
                      ? 'bg-orange-200 text-orange-800'
                      : 'bg-white text-gray-700'
                  } hover:bg-orange-100 hover:text-orange-800 transition-colors`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="right-0">hehe</div>
    </div>
  );
};

export default Navbar;