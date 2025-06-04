import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useSales } from '@/hooks/useSales';
import { Sale, SaleItem } from '@/types';
import { SaleCard } from '@/components/sales/SaleCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';

export function SalesHistory() {
  const { getTodaySales, getWeekSales, getMonthSales } = useSales();
  const [searchQuery, setSearchQuery] = useState('');
  
  const todaySales = getTodaySales();
  const weekSales = getWeekSales();
  const monthSales = getMonthSales();

  // Filter sales based on search query
  const filterSales = (sales: Sale[]) => {
    if (!searchQuery.trim()) return sales;
    
    return sales.filter((sale: Sale) => 
      // Search by ID
      sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Search by products
      sale.items.some((item: SaleItem) => 
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filteredTodaySales = filterSales(todaySales);
  const filteredWeekSales = filterSales(weekSales);
  const filteredMonthSales = filterSales(monthSales);

  // Calculate totals
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const weekTotal = weekSales.reduce((sum, sale) => sum + sale.total, 0);
  const monthTotal = monthSales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <Layout title="Historial de Ventas">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Historial de Ventas</h2>
          
          <div className="relative w-full md:w-64">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ventas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="today">
              Hoy
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-secondary">
                ${todayTotal.toFixed(2)}
              </span>
            </TabsTrigger>
            <TabsTrigger value="week">
              Esta Semana
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-secondary">
                ${weekTotal.toFixed(2)}
              </span>
            </TabsTrigger>
            <TabsTrigger value="month">
              Este Mes
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-secondary">
                ${monthTotal.toFixed(2)}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="mt-0">
            {filteredTodaySales.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No hay ventas para mostrar
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTodaySales.map((sale: Sale) => (
                  <SaleCard key={sale.id} sale={sale} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="week" className="mt-0">
            {filteredWeekSales.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No hay ventas para mostrar
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWeekSales.map((sale: Sale) => (
                  <SaleCard key={sale.id} sale={sale} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="month" className="mt-0">
            {filteredMonthSales.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No hay ventas para mostrar
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMonthSales.map((sale: Sale) => (
                  <SaleCard key={sale.id} sale={sale} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}