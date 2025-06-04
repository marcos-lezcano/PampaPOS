export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  sku?: string | null;
  barcode?: string | null;
  image_url?: string | null;
  category_id?: string | null;
  business_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  id: string;
  total: number;
  items: SaleItem[];
  created_at: string;
  business_id: string;
}

export interface SaleItem {
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface TicketItem {
  product: Product;
  quantity: number;
}
