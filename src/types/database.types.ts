// Tipos para la base de datos

export type UserRole = 'admin' | 'user' | 'cashier';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  business_id: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  business_id: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  stock: number;
  sku: string | null;
  barcode: string | null;
  image_url: string | null;
  category_id: string | null;
  business_id: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface InsertProduct {
  id?: string;
  name: string;
  description?: string | null;
  price: number;
  cost?: number | null;
  stock?: number;
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
  total_amount: number;
  payment_method: string;
  status: 'completed' | 'pending' | 'cancelled';
  customer_id: string | null;
  business_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
  customer?: Customer;
  items?: SaleItem[];
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  business_id: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  quantity: number;
  movement_type: 'in' | 'out';
  notes: string | null;
  user_id: string;
  business_id: string;
  created_at: string;
  updated_at: string;
  product?: Product;
  user?: UserProfile;
}

// Tipos para las funciones RPC
declare global {
  namespace Supabase {
    interface Database {
      public: {
        Functions: {
          increment_stock: {
            Args: { product_id: string; amount: number };
            Returns: Product;
          };
          decrement_stock: {
            Args: { product_id: string; amount: number };
            Returns: Product;
          };
        };
      };
    }
  }
}
