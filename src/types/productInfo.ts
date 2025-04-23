export interface ProductInfo {
    id?: string | null;
    name: string;
    price: number;
    description: string;
    quantity: number;
    categoryId: string;
    productImages: ProductImage[];
    cpuType?: string;
    ramType?: string;
    romType?: string;
    screenSize?: string;
    bateryCapacity?: string;
    detailsType?: string;
    connectType?: string;
  }

  export interface ProductImage {
    imageUrl: string;
  }