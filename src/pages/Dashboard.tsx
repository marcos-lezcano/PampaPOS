import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { ProductCard } from '@/components/products/ProductCard';

export function Dashboard() {
  const { products, loading: productsLoading } = useProducts();
  const { 
    getTodaySales, 
    getWeekSales, 
    getMonthSales, 
    loading: salesLoading 
  } = useSales();

  // Si está cargando, mostramos el estado de carga
  if (productsLoading || salesLoading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground text-lg animate-pulse">Cargando dashboard...</div>
        </div>
      </Layout>
    );
  }

  // Obtener datos de ventas
  const todaySales = getTodaySales();
  const weekSales = getWeekSales();
  const monthSales = getMonthSales();

  // Calcular totales
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const weekTotal = weekSales.reduce((sum, sale) => sum + sale.total, 0);
  const monthTotal = monthSales.reduce((sum, sale) => sum + sale.total, 0);

  // Get products with low stock
  const lowStockProducts = products.filter(product => product.stock <= 5);

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ventas de Hoy</CardTitle>
              <Icons.ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${todayTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {todaySales.length} venta{todaySales.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ventas de la Semana</CardTitle>
              <Icons.CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${weekTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {weekSales.length} venta{weekSales.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
              <Icons.TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {monthSales.length} venta{monthSales.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Icons.Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                {lowStockProducts.length} con stock bajo
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick access section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Productos con Stock Bajo</h2>
          
          {lowStockProducts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No hay productos con stock bajo
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lowStockProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  mode="catalog"
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Recent sales section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Ventas Recientes</h2>
          
          {todaySales.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No hay ventas recientes
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {todaySales.slice(0, 5).map(sale => (
                    <div key={sale.id} className="flex justify-between border-b pb-4 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium">Venta #{sale.id.slice(-5)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(sale.date).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <p className="font-semibold">${sale.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}