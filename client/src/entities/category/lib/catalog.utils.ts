import type { Category, Product, SubCategory, Type } from "@/entities/product/api/products.api";
import slugify from "slugify";

export const customSlugify = (text: string) =>
  slugify(text.replace(/й/g, "y").replace(/и/g, "i"), {
    lower: true,
    strict: true,
  });

export function getProductsByCategory(category?: Category): Product[] {
  if (!category) {
    return [];
  }
  return category.subCategories.flatMap(
    (subCat) =>
      subCat.products ||
      subCat.types?.flatMap((type) => type.products || []) ||
      []
  );
}

export function getProductsBySubCategory(subCat?: SubCategory): Product[] {
  if (!subCat) return [];
  const subCatProducts = subCat.products || [];
  const typeProducts = subCat.types?.reduce<Product[]>((typeAcc, type) => {
    return [...typeAcc, ...(type.products || [])];
  }, []) || [];
  return [...subCatProducts, ...typeProducts];
}

export function getProductsByType(type?: Type): Product[] {
  return type?.products || [];
}

export function getAllProducts(categories?: Category[]): Product[] {
  if (!categories || !Array.isArray(categories)) {
    return [];
  }
  
  const allProducts = categories.reduce<Product[]>((acc, category) => {
    return [...acc, ...getProductsByCategory(category)];
  }, []);

  return allProducts.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );
}

export function findProductById(
  categories: Category[] = [],
  id: number | string
): Product | undefined {
  const allProducts = getAllProducts(categories);
  return allProducts.find((product) => product.id.toString() === id.toString());
}

export const findProductPathById = (
  categories: Category[] | undefined,
  productId: string
): {
  category: Category;
  subCategory: SubCategory;
  type?: Type;
  product: Product;
} | null => {
  if (!categories) {
    return null;
  }

  for (const category of categories) {
    // Проверяем товары на уровне категории
    const categoryProduct = category.products?.find(
      (p) => p.id.toString() === productId
    );
    if (categoryProduct) {
      // Если товар найден на уровне категории, возвращаем с пустой подкатегорией
      return {
        category,
        subCategory: { id: 0, name: "", products: [], types: [], categoryId: category.id },
        product: categoryProduct,
      };
    }

    for (const subCategory of category.subCategories) {
      // Проверяем товары на уровне подкатегории
      const subCategoryProduct = subCategory.products?.find(
        (p) => p.id.toString() === productId
      );
      if (subCategoryProduct) {
        return {
          category,
          subCategory,
          product: subCategoryProduct,
        };
      }

      // Проверяем товары в типах подкатегории
      if (subCategory.types) {
        for (const type of subCategory.types) {
          const foundProduct = type.products?.find(
            (p) => p.id.toString() === productId
          );
          if (foundProduct) {
            return {
              category,
              subCategory,
              type,
              product: foundProduct,
            };
          }
        }
      }
    }
  }
  return null;
};
