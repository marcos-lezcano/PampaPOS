import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/types/index';

const productSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  price: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0'),
  stock: z.coerce.number().min(0, 'El stock debe ser mayor o igual a 0'),
  description: z.string().optional().nullable(),
  image_url: z.string().url('Debe ser una URL válida').optional().nullable(),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  loading?: boolean;
}

export default function ProductForm({ defaultValues, onSubmit, loading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium">Nombre</label>
        <input
          type="text"
          {...register('name')}
          className="input"
          disabled={loading}
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>
      <div>
        <label className="block font-medium">Precio</label>
        <input
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          className="input"
          disabled={loading}
        />
        {errors.price && <span className="text-red-500">{errors.price.message}</span>}
      </div>
      <div>
        <label className="block font-medium">Stock</label>
        <input
          type="number"
          {...register('stock', { valueAsNumber: true })}
          className="input"
          disabled={loading}
        />
        {errors.stock && <span className="text-red-500">{errors.stock.message}</span>}
      </div>
      <div>
        <label className="block font-medium">Descripción</label>
        <textarea
          {...register('description')}
          className="input"
          disabled={loading}
        />
        {errors.description && <span className="text-red-500">{errors.description.message}</span>}
      </div>
      <div>
        <label className="block font-medium">Imagen (URL)</label>
        <input
          type="url"
          {...register('image_url')}
          className="input"
          disabled={loading}
        />
        {errors.image_url && <span className="text-red-500">{errors.image_url.message}</span>}
      </div>
      <div>
        <label className="block font-medium">SKU</label>
        <input
          type="text"
          {...register('sku')}
          className="input"
          disabled={loading}
        />
        {errors.sku && <span className="text-red-500">{errors.sku.message}</span>}
      </div>
      <div>
        <label className="block font-medium">Código de barras</label>
        <input
          type="text"
          {...register('barcode')}
          className="input"
          disabled={loading}
        />
        {errors.barcode && <span className="text-red-500">{errors.barcode.message}</span>}
      </div>
      <div>
        <label className="block font-medium">Categoría</label>
        <input
          type="text"
          {...register('category_id')}
          className="input"
          disabled={loading}
        />
        {errors.category_id && <span className="text-red-500">{errors.category_id.message}</span>}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar producto'}
      </button>
    </form>
  );
}
