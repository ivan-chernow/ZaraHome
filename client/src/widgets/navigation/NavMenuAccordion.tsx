import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toggleSubCategory } from "@/entities/category/model/catalog.slice";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/shared/config/store/store";
import { Container } from "@mui/material";
import { useGetCatalogQuery } from "@/entities/product/api/products.api";
import Link from "next/link";
import slugify from "slugify";
import { productAnimation, subCategoryAnimation } from "@/shared/lib/animation";

interface NavMenuAccordionProps {
  onClose: () => void;
}

const NavMenuAccordion: React.FC<NavMenuAccordionProps> = ({ onClose }) => {
  const { expandedSubCategories } = useSelector((state: RootState) => ({
    expandedSubCategories: state.catalog?.expandedSubCategories || {},
  }));
  const dispatch = useDispatch();
  const { data: categories, isLoading, error } = useGetCatalogQuery();

  const customSlugify = (text: string) =>
    slugify(text.replace(/й/g, "y").replace(/и$/g, "i"), {
      lower: true,
      strict: true,
    });

  if (isLoading) return <div>Загрузка...</div>;
  if (error)
    return (
      <div>
        Ошибка: {error instanceof Error ? error.message : "Произошла ошибка"}
      </div>
    );
  if (!categories) return null;

  const filteredCategories = categories.filter(
    (category) => category.name !== "Новинки" && category.name !== "Скидки"
  );

  // Разделяем каталог на 4 равные части
  const columns = [
    filteredCategories.slice(0, 2), // Первые 2 категории
    filteredCategories.slice(2, 4), // Следующие 2 категории
    filteredCategories.slice(4, 6), // Следующие 2 категории
    filteredCategories.slice(6), // Оставшиеся категории
  ];

  return (
    <div className="flex w-full px-6 pb-[70px]">
      <Container maxWidth="lg" sx={{ display: "flex", flexWrap: "wrap" }}>
        {columns.map((columnItems, columnIndex) => (
          <div
            key={columnIndex}
            className={`w-1/4 min-w-[250px] px-4 ${
              columnIndex > 0 ? "border-l border-[#E5E5E5]" : ""
            }`}
          >
            {columnItems.map((category) => (
              <div key={category.id} className="mb-8">
                {/* Заголовок колонки */}
                <div className="mb-4 font-semibold text-[18px] uppercase tracking-wide">
                  {category.name}
                </div>
                {/* Список подкатегорий */}
                <ul>
                  {category.subCategories
                    .slice()
                    .sort((a, b) => {
                      const aHasTypes =
                        Array.isArray(a.types) && a.types.length > 0;
                      const bHasTypes =
                        Array.isArray(b.types) && b.types.length > 0;
                      return aHasTypes === bHasTypes ? 0 : aHasTypes ? -1 : 1;
                    })
                    .map((subCategory) => {
                      const categorySlug = customSlugify(category.name);
                      const subCategorySlug = customSlugify(subCategory.name);
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
                                    toggleSubCategory(subCategory.id.toString())
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
                                        expandedSubCategories[subCategory.id]
                                          ? "90deg"
                                          : "0deg"
                                      })`,
                                    }}
                                  />
                                </motion.span>
                                <span className="ml-1">{subCategory.name}</span>
                              </div>
                            ) : (
                              <Link
                                href={subCategoryLink}
                                className="flex items-center"
                                onClick={onClose}
                              >
                                <span className="w-[24px]" />
                                <span className="ml-1 hover:underline">
                                  {subCategory.name}
                                </span>
                              </Link>
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
                                      const typeSlug = customSlugify(type.name);
                                      const typeLink = `${subCategoryLink}/${typeSlug}`;
                                      return (
                                        <Link
                                          href={typeLink}
                                          key={type.id}
                                          onClick={onClose}
                                        >
                                          <motion.li
                                            className="text-sm py-1 pl-4 cursor-pointer"
                                            variants={productAnimation}
                                            whileHover={{ x: 3 }}
                                          >
                                            {type.name}
                                          </motion.li>
                                        </Link>
                                      );
                                    })}
                                  </motion.ul>
                                )}
                            </AnimatePresence>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </Container>
    </div>
  );
};

export default NavMenuAccordion;
