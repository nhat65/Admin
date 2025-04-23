import { useState } from 'react';
import Admin from './Components/Pages/Admin';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import AddProduct from './Components/Pages/Products/addProduct';
import ViewProducts from './Components/Pages/Products/ViewProducts';
import Login from './Components/Pages/Authentication/Login';
import EditProduct from './Components/Pages/Products/editProduct';
import ViewCategories from './Components/Pages/categories/viewCategories';
import AddCategory from './Components/Pages/categories/addCategory';
import EditCategory from './Components/Pages/categories/editCategory';
import ViewUsers from './Components/Pages/users/viewUsers';
import EditUser from './Components/Pages/users/editUser';
import ViewNewOrders from './Components/Pages/cart/newOrders';
import AddUser from './Components/Pages/users/addUser';

const App = () => {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login'; // Check if user is on login page

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Show Navbar & Sidebar only on valid routes (Not on Login or 404) */}
      {!isAuthPage && (
        <>
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <Sidebar isSidebarOpen={isSidebarOpen} />
        </>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Cart Routes */}
        <Route path="/carts" element={<Admin isSidebarOpen={isSidebarOpen} />}>
          <Route path="newOrders" element={<ViewNewOrders />} />
        </Route>

        {/* Categories Routes */}
        <Route
          path="/categories"
          element={<Admin isSidebarOpen={isSidebarOpen} />}
        >
          <Route path="viewCategories" element={<ViewCategories />} />
          <Route path="addCategory" element={<AddCategory />} />
          <Route path="editCategory/:categoryId" element={<EditCategory />} />
        </Route>

        {/* Products Routes */}
        <Route
          path="/products"
          element={<Admin isSidebarOpen={isSidebarOpen} />}
        >
          <Route path="viewProducts" element={<ViewProducts />} />
          <Route path="addProduct" element={<AddProduct />} />
          <Route path="editProduct/:productId" element={<EditProduct />} />
        </Route>

        {/* Users Management Routes */}
        <Route path="/users" element={<Admin isSidebarOpen={isSidebarOpen} />}>
          <Route path="viewUsers" element={<ViewUsers />} />
          <Route path="addUser" element={<AddUser />} />
          <Route path="editUser/:userId" element={<EditUser />} />
        </Route>

        {/* 404 Not Found - Redirect to a Not Found Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const NotFound = () => {
  return (
    <div className="flex h-auto flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-500">
        The page you are looking for does not exist.
      </p>
    </div>
  );
};

export default App;
