import { Layout } from '@/components/layout/Layout';
import { useProducts } from '@/hooks/useProducts';
import { useTicket } from '@/context/TicketContext';
import { ProductGrid } from '@/components/products/ProductGrid';
import { TicketItem } from '@/components/sales/TicketItem';
import { TicketSummary } from '@/components/sales/TicketSummary';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NewSale() {
  const { products, loading } = useProducts();
  const { items } = useTicket();

  // Group products by some categories for demo purposes
  const drinks = products.filter(p => 
    p.name.toLowerCase().includes('café') || 
    p.name.toLowerCase().includes('jugo') ||
    p.name.toLowerCase().includes('agua')
  );
  
  const food = products.filter(p => 
    p.name.toLowerCase().includes('sandwich') || 
    p.name.toLowerCase().includes('croissant')
  );

  return (
    <Layout title="Nueva Venta">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product catalog section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="drinks">Bebidas</TabsTrigger>
              <TabsTrigger value="food">Comidas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <ProductGrid products={products} mode="ticket" />
            </TabsContent>
            
            <TabsContent value="drinks" className="mt-0">
              <ProductGrid products={drinks} mode="ticket" />
            </TabsContent>
            
            <TabsContent value="food" className="mt-0">
              <ProductGrid products={food} mode="ticket" />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Current ticket section */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div className="rounded-md border border-border">
              <div className="p-4 font-medium">
                Ticket Actual
                {items.length > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({items.length} item{items.length !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
              <Separator />
              
              {items.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="p-4">
                    {items.map((item) => (
                      <TicketItem key={item.product.id} item={item} />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No hay productos en el ticket
                </div>
              )}
            </div>
            
            <TicketSummary />
          </div>
        </div>
      </div>
    </Layout>
  );
}