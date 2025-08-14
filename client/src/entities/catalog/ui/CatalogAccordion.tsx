"use client";
import React, { useEffect, useMemo } from "react";
import HorizontalLine from "@/shared/ui/HorizontalLine";
import { AnimatePresence, motion } from "framer-motion";
import {
  toggleCategory,
  toggleSubCategory,
  expandCategory,
  expandSubCategory,
} from "@/entities/category/model/catalog.slice";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import {
  categoryAnimation,
  productAnimation,
  subCategoryAnimation,
} from "@/shared/lib/animation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/shared/config/store/store";
import { useGetCatalogQuery } from "@/api/products.api";
import Link from "next/link";
import slugify from "slugify";
import Skeleton from "@mui/material/Skeleton";
import { usePathname } from "next/navigation";

const CatalogAccordion = () => {
  const { expandedCategories, expandedSubCategories } = useSelector(
    (state: RootState) => state.catalog
  );
  const dispatch = useDispatch();
  const { data: categories, isLoading } = useGetCatalogQuery();

  const customSlugify = (text: string) =>
    slugify(text.replace(/й/g, "y").replace(/и$/g, "i"), {
      lower: true,
      strict: true,
    });

  // Автораскрытие категории/подкатегории по URL
  const pathname = usePathname();
  const urlParts = useMemo(
    () => decodeURI(pathname).split("/").filter(Boolean),
    [pathname]
  );

  useEffect(() => {
    if (!categories || isLoading) return;
    if (urlParts[0] !== "products" || urlParts[1] !== "category") return;
    const categorySlug = urlParts[2];
    if (!categorySlug) return;
    const category = categories.find(
      (c) => customSlugify(c.name) === categorySlug
    );
    if (!category) return;

    if (!expandedCategories[category.id]) {
      dispatch(expandCategory(category.id.toString()));
    }

    const subSlug = urlParts[3];
    if (subSlug) {
      const sub = category.subCategories.find(
        (s) => customSlugify(s.name) === subSlug
      );
      if (sub && !expandedSubCategories[sub.id]) {
        dispatch(expandSubCategory(sub.id.toString()));
      }
    }
  }, [categories, isLoading, urlParts, expandedCategories, expandedSubCategories, dispatch]);

  return (
    <div className="max-w-[294px] relative">
      <div className="flex items-center mb-[15px]">
        <h3 className="font-medium text-[#0000004D]">Каталог товаров</h3>
        <HorizontalLine width="50px" />
      </div>
      <nav>
        <ul className="flex flex-col">
          {isLoading && (
            <>
              {Array.from({ length: 6 }).map((_, idx) => (
                <li key={idx} className="mb-[35px]">
                  <div className="flex items-center">
                    <div className="w-[11px] h-[11px] bg-gray-200 mr-[12px] rounded" />
                    <Skeleton variant="text" width={160} height={24} />
                  </div>
                  <div className="ml-8 mt-2 space-y-2">
                    {Array.from({ length: 3 }).map((__, j) => (
                      <Skeleton
                        key={j}
                        variant="text"
                        width={120}
                        height={18}
                      />
                    ))}
                  </div>
                </li>
              ))}
            </>
          )}

          {!isLoading &&
            categories
              ?.filter(
                (category) =>
                  category.name !== "Новинки" && category.name !== "Скидки"
              )
              .map((category) => (
                <li key={category.id} className="mb-[35px]">
                  <div
                    className="flex items-center cursor-pointer font-medium text-[18px]"
                    onClick={() =>
                      dispatch(toggleCategory(category.id.toString()))
                    }
                  >
                    <motion.div
                      className="w-[11px] h-[11px] bg-black flex items-center justify-center mr-[12px] category-toggle-icon"
                      animate={{
                        rotate: expandedCategories[category.id] ? 90 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <KeyboardArrowRightOutlinedIcon
                        fontSize="small"
                        sx={{ color: "white" }}
                      />
                    </motion.div>
                    <span className="flex-grow">{category.name}</span>
                  </div>

                  <AnimatePresence>
                    {expandedCategories[category.id] && (
                      <motion.ul
                        className="ml-8 mt-2 overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={categoryAnimation}
                      >
                        {category.subCategories
                          .slice()
                          .sort((a, b) => {
                            const aHasTypes =
                              Array.isArray(a.types) && a.types.length > 0;
                            const bHasTypes =
                              Array.isArray(b.types) && b.types.length > 0;
                            return aHasTypes === bHasTypes
                              ? 0
                              : aHasTypes
                              ? -1
                              : 1;
                          })
                          .map((subCategory) => {
                            const categorySlug = customSlugify(category.name);
                            const subCategorySlug = customSlugify(
                              subCategory.name
                            );
                            const subCategoryLink = `/products/category/${categorySlug}/${subCategorySlug}`;

                            return (
                              <li key={subCategory.id} className="mb-2">
                                <div className="flex flex-col">
                                  {subCategory.types &&
                                  subCategory.types.length > 0 ? (
                                    <div
                                      className="flex items-center cursor-pointer"
                                      onClick={() =>
                                        dispatch(
                                          toggleSubCategory(
                                            subCategory.id.toString()
                                          )
                                        )
                                      }
                                    >
                                      <motion.span
                                        animate={{
                                          rotate: expandedSubCategories[
                                            subCategory.id
                                          ]
                                            ? 0
                                            : -90,
                                        }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 300,
                                        }}
                                      >
                                        <KeyboardArrowRightOutlinedIcon
                                          fontSize="small"
                                          sx={{
                                            color: "black",
                                            transform: `rotate(${
                                              expandedSubCategories[
                                                subCategory.id
                                              ]
                                                ? "90deg"
                                                : "0deg"
                                            })`,
                                          }}
                                        />
                                      </motion.span>
                                      <span className="ml-1">
                                        {subCategory.name}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <span className="w-[24px]" />
                                      <Link
                                        href={subCategoryLink}
                                        className="ml-1 hover:underline"
                                      >
                                        {subCategory.name}
                                      </Link>
                                    </div>
                                  )}

                                  <AnimatePresence>
                                    {subCategory.types &&
                                      subCategory.types.length > 0 &&
                                      expandedSubCategories[subCategory.id] && (
                                        <motion.ul
                                          className="ml-6 mt-1 overflow-hidden"
                                          initial="hidden"
                                          animate="visible"
                                          exit="exit"
                                          variants={subCategoryAnimation}
                                        >
                                          {subCategory.types.map((type) => {
                                            const typeSlug = customSlugify(
                                              type.name
                                            );
                                            const typeLink = `${subCategoryLink}/${typeSlug}`;
                                            return (
                                              <motion.li
                                                className="text-sm py-1 pl-4"
                                                variants={productAnimation}
                                                key={type.id}
                                              >
                                                <Link
                                                  href={typeLink}
                                                  className="hover:underline"
                                                >
                                                  {type.name}
                                                </Link>
                                              </motion.li>
                                            );
                                          })}
                                        </motion.ul>
                                      )}
                                  </AnimatePresence>
                                </div>
                              </li>
                            );
                          })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ))}
        </ul>
      </nav>
    </div>
  );
};

export default CatalogAccordion;
