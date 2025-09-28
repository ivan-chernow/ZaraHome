import type {
  Category,
  Product,
  SubCategory,
  Type,
} from '@/entities/product/api/products.api';
import slugify from 'slugify';

export const customSlugify = (text: string) =>
  slugify(text.replace(/й/g, 'y').replace(/и/g, 'i'), {
    lower: true,
    strict: true,
  });

export function getProductsByCategory(category?: Category): Product[] {
  if (!category) {
    return [];
  }
  return category.subCategories.flatMap(
    subCat =>
      subCat.products ||
      subCat.types?.flatMap(type => type.products || []) ||
      []
  );
}

export function getProductsBySubCategory(subCat?: SubCategory): Product[] {
  if (!subCat) return [];
  const subCatProducts = subCat.products || [];
  const typeProducts =
    subCat.types?.reduce<Product[]>((typeAcc, type) => {
      return [...typeAcc, ...(type.products || [])];
    }, []) || [];
  return [...subCatProducts, ...typeProducts];
}

export function getProductsByType(type?: Type): Product[] {
  return type?.products || [];
}

// Кеш для всех товаров
let productsCache: Product[] | null = null;
let categoriesCache: Category[] | null = null;

export function getAllProducts(categories?: Category[]): Product[] {
  if (!categories || !Array.isArray(categories)) {
    return [];
  }

  // Проверяем кеш
  if (productsCache && categoriesCache === categories) {
    return productsCache;
  }

  const allProducts = categories.reduce<Product[]>((acc, category) => {
    return [...acc, ...getProductsByCategory(category)];
  }, []);

  const uniqueProducts = allProducts.filter(
    (product, index, self) => index === self.findIndex(p => p.id === product.id)
  );

  // Обновляем кеш
  productsCache = uniqueProducts;
  categoriesCache = categories;

  return uniqueProducts;
}

// Кеш для поиска товаров по ID
const productByIdCache = new Map<string, Product>();

export function findProductById(
  categories: Category[] = [],
  id: number | string
): Product | undefined {
  const idStr = id.toString();

  // Проверяем кеш
  if (productByIdCache.has(idStr)) {
    return productByIdCache.get(idStr);
  }

  const allProducts = getAllProducts(categories);
  const product = allProducts.find(product => product.id.toString() === idStr);

  // Сохраняем в кеш
  if (product) {
    productByIdCache.set(idStr, product);
  }

  return product;
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
      p => p.id.toString() === productId
    );
    if (categoryProduct) {
      // Если товар найден на уровне категории, возвращаем с пустой подкатегорией
      return {
        category,
        subCategory: {
          id: 0,
          name: '',
          products: [],
          types: [],
          categoryId: category.id,
        },
        product: categoryProduct,
      };
    }

    for (const subCategory of category.subCategories) {
      // Проверяем товары на уровне подкатегории
      const subCategoryProduct = subCategory.products?.find(
        p => p.id.toString() === productId
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
            p => p.id.toString() === productId
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
