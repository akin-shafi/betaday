// app/products/page.tsx
"use client";
import dynamic from "next/dynamic";

// Dynamically import the ProductsClient component with SSR disabled
const ProductsClient = dynamic(() => import("./ProductsClient"), {
  ssr: false,
});

export default function ProductsPage() {
  return <ProductsClient />;
}
