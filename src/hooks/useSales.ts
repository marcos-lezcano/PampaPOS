import { useState, useEffect } from 'react';
import { Sale } from '@/types';
import { supabase } from '@/lib/supabase';

// Sample data for development
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

const sampleSales: Sale[] = [
  {
    id: '1',
    created_at: today.toISOString(),
    items: [
      {
        product: {
          id: '1',
          name: 'Café Americano',
          price: 2.50,
          imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
          stock: 100
        },
        quantity: 2
      },
      {
        product: {
          id: '2',
          name: 'Café Latte',
          price: 3.50,
          imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
          stock: 100
        },
        quantity: 1
      }
    ],
    total: 8.50
  },
  {
    id: '2',
    created_at: yesterday.toISOString(),
    items: [
      {
        product: {
          id: '3',
          name: 'Croissant',
          price: 2.00,
          imageUrl: 'https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg',
          stock: 20
        },
        quantity: 3
      },
      {
        product: {
          id: '4',
          name: 'Sandwich de Jamón y Queso',
          price: 4.50,
          imageUrl: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg',
          stock: 15
        },
        quantity: 1
      }
    ],
    total: 10.50
  },
  {
    id: '3',
    created_at: lastWeek.toISOString(),
    items: [
      {
        product: {
          id: '5',
          name: 'Jugo de Naranja',
          price: 3.00,
          imageUrl: 'https://images.pexels.com/photos/1536868/pexels-photo-1536868.jpeg',
          stock: 30
        },
        quantity: 2
      }
    ],
    total: 6.00
  }
];

export function useSales() {
  const [sales, setSales] = useState<Sale[]>(sampleSales);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to load sales from Supabase (currently using sample data)
  const loadSales = async () => {
    setLoading(true);
    try {
      // When Supabase is connected, replace this with actual fetch
      // const { data, error } = await supabase.from('sales').select('*');
      // if (error) throw error;
      // setSales(data);
      
      // Currently just simulating a fetch delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setSales(sampleSales);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new sale
  const addSale = async (sale: Omit<Sale, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      // When Supabase is connected, replace this with actual insert
      // const { data, error } = await supabase.from('sales').insert({...sale, date: new Date()}).select('*').single();
      // if (error) throw error;

      const newSale = {
        ...sale,
        id: Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString()
      };
      
      setSales([newSale, ...sales]);
      return newSale;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Filter sales by date
  const getTodaySales = () => {
    const today = new Date();
    return sales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate.toDateString() === today.toDateString();
    });
  };

  const getWeekSales = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= lastWeek && saleDate <= today;
    });
  };

  const getMonthSales = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= firstDayOfMonth && saleDate <= today;
    });
  };

  // Load sales on component mount
  useEffect(() => {
    loadSales();
  }, []);

  return {
    sales,
    loading,
    error,
    loadSales,
    addSale,
    getTodaySales,
    getWeekSales,
    getMonthSales
  };
}