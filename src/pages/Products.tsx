import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/products/ProductGrid';
import ProductForm from '@/components/products/ProductForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Product } from '@/types';
import { Icons } from '@/components/ui/icons';
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
import { useToast } from '@/components/ui/use-toast';

export function Products() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  const { addToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Manejo de estados de carga y error
  if (loading) {
    return (
      <Layout title="Productos">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex items-center gap-2">
            <Icons.Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-muted-foreground">Cargando productos...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Productos">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
          <div className="text-destructive flex items-center gap-2">
            <Icons.AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <Icons.RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </Layout>
    );
  }

  const handleOpenForm = (product?: Product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedProduct(undefined);
    setFormOpen(false);
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      if (selectedProduct) {
        // Update existing product
        await updateProduct(selectedProduct.id, productData);
        addToast({
          title: 'Producto actualizado',
          children: 'El producto ha sido actualizado exitosamente.',
        });
      } else {
        // Add new product
        await addProduct(productData);
        addToast({
          title: 'Producto agregado',
          children: 'El producto ha sido agregado exitosamente.',
        });
      }
    } catch (error) {
      addToast({
        title: 'Error',
        children: 'Ha ocurrido un error al guardar el producto.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete);
      addToast({
        title: 'Producto eliminado',
        children: 'El producto ha sido eliminado exitosamente.',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        children: 'Ha ocurrido un error al eliminar el producto.',
        variant: 'destructive',
      });
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <Layout title="Productos">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Catálogo de Productos</h2>
        <Button onClick={() => handleOpenForm()}>
          <Icons.Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>
      
      <ProductGrid 
        products={products} 
        onEdit={handleOpenForm}
        onDelete={(id) => setProductToDelete(id)}
      />
      
      <Dialog open={formOpen} onOpenChange={(open) => { if (!open) handleCloseForm(); }}>
  <DialogTrigger asChild>
    <Button onClick={() => handleOpenForm()}>
      <Icons.Plus className="h-4 w-4 mr-2" />
      Agregar Producto
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
      <DialogDescription>
        {selectedProduct ? 'Actualizá los datos del producto' : 'Completá los campos para crear un nuevo producto.'}
      </DialogDescription>
    </DialogHeader>
    <ProductForm
      defaultValues={selectedProduct}
      onSubmit={async (values) => {
        await handleSaveProduct(values);
        handleCloseForm();
      }}
      loading={loading}
    />
    <DialogFooter>
      <Button variant="outline" onClick={handleCloseForm}>Cancelar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
      
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}