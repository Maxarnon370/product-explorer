"use client";

import { useEffect, useState } from "react";
// import { useState } from "react";
import ProductForm from "./ProductForm";
import ProductSearchForm from "./ProductSearchForm";
import type { Product, ProductDraft, SearchQuery } from "../lib/products";
import { defaultQuery, fetchProducts } from "../lib/products";

// type LoadState = "idle" | "loading" | "error" | "ready";
type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
    const [products, setProducts] = useState<Product[]>([]);
    // const [status, setStatus] = useState<LoadState>("idle");
    const [status, setStatus] = useState<LoadState>("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        loadProducts(defaultQuery);
    }, []);

    async function loadProducts(query: SearchQuery) {
        setStatus("loading");
        try {
            const data = await fetchProducts(query);
            setProducts(data.products);
            setStatus("ready");
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
            );
            setStatus("error");
        }
    }

    function saveProduct(draft: ProductDraft) {
        setProducts([...products, { ...draft, id: Date.now() }]);
    }

    return (
        <main className="min-h-screen bg-gray-50/50 text-gray-900 p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* ฟอร์มค้นหา */}
                <ProductSearchForm onSearch={loadProducts} />

                {/* ฟอร์มเพิ่มสินค้า */}
                <ProductForm editing={null} onSave={saveProduct} onCancel={() => { }} />

                {/* ส่วนแสดงตารางข้อมูล */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-800 text-sm tracking-wide uppercase">
                            รายการสินค้าทั้งหมด
                        </h2>
                        <button
                            type="button"
                            onClick={() => loadProducts(defaultQuery)}
                            disabled={status === "loading"}
                            className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs"
                        >
                            {status === "loading" ? "กำลังโหลด..." : "โหลดข้อมูลใหม่"}
                        </button>
                    </div>

                    {status === "loading" && (
                        <p className="p-12 text-center text-sm text-gray-400">
                            กำลังโหลดข้อมูลสินค้า...
                        </p>
                    )}

                    {status === "error" && (
                        <p className="p-12 text-center text-sm text-red-500">
                            {errorMessage}
                        </p>
                    )}

                    {status === "ready" && products.length === 0 && (
                        <p className="p-12 text-center text-sm text-gray-400">
                            ไม่พบรายการสินค้าที่ค้นหา
                        </p>
                    )}

                    {status === "ready" && products.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-semibold tracking-wider border-b border-gray-100">
                                        <th className="py-3.5 px-5">รูปสินค้า</th>
                                        <th className="py-3.5 px-5">ชื่อสินค้า</th>
                                        <th className="py-3.5 px-5">ราคา</th>
                                        <th className="py-3.5 px-5">คงเหลือ</th>
                                        <th className="py-3.5 px-5">หมวดหมู่</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {products.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50/80 transition-colors"
                                        >
                                            <td className="py-3 px-5">
                                                {item.thumbnail ? (
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        className="w-11 h-11 object-cover rounded-xl border border-gray-200 bg-gray-50"
                                                    />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-[10px] text-gray-400">
                                                        ไม่มีรูป
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-5 font-semibold text-gray-800">
                                                {item.title}
                                            </td>
                                            <td className="py-3.5 px-5 text-gray-900 font-semibold">
                                                ${item.price}
                                            </td>
                                            <td className="py-3.5 px-5 text-gray-500">
                                                {item.stock ?? "-"}
                                            </td>
                                            <td className="py-3.5 px-5">
                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                                    {item.category}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}