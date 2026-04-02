"use client";

import { FormEvent, useState, useEffect } from "react";
import { Card, CardBody, Button, Alert } from "@/components/common";

interface ProductFormProps {
  isEditing: boolean;
  initialData?: {
    name: string;
    description: string;
    price: string;
    stock: string;
    imageUrl: string;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  feedback?: { type: "success" | "error"; message: string } | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isEditing,
  initialData,
  onSubmit,
  onCancel,
  isSaving,
  feedback,
}) => {
  const [formState, setFormState] = useState(
    initialData || {
      name: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "",
    },
  );

  // Update form state when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormState(initialData);
    } else {
      setFormState({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name: formState.name,
      description: formState.description,
      price: parseFloat(formState.price),
      stock: parseInt(formState.stock || "0"),
      images: formState.imageUrl ? [formState.imageUrl] : [],
    };
    await onSubmit(payload);
  };

  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          {isEditing && (
            <button
              onClick={onCancel}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {feedback && (
          <Alert
            type={feedback.type}
            message={feedback.message}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter product name"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Image URL
              </label>
              <input
                type="url"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="https://example.com/image.jpg"
                value={formState.imageUrl}
                onChange={(e) =>
                  setFormState({ ...formState, imageUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Price *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0.00"
                value={formState.price}
                onChange={(e) =>
                  setFormState({ ...formState, price: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Stock
              </label>
              <input
                type="number"
                min="0"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
                value={formState.stock}
                onChange={(e) =>
                  setFormState({ ...formState, stock: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter product description"
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSaving} isLoading={isSaving}>
              {isEditing ? "Save Changes" : "Add Product"}
            </Button>
            {isEditing && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
