import { Card, CardBody, Button } from "@/components/common";

interface ProductTableProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  onStockChange: (product: any, newStock: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onStockChange,
}) => {
  if (products.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <p className="text-slate-500">
            No products yet. Add your first product above!
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">
                Product
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">
                Price
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">
                Stock
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">
                Status
              </th>
              <th className="px-6 py-3 text-right font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {product.description}
                  </p>
                </td>
                <td className="px-6 py-4 text-slate-900 font-medium">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onStockChange(product, product.stock - 1)}
                      className="h-7 w-7 rounded border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                      disabled={product.stock <= 0}
                    >
                      −
                    </button>
                    <span className="inline-flex w-10 justify-center font-mono text-slate-900">
                      {product.stock}
                    </span>
                    <button
                      onClick={() => onStockChange(product, product.stock + 1)}
                      className="h-7 w-7 rounded border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      product.stock > 5
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock > 5
                      ? "In Stock"
                      : product.stock > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
