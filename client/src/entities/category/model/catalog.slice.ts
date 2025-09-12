import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '@/entities/product/api/products.api';
import { productsApi } from '@/entities/product/api/products.api';

interface CatalogState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  expandedCategories: { [key: string]: boolean };
  expandedSubCategories: { [key: string]: boolean };
}

const initialState: CatalogState = {
  categories: [],
  loading: false,
  error: null,
  expandedCategories: {},
  expandedSubCategories: {},
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<string>) => {
      const clickedCategoryId = action.payload;
      const isCurrentlyExpanded = !!state.expandedCategories[clickedCategoryId];

      // Если категория уже открыта, просто закрываем её
      if (isCurrentlyExpanded) {
        state.expandedCategories[clickedCategoryId] = false;
        // Закрываем и её подкатегории
        const category = state.categories.find(
          c => c.id.toString() === clickedCategoryId
        );
        if (category) {
          category.subCategories.forEach(subCat => {
            state.expandedSubCategories[subCat.id.toString()] = false;
          });
        }
      } else {
        // Если категория закрыта, закрываем все остальные и открываем эту
        Object.keys(state.expandedCategories).forEach(id => {
          state.expandedCategories[id] = false;
        });
        // Закрываем все подкатегории
        Object.keys(state.expandedSubCategories).forEach(id => {
          state.expandedSubCategories[id] = false;
        });
        // Открываем выбранную категорию
        state.expandedCategories[clickedCategoryId] = true;
      }
    },

    // Явно раскрыть категорию (без инвертирования), закрывая остальные
    expandCategory: (state, action: PayloadAction<string>) => {
      const targetId = action.payload;
      // Сначала закрываем все категории
      Object.keys(state.expandedCategories).forEach(id => {
        state.expandedCategories[id] = false;
      });
      // Закрываем все подкатегории
      Object.keys(state.expandedSubCategories).forEach(id => {
        state.expandedSubCategories[id] = false;
      });
      // Открываем целевую категорию
      state.expandedCategories[targetId] = true;
    },

    toggleSubCategory: (state, action: PayloadAction<string>) => {
      state.expandedSubCategories[action.payload] =
        !state.expandedSubCategories[action.payload];
    },

    // Явно раскрыть подкатегорию (без инвертирования)
    expandSubCategory: (state, action: PayloadAction<string>) => {
      state.expandedSubCategories[action.payload] = true;
    },

    // Закрыть все категории и подкатегории
    closeAllCategories: state => {
      Object.keys(state.expandedCategories).forEach(id => {
        state.expandedCategories[id] = false;
      });
      Object.keys(state.expandedSubCategories).forEach(id => {
        state.expandedSubCategories[id] = false;
      });
    },

    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      // Инициализируем состояние раскрытия для новых категорий
      action.payload.forEach(category => {
        if (!(category.id in state.expandedCategories)) {
          state.expandedCategories[category.id] = false;
        }
        category.subCategories.forEach(subCategory => {
          if (!(subCategory.id in state.expandedSubCategories)) {
            state.expandedSubCategories[subCategory.id] = false;
          }
        });
      });
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(productsApi.endpoints.getCatalog.matchPending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addMatcher(
      productsApi.endpoints.getCatalog.matchFulfilled,
      (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      }
    );
    builder.addMatcher(
      productsApi.endpoints.getCatalog.matchRejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке каталога';
      }
    );
  },
});

export const {
  toggleCategory,
  toggleSubCategory,
  expandCategory,
  expandSubCategory,
  closeAllCategories,
  setCategories,
  setLoading,
  setError,
} = catalogSlice.actions;
export default catalogSlice.reducer;
