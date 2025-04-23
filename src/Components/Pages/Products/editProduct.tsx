import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ProductInfo, ProductImage } from '../../../types/productInfo';
import { Category } from '../../../types/category';
import { API_ENDPOINTS } from '../../../service/apiService';

interface EditProductProps {}

const EditProduct: React.FC<EditProductProps> = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductInfo>({
    id: '',
    name: '',
    price: 0,
    description: '',
    quantity: 0,
    categoryId: '',
    productImages: [],
    cpuType: '',
    ramType: '',
    romType: '',
    screenSize: '',
    bateryCapacity: '',
    detailsType: '',
    connectType: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [loading, setLoading] = useState<'save' | 'cancel' | null>(null);
  const [productLoading, setProductLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrls, setModalImageUrls] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setProductLoading(true);
        const response = await axios.get<ProductInfo>(
          `${API_ENDPOINTS.GET_PRODUCT_DETAILS}/${productId}`
        );
        setProducts(response.data);
        setModalImageUrls(
          response.data.productImages
            .map((img) => img.imageUrl)
            .filter((url) => url)
        );
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Failed to load product. Please try again.');
      } finally {
        setProductLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await axios.get<Category[]>(
          API_ENDPOINTS.GET_CATEGORIES
        );
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories. Please try again.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
      fetchCategories();
    }
  }, [productId]);

  // Handler cho input
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setProducts((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Mở modal
  const openModal = () => {
    setIsModalOpen(true);
    setModalImageUrls(products.productImages.map((img) => img.imageUrl));
  };

  // Đóng modal không lưu
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImageUrl('');
    setModalImageUrls(products.productImages.map((img) => img.imageUrl));
  };

  // Thêm URL hình ảnh
  const addImageUrl = () => {
    if (currentImageUrl.trim()) {
      setModalImageUrls((prev) => [...prev, currentImageUrl.trim()]);
      setCurrentImageUrl('');
    }
  };

  // Xóa URL hình ảnh
  const removeImageUrl = (index: number) => {
    setModalImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Lưu hình ảnh từ modal
  const saveModal = () => {
    setProducts((prev) => ({
      ...prev,
      productImages: modalImageUrls.map((url) => ({ imageUrl: url })),
    }));
    setIsModalOpen(false);
    setCurrentImageUrl('');
  };

  // Xử lý hủy
  const handleCancel = () => {
    setLoading('cancel');
    navigate('/products/viewProducts');
    setLoading(null);
  };

  // Validation
  const validateProduct = (product: ProductInfo): string | null => {
    if (!product.name.trim()) return 'Product name is required';
    if (product.price <= 0) return 'Price must be greater than 0';
    if (product.quantity < 0) return 'Quantity cannot be negative';
    if (!product.description.trim()) return 'Description is required';
    if (!product.categoryId) return 'Category is required';
    if (product.productImages.length === 0)
      return 'At least one product image is required';
    return null;
  };

  // Xử lý lưu
  const handleSave = async () => {
    try {
      setLoading('save');

      const productToSave: ProductInfo = {
        id: productId,
        name: products.name,
        price: parseFloat(products.price.toString()),
        description: products.description,
        quantity: parseInt(products.quantity.toString()),
        categoryId: products.categoryId,
        productImages: products.productImages.filter(
          (img) => img.imageUrl.trim() !== ''
        ),
        cpuType: products.cpuType || undefined,
        ramType: products.ramType || undefined,
        romType: products.romType || undefined,
        screenSize: products.screenSize || undefined,
        bateryCapacity: products.bateryCapacity || undefined,
        detailsType: products.detailsType || undefined,
        connectType: products.connectType || undefined,
      };

      // Validation
      const error = validateProduct(productToSave);
      if (error) {
        alert(error);
        setLoading(null);
        return;
      }

      // Gọi API PUT
      await axios.put(API_ENDPOINTS.PUT_PRODUCT_INFO, productToSave);
      alert('Product updated successfully!');
      navigate('/products/viewProducts');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please check your inputs or try again.');
    } finally {
      setLoading(null);
    }
  };

  if (productLoading) {
    return <div>Loading product...</div>;
  }

  return (
    <div>
      <div className="w-full rounded-lg bg-white p-4 shadow-sm">
        <div className="w-full border-b-2 pb-3">
          <label className="font-bold">Edit Product</label>
        </div>
        <div className="m-2 grid w-full grid-cols-2 gap-x-5">
          <div className="space-y-10">
            <div>
              <label htmlFor="name">Product Name*</label>
              <input
                type="text"
                id="name"
                value={products.name}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter product name"
                disabled={loading !== null}
              />
            </div>
            <div>
              <label htmlFor="price">Product Price*</label>
              <input
                type="number"
                id="price"
                value={products.price}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter price"
                min="0"
                step="0.01"
                disabled={loading !== null}
              />
            </div>
            <div>
              <label htmlFor="quantity">Quantity*</label>
              <input
                type="number"
                id="quantity"
                value={products.quantity}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter quantity"
                min="0"
                disabled={loading !== null}
              />
            </div>
            <div>
              <label htmlFor="categoryId">Category*</label>
              <select
                id="categoryId"
                value={products.categoryId}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                disabled={loading !== null || categoriesLoading}
              >
                <option value="">--Select Category--</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id!!}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {categoriesLoading && (
                <p className="mt-1 text-sm text-gray-500">
                  Loading categories...
                </p>
              )}
              {!categoriesLoading && categories.length === 0 && (
                <p className="mt-1 text-sm text-red-500">
                  No categories available
                </p>
              )}
            </div>
          </div>
          <div className="space-y-10">
            <div>
              <label htmlFor="cpuType">CPU Type</label>
              <input
                type="text"
                id="cpuType"
                value={products.cpuType}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter CPU type (e.g., Intel i7, Snapdragon 8)"
                disabled={loading !== null}
              />
            </div>
            <div>
              <label htmlFor="ramType">RAM Type</label>
              <input
                type="text"
                id="ramType"
                value={products.ramType}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter RAM type (e.g., 8GB DDR4)"
                disabled={loading !== null}
              />
            </div>
            <div>
              <label htmlFor="romType">ROM Type</label>
              <input
                type="text"
                id="romType"
                value={products.romType}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter ROM type (e.g., 256GB SSD)"
                disabled={loading !== null}
              />
            </div>
            <div>
              <label htmlFor="screenSize">Screen Size</label>
              <input
                type="text"
                id="screenSize"
                value={products.screenSize}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter screen size (e.g., 15.6 inches)"
                disabled={loading !== null}
              />
            </div>
          </div>
        </div>
        <div className="m-2 mt-10 grid w-full grid-cols-2 gap-x-5">
          <div className="space-y-10">
            <div>
              <label htmlFor="bateryCapacity">Battery Capacity</label>
              <input
                type="text"
                id="bateryCapacity"
                value={products.bateryCapacity}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter battery capacity (e.g., 5000mAh)"
                disabled={loading !== null}
              />
            </div>
            <div>
              <label htmlFor="detailsType">Details Type</label>
              <input
                type="text"
                id="detailsType"
                value={products.detailsType}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter details type (e.g., Technical Specs)"
                disabled={loading !== null}
              />
            </div>
            <div>
              <label htmlFor="connectType">Connect Type</label>
              <input
                type="text"
                id="connectType"
                value={products.connectType}
                onChange={handleInputChange}
                className="mt-2 h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter connect type (e.g., USB-C, Wi-Fi)"
                disabled={loading !== null}
              />
            </div>
          </div>
          <div className="space-y-10">
            <div>
              <label>Images*</label>
              <button
                onClick={openModal}
                className="mt-2 h-11 w-full rounded-xl border-2 bg-green-50 pl-3 text-green-700 hover:bg-green-100 focus:border-gray-400 focus:shadow-md focus:outline-none"
                disabled={loading !== null}
              >
                Edit Images
              </button>
              {products.productImages.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current Images:</p>
                  <ul className="list-inside list-disc">
                    {products.productImages.map((img, index) => (
                      <li key={index} className="text-sm text-blue-500">
                        <a
                          href={img.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {img.imageUrl}
                        </a>
                      </li>
                    ))}
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
              value={products.description}
              onChange={handleInputChange}
              className="mt-2 min-h-[100px] w-full rounded-xl border-2 p-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
              placeholder="Enter product description"
              disabled={loading !== null}
            />
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Edit Product Images</h2>
            <div className="mb-4 flex items-center">
              <input
                type="text"
                value={currentImageUrl}
                onChange={(e) => setCurrentImageUrl(e.target.value)}
                className="h-11 w-full rounded-xl border-2 pl-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              />
              <button
                onClick={addImageUrl}
                className="ml-2 rounded-3xl bg-green-500 px-4 py-1 text-white hover:bg-green-600"
                disabled={!currentImageUrl.trim()}
              >
                Add
              </button>
            </div>
            {modalImageUrls.length > 0 ? (
              <div className="mb-4 max-h-64 overflow-y-auto">
                {modalImageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="mb-2 flex items-center justify-between rounded-lg border p-2"
                  >
                    <div className="flex items-center">
                      <img
                        src={url}
                        alt={`Product Image ${index + 1}`}
                        className="mr-4 h-16 w-16 rounded object-cover"
                        onError={(e) =>
                          (e.currentTarget.src =
                            'https://via.placeholder.com/150?text=Invalid+URL')
                        }
                      />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-xs truncate text-blue-500"
                      >
                        {url}
                      </a>
                    </div>
                    <button
                      onClick={() => removeImageUrl(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-4 text-gray-500">No images added yet.</p>
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

export default EditProduct;
