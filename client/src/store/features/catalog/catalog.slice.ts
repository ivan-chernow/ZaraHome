import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import type { Category } from "@/api/products.api";
import { productsApi } from "@/api/products.api";

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
	expandedSubCategories: {}
};

const catalogSlice = createSlice({
	name: 'catalog',
	initialState,
	reducers: {
		toggleCategory: (state, action: PayloadAction<string>) => {
			const clickedCategoryId = action.payload;
			const isCurrentlyExpanded = !!state.expandedCategories[clickedCategoryId];

			// Find the ID of the currently open category, if any
			const currentlyOpenId = Object.keys(state.expandedCategories).find(id => state.expandedCategories[id]);

			// If a category was open, find it and collapse its sub-categories
			if (currentlyOpenId) {
				const previouslyOpenCategory = state.categories.find(c => c.id.toString() === currentlyOpenId);
				if (previouslyOpenCategory) {
					previouslyOpenCategory.subCategories.forEach(subCat => {
						state.expandedSubCategories[subCat.id.toString()] = false;
					});
				}
			}
			
			// Close all main categories
			Object.keys(state.expandedCategories).forEach(id => {
				state.expandedCategories[id] = false;
			});
			
			// Toggle the clicked one based on its original state
			state.expandedCategories[clickedCategoryId] = !isCurrentlyExpanded;
		},

			// Явно раскрыть категорию (без инвертирования), закрывая остальные
			expandCategory: (state, action: PayloadAction<string>) => {
				const targetId = action.payload;
				// Сначала свернем все категории
				Object.keys(state.expandedCategories).forEach(id => {
					state.expandedCategories[id] = false;
				});
				// Свернём подкатегории ранее открытой категории (на всякий случай)
				const previouslyOpen = state.categories.find(c => state.expandedCategories[c.id.toString()]);
				if (previouslyOpen) {
					previouslyOpen.subCategories.forEach(subCat => {
						state.expandedSubCategories[subCat.id.toString()] = false;
					});
				}
				// Откроем целевую
				state.expandedCategories[targetId] = true;
			},

			toggleSubCategory: (state, action: PayloadAction<string>) => {
			state.expandedSubCategories[action.payload] = !state.expandedSubCategories[action.payload];
		},

			// Явно раскрыть подкатегорию (без инвертирования)
			expandSubCategory: (state, action: PayloadAction<string>) => {
				state.expandedSubCategories[action.payload] = true;
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
		}
	},
	extraReducers: (builder) => {
		builder.addMatcher(productsApi.endpoints.getCatalog.matchPending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addMatcher(productsApi.endpoints.getCatalog.matchFulfilled, (state, action) => {
			state.loading = false;
			state.categories = action.payload;
		});
		builder.addMatcher(productsApi.endpoints.getCatalog.matchRejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || 'Ошибка при загрузке каталога';
		});
	}
});

export const {toggleCategory, toggleSubCategory, expandCategory, expandSubCategory, setCategories, setLoading, setError} = catalogSlice.actions;
export default catalogSlice.reducer;


