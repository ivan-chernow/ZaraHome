"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Discount from "./Discount";
import New from "./ui/New";
import type { Product } from "@/api/products.api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface NavMenuProductCardProps {
  product: Product;
}

const NavMenuProductCard: React.FC<NavMenuProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        className="group cursor-pointer"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={`${API_URL}${product.img[0]}`}
              alt={product.name_ru}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Индикаторы скидки и новинки в левом верхнем углу */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <New />}
            {product.discount !== undefined &&
              product.discount !== null &&
              product.discount > 0 && <Discount discount={product.discount} />}
          </div>

          <div className="mt-4">
            <h3 className="mt-1 text-lg font-medium text-gray-900 line-clamp-2">
              {product.name_ru}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">
              {product.name_eng}
            </p>
            <div className="mt-2">
              <span className="text-lg font-bold text-gray-900">
                {Object.values(product.size)
                  .find((s) => s.price)
                  ?.price?.toLocaleString("ru-RU")}{" "}
                ₽
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default NavMenuProductCard;
