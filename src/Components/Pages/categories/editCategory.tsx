import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Category } from '../../../types/category';
import { ProductInfo } from '../../../types/productInfo';
import { API_ENDPOINTS } from '../../../service/apiService';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';

interface EditCategoryProps {}

const EditCategory: React.FC<EditCategoryProps> = () => {
  const { categoryId } = useParams<{
    categoryId: string;
    categoryNameSlug: string;
  }>();
  const navigate = useNavigate();

  // Category state
  const [category, setCategory] = useState<Category>({
    id: '',
    categoryName: '',
    description: '',
    image: '',
  });

  // Loading states
  const [loading, setLoading] = useState<'save' | 'cancel' | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [loadingProductAction, setLoadingProductAction] = useState<{
    action: 'edit' | 'delete';
    productId: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Pagination for products
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const productsPerPage = 5;
  const [categoryProducts, setCategoryProducts] = useState<ProductInfo[]>([]);

  // Fetch category and products
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setCategoryLoading(true);
        const response = await axios.get<Category[]>(
          API_ENDPOINTS.GET_CATEGORIES
        );
        const foundCategory = response.data.find((c) => c.id === categoryId);
        if (foundCategory) {
          setCategory(foundCategory);
          setCurrentImageUrl(foundCategory.image);
        } else {
          throw new Error('Category not found');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        alert('Failed to load category. Please try again.');
      } finally {
        setCategoryLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductInfo[]>(
          `${API_ENDPOINTS.GET_PRODUCT_INFO}?categoryId=${categoryId}`
        );
        setCategoryProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load products. Please try again.');
      }
    };

    if (categoryId) {
      fetchCategory();
      fetchProducts();
    }
  }, [categoryId]);

  // Handler for input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Modal handlers
  const openModal = () => {
    setIsModalOpen(true);
    setCurrentImageUrl(category.image);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImageUrl('');
  };

  const saveModal = () => {
    setCategory((prev) => ({
      ...prev,
      image: currentImageUrl.trim(),
    }));
    setIsModalOpen(false);
    setCurrentImageUrl('');
  };

  // Validation
  const validateCategory = (category: Category): string | null => {
    if (!category.categoryName.trim()) return 'Category name is required';
    if (!category.description.trim()) return 'Description is required';
    if (!category.image.trim()) return 'Category image is required';
    return null;
  };

  // Product actions
  const handleEditProduct = (productId: string) => {
    setLoadingProductAction({ action: 'edit', productId });
    const product = categoryProducts.find((p) => p.id === productId);
    if (product) {
      const slug = createSlug(product.name);
      navigate(`/products/editProduct/${productId}/${slug}`);
    }
    setLoadingProductAction(null);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoadingProductAction({ action: 'delete', productId });
      try {
        await axios.delete(`${API_ENDPOINTS.DELETE_PRODUCT_INFO}/${productId}`);
        setCategoryProducts((prev) => prev.filter((p) => p.id !== productId));
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      } finally {
        setLoadingProductAction(null);
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setLoading('cancel');
    navigate('/categories/viewCategories');
    setLoading(null);
  };

  // Handle save
  const handleSave = async () => {
    try {
      setLoading('save');

      const categoryToSave: Category = {
        id: categoryId,
        categoryName: category.categoryName.trim(),
        description: category.description.trim(),
        image: category.image.trim(),
      };

      // Validation
      const error = validateCategory(categoryToSave);
      if (error) {
        alert(error);
        setLoading(null);
        return;
      }

      // Call API PUT
      await axios.put(API_ENDPOINTS.PUT_CATEGORY, categoryToSave);
      alert('Category updated successfully!');
      navigate('/categories/viewCategories');
    } catch (error) {
      console.error('Error updating category:', error);
      alert(
        'Failed to update category. Please check your inputs or try again.'
      );
    } finally {
      setLoading(null);
    }
  };

  // Product pagination logic
  const indexOfLastProduct = currentProductPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = categoryProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalProductPages = Math.ceil(
    categoryProducts.length / productsPerPage
  );

  const handleProductPageChange = (pageNumber: number) => {
    setCurrentProductPage(pageNumber);
  };

  // Slug creation utility
  const createSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  if (categoryLoading) {
    return <div>Loading category...</div>;
  }

  return (
    <div className="bg-gray-50">
      <div className="grid grid-cols-1 gap-6">
        {/* Part 1: Category Edit Section */}
        <div className="h-auto w-full rounded-lg bg-white p-4 shadow-sm">
          <div className="w-full border-b-2 pb-3">
            <label className="font-bold">Edit Category</label>
          </div>

          <div className="m-2 grid w-full grid-cols-2 gap-x-5">
            <div className="space-y-10">
              <div>
                <label htmlFor="categoryName">Category Name*</label>
                <input
                  type="text"
                  id="categoryName"
                  value={category.categoryName}
                  onChange={handleInputChange}
                  className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                  placeholder="Enter category name"
                  disabled={loading !== null}
                />
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <label>Image*</label>
                <button
                  onClick={openModal}
                  className="mt-2 h-11 w-full rounded-xl border-2 bg-green-50 pl-3 text-green-700 hover:bg-green-100 focus:border-gray-400 focus:shadow-md focus:outline-none"
                  disabled={loading !== null}
                >
                  Edit Image
                </button>
                {category.image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Current Image:</p>
                    <ul className="list-inside list-disc">
                      <li className="text-sm text-blue-500">
                        <a
                          href={category.image}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {category.image}
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 w-full rounded-xl bg-gray-100 p-3">
            <div>
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                value={category.description}
                onChange={handleInputChange}
                className="mt-2 min-h-[100px] w-full rounded-xl border-2 p-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter category description"
                disabled={loading !== null}
              />
            </div>
          </div>

          {/* Cancel and Save Buttons */}
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

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Edit Category Image</h2>
            <div className="mb-4 flex items-center">
              <input
                type="text"
                value={currentImageUrl}
                onChange={(e) => setCurrentImageUrl(e.target.value)}
                className="h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              />
            </div>
            {currentImageUrl && (
              <div className="mb-4">
                <img
                  src={currentImageUrl}
                  alt="Category Image Preview"
                  className="h-32 w-32 rounded object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      'https://via.placeholder.com/150?text=Invalid+URL')
                  }
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="rounded-3xl border border-gray-500 px-4 py-1 text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveModal}
                className="rounded-3xl bg-green-500 px-4 py-1 text-white hover:bg-green-600"
                disabled={!currentImageUrl.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCategory;
