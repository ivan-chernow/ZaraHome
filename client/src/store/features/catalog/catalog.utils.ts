import type { Category, Product, SubCategory, Type } from "@/api/products.api";
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
  if (!categories) {
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
  console.log("findProductPathById called with:", { categories, productId });

  if (!categories) {
    console.log("No categories provided");
    return null;
  }

  for (const category of categories) {
    console.log("Checking category:", category.name);

    // Проверяем товары на уровне категории
    const categoryProduct = category.products?.find(
      (p) => p.id.toString() === productId
    );
    if (categoryProduct) {
      console.log("Found product in category:", categoryProduct.name_ru);
      // Если товар найден на уровне категории, возвращаем с пустой подкатегорией
      return {
        category,
        subCategory: { id: 0, name: "", products: [], types: [], categoryId: category.id },
        product: categoryProduct,
      };
    }

    for (const subCategory of category.subCategories) {
      console.log("Checking subCategory:", subCategory.name);

      // Проверяем товары на уровне подкатегории
      const subCategoryProduct = subCategory.products?.find(
        (p) => p.id.toString() === productId
      );
      if (subCategoryProduct) {
        console.log("Found product in subCategory:", subCategoryProduct.name_ru);
        return {
          category,
          subCategory,
          product: subCategoryProduct,
        };
      }

      // Проверяем товары в типах подкатегории
      if (subCategory.types) {
        for (const type of subCategory.types) {
          console.log("Checking type:", type.name);
          const foundProduct = type.products?.find(
            (p) => p.id.toString() === productId
          );
          if (foundProduct) {
            console.log("Found product in type:", foundProduct.name_ru);
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

  console.log("Product not found in any location");
  return null;
};
