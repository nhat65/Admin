export interface ProductInfo {
    id?: string | null;
    name: string;
    price: number;
    description: string;
    quantity: number;
    categoryId: string;
    productImages: ProductImage[];
    CpuType?: string;
    RamType?: string;
    RomType?: string;
    ScreenSize?: string;
    BateryCapacity?: string;
    DetailsType?: string;
    ConnectType?: string;
  }
  export interface CartProductInfo extends ProductInfo {
    cartQuantity: number; // Số lượng sản phẩm trong giỏ hàng
  }
  
  export interface ProductImage {
    imageUrl: string;
  }