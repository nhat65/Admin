import React, { useState } from 'react';
import { FaUsers, FaSearch } from 'react-icons/fa';
import { BsFillCartFill } from "react-icons/bs";
import { BiSolidCategory } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { AiFillProduct } from "react-icons/ai";

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const [selectedItem, setSelectedItem] = useState<string>('');

  const navigate = useNavigate();
  const handleItemClick = (url: string, label: string) => {
    console.log(`${label} clicked!`);
    setSelectedItem(label);
    navigate(url)
  };

  return (
    <aside>
      <div
        className={`fixed left-0 top-0 z-50 h-full overflow-auto rounded-r-3xl bg-white text-black shadow-2xl transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '250px' }}
      >
        <div className="p-4 text-xl font-bold">Sidebar</div>
        <div className="flex items-center gap-2 pl-3 text-[#64728c]">
          <FaSearch />
          <input
            type="text"
            placeholder="Search"
            className="border-b border-gray-700 focus:outline-none"
          />
        </div>
        
        <ul className="pr-5 mt-4">
          {[
            
            { icon: <AiFillProduct  />, label: 'Products', url: '/products/viewProducts' },
            { icon: <BiSolidCategory  />, label: 'Categories', url: 'categories/viewCategories' },
            { icon: <FaUsers />, label: 'Users', url: '/users/viewUsers' },
            { icon: <BsFillCartFill  />, label: 'Carts', url: '/carts/newOrders' },
          ].map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(item.url, item.label)}
              className={`flex cursor-pointer select-none items-center gap-2 rounded-r-3xl p-2 text-[#64728c] transition duration-300 hover:bg-[#ffd4b6] ${
                selectedItem === item.label
                  ? 'bg-gradient-to-r from-[#ffc500] to-[#ff8226]'
                  : ''
              }`}
            >
              <a href={item.url}></a>
            {item.icon}
            {item.label}
            </li>
          
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
