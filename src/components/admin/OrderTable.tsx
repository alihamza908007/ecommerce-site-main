import { Card, CardBody, Button, Badge } from "@/components/common";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: string;
  createdAt: Date | string;
  items: OrderItem[];
}

interface OrderTableProps {
  orders: Order[];
  onUpdateStatus: (id: string, newStatus: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onUpdateStatus,
  onDelete,
  isLoading = false,
}) => {
  if (orders.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <p className="text-slate-500">No orders yet.</p>
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
                Order ID
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">
                Customer
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">
                Email
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">
                Total
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">
                Items
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <code className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {order.id.slice(0, 8)}...
                  </code>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 text-slate-600 text-xs">
                  {order.email}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                    <div className="mt-1 text-slate-500">
                      {order.items.map((item) => (
                        <div key={item.id}>
                          {item.quantity}x {item.productName}
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium border ${
                      order.status === "fulfilled"
                        ? "bg-green-50 border-green-300 text-green-800"
                        : order.status === "processing"
                          ? "bg-blue-50 border-blue-300 text-blue-800"
                          : "bg-yellow-50 border-yellow-300 text-yellow-800"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="fulfilled">Fulfilled</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(order.id)}
                      disabled={isLoading}
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
