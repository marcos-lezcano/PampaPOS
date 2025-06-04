import { useTicket } from '@/context/TicketContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/ui/icons';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { useSales } from '@/hooks/useSales';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function TicketSummary() {
  const { items, totalAmount, clearTicket } = useTicket();
  const { addSale } = useSales();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  const isEmpty = items.length === 0;

  const handleFinalizeSale = async () => {
    if (isEmpty) return;
    
    setIsProcessing(true);
    try {
      const saleItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        product: item.product
      }));

      await addSale({
        items: saleItems,
        total: totalAmount,
        created_at: new Date().toISOString(),
        business_id: '1'
      });
      toast({
        title: 'Venta finalizada',
        description: `Venta por $${totalAmount.toFixed(2)} procesada correctamente.`,
      });
      clearTicket();
    } catch (error) {
      toast({
        title: 'Error al procesar la venta',
        description: 'Hubo un problema al procesar la venta. Intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Card className="sticky top-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Resumen de Ticket</h3>
            {!isEmpty && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive"
                onClick={() => setShowClearDialog(true)}
              >
                <Icons.Trash2 className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
          
          {isEmpty ? (
            <div className="py-8 text-center text-muted-foreground">
              <Icons.ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>El ticket está vacío</p>
              <p className="text-sm">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impuestos:</span>
                <span>$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            size="lg"
            disabled={isEmpty || isProcessing}
            onClick={handleFinalizeSale}
          >
            {isProcessing ? 'Procesando...' : 'Finalizar Venta'}
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar todos los productos?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán todos los productos del ticket actual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                clearTicket();
                setShowClearDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}