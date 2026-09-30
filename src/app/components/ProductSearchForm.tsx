"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "../lib/products";
import type { SearchQuery } from "../lib/products";

type ProductSearchFormProps = {
    onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SearchQuery>({
        resolver: zodResolver(SearchQuerySchema),
        mode: "onTouched",
        defaultValues: defaultQuery,
    });

    return (
        <form
            onSubmit={handleSubmit(onSearch)}
            noValidate
            className="bg-white p-5 rounded-2xl mb-6 border border-gray-200 shadow-sm flex flex-wrap gap-4 items-end"
        >
            <div className="flex flex-col gap-1.5">
                <label htmlFor="q" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    คำค้น
                </label>
                <input
                    id="q"
                    {...register("q")}
                    placeholder="ค้นหาสินค้า..."
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-400 transition"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="limit" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    จำนวนรายการ
                </label>
                <input
                    id="limit"
                    type="number"
                    {...register("limit", { valueAsNumber: true })}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-800 w-28 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-400 transition"
                />
                {errors.limit && (
                    <span className="text-xs text-red-500">{errors.limit.message}</span>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="sortBy" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    เรียงตาม
                </label>
                <select
                    id="sortBy"
                    {...register("sortBy")}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-400 transition"
                >
                    {SORT_FIELDS.map((field) => (
                        <option key={field} value={field}>
                            {field}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-medium px-6 py-2 rounded-xl text-sm transition shadow-sm"
            >
                {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
            </button>
        </form>
    );
}