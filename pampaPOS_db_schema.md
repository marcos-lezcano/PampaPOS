
# 📊 Estructura de Base de Datos – PampaPOS (Supabase)

Estás utilizando **Supabase** con base de datos **PostgreSQL**, y tu modelo está orientado a múltiples negocios (multi-tenant). Esta es la estructura actual de tus tablas:

---

## 🔹 `businesses`
Almacena los diferentes negocios o unidades comerciales (cafeterías, locales, etc.)

```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
address TEXT
created_at TIMESTAMP
```

---

## 🔹 `users`
Usuarios que pertenecen a un negocio. Pueden ser administradores o mozos.

```sql
id UUID PRIMARY KEY
email TEXT UNIQUE NOT NULL
full_name TEXT
role TEXT CHECK ('admin', 'waiter') DEFAULT 'waiter'
business_id UUID REFERENCES businesses(id)
```

---

## 🔹 `products`
Productos asociados a un negocio específico.

```sql
id UUID PRIMARY KEY
business_id UUID REFERENCES businesses(id)
name TEXT NOT NULL
price NUMERIC(10,2) NOT NULL
stock INTEGER
created_at TIMESTAMP
```

---

## 🔹 `sales`
Cada venta registrada en el sistema.

```sql
id UUID PRIMARY KEY
business_id UUID REFERENCES businesses(id)
user_id UUID REFERENCES users(id)
total NUMERIC(10,2)
created_at TIMESTAMP
```

---

## 🔹 `sale_items`
Detalle de cada producto vendido en una venta. Relaciona `sales` y `products`.

```sql
id UUID PRIMARY KEY
sale_id UUID REFERENCES sales(id)
product_id UUID REFERENCES products(id)
quantity INTEGER NOT NULL
unit_price NUMERIC(10,2) NOT NULL
```

---

## 🔹 `cash_movements`
Movimientos de caja (ingresos o egresos) asociados al negocio.

```sql
id UUID PRIMARY KEY
business_id UUID REFERENCES businesses(id)
type TEXT CHECK ('income', 'expense')
amount NUMERIC(10,2) NOT NULL
description TEXT
created_at TIMESTAMP
```

---

## 🧠 Notas para el desarrollo

- Todas las operaciones deben estar **asociadas a un `business_id`**.
- Las relaciones son 1:N excepto `sale_items`, que funciona como una relación indirecta muchos a muchos.
- El sistema está diseñado para **escala horizontal por comercio**.
