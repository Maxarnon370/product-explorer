"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "../lib/products";
import type { Product, ProductDraft } from "../lib/products";

type ProductFormProps = {
    editing: Product | null;
    onSave: (draft: ProductDraft) => void;
    onCancel: () => void;
};

export default function ProductForm({ editing, onSave, onCancel }: ProductFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isValid },
    } = useForm<ProductDraft>({
        resolver: zodResolver(ProductDraftSchema),
        mode: "onTouched",
        defaultValues: editing
            ? {
                title: editing.title,
                price: editing.price,
                stock: editing.stock,
                category: editing.category,
            }
            : { title: "", price: undefined, stock: undefined },
    });

    function saveProduct(values: ProductDraft) {
        onSave(values);
        reset();
    }

    return (
        <form
            onSubmit={handleSubmit(saveProduct)}
            noValidate
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5 mb-8"
        >
            <h2 className="text-base font-bold text-gray-900 tracking-tight border-b border-gray-100 pb-3">
                {editing ? "แก้ไขรายการสินค้า" : "เพิ่มรายการสินค้าใหม่"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        ชื่อสินค้า
                    </label>
                    <input
                        id="title"
                        {...register("title")}
                        placeholder="ระบุชื่อสินค้า"
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-400 transition"
                    />
                    {errors.title && (
                        <span className="text-xs text-red-500">{errors.title.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="price" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        ราคา ($)
                    </label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("price", { valueAsNumber: true })}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-400 transition"
                    />
                    {errors.price && (
                        <span className="text-xs text-red-500">{errors.price.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        หมวดหมู่
                    </label>
                    <select
                        id="category"
                        {...register("category")}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-400 transition"
                    >
                        <option value="">เลือกหมวดหมู่...</option>
                        {CATEGORIES.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <span className="text-xs text-red-500">{errors.category.message}</span>
                    )}
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={!isDirty || !isValid}
                    className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium px-6 py-2 rounded-xl text-sm transition shadow-sm"
                >
                    {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                </button>
                {editing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-xl text-sm transition"
                    >
                        ยกเลิก
                    </button>
                )}
            </div>
        </form>
    );
}