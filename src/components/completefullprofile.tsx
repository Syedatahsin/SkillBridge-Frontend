"use client";

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

// Define the Category type based on your Prisma Schema
interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategorySelector({ form }: { form: any }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch categories from your GET route
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/get");
        const data = await res.json();
        if (res.ok) {
          setCategories(data); // Expecting an array of categories
        }
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="flex gap-2 text-gray-500 text-sm"><Loader2 className="animate-spin size-4" /> Loading subjects...</div>;

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
        Select Expertise Categories
      </label>
      
      {/* 2. Map through categories and handle ID selection */}
      <form.Field name="categoryIds">
        {(field: any) => (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => {
              const isSelected = field.state.value.includes(category.id);
              
              return (
                <div
                  key={category.id}
                  onClick={() => {
                    const currentIds = field.state.value;
                    const nextIds = isSelected
                      ? currentIds.filter((id: string) => id !== category.id)
                      : [...currentIds, category.id];
                    
                    // This stores the actual UUID in the form
                    field.handleChange(nextIds);
                  }}
                  className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? "bg-purple-600/10 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.1)]" 
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  {isSelected && <Check className="size-4 text-purple-500" />}
                </div>
              );
            })}
          </div>
        )}
      </form.Field>
    </div>
  );
}