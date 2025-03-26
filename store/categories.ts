// stores/categories.ts
import { defineStore } from 'pinia';
import type { Category, UserAction } from '~/types/categories';

interface CategoriesState {
    categories: Category[];
    actions: UserAction[];
    loading: boolean;
    error: string | null;
    categoriesPaginationData: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const useCategoriesStore = defineStore('categories', {
    state: (): CategoriesState => ({
        categories: [],
        categoriesPaginationData: {
            page: 1,
            limit: 4,
            total: 0,
            totalPages: 1,
        },
        actions: [],
        loading: true,
        error: null,
    }),

    getters: {
        // Get category by ID
        getCategoryById: (state) => (id: number) => {
            return state.categories.find((category) => category.id === id);
        },

        // Get subcategories for a specific category
        getSubcategoriesByCategoryId: (state) => (categoryId: number) => {
            const category = state.categories.find((c) => c.id === categoryId);
            return category ? category.sub_categories : [];
        },

        // Sort categories by order
        sortedCategories: (state) => {
            return [...state.categories].sort((a, b) => a.order - b.order);
        },

        // Get recent actions
        recentActions: (state) => {
            return [...state.actions].reverse().slice(0, 20);
        },
    },

    actions: {
        // Fetch all categories
        async fetchCategories(newPage: number) {
            this.loading = true;
            this.error = null;

            try {
                const data = await $fetch('/api/categories', {
                    method: 'GET',
                    params: {
                        page: newPage,
                    },
                });

                this.categories = await data.data;
                this.categoriesPaginationData = data.pagination;
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch categories';
                console.error('Categories fetch error:', error);
            } finally {
                this.loading = false;
            }
        },

        // Fetch action history
        async fetchActionHistory() {
            this.loading = true;
            this.error = null;

            try {
                this.actions = await $fetch('/api/categories?type=history');
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch action history';
                console.error('Action history fetch error:', error);
            } finally {
                this.loading = false;
            }
        },

        // Add new category
        async addCategory(newCategory: Category) {
            this.loading = true;
            this.error = null;

            try {
                await $fetch('/api/categories', {
                    method: 'POST',
                    body: { categories: [...this.categories, newCategory] },
                });

                // Refetch categories instead of manually updating
                await this.fetchCategories();
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to add category';
                console.error('Add category error:', error);
            } finally {
                this.loading = false;
            }
        },

        // Update existing category
        async updateCategory(categoryId: number, updates: Partial<Category>) {
            this.loading = true;
            this.error = null;

            try {
                await $fetch('/api/categories', {
                    method: 'PUT',
                    body: { categoryId, updates },
                });

                // Refetch categories instead of manually updating
                await this.fetchCategories();
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to update category';
                console.error('Update category error:', error);
            } finally {
                this.loading = false;
            }
        },

        // Delete category
        async deleteCategory(categoryId: string, subId?: string) {
            this.loading = true;
            this.error = null;

            try {
                await $fetch('/api/categories', {
                    method: 'DELETE',
                    body: { categoryId, subId },
                });

                // Refetch categories instead of manually filtering
                await this.fetchCategories();
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to delete category';
                console.error('Delete category error:', error);
            } finally {
                this.loading = false;
            }
        },

        // Reorder categories
        async reorderCategories(newOrder: Category[]) {
            this.loading = true;
            this.error = null;

            try {
                await $fetch('/api/categories', {
                    method: 'POST',
                    body: { categories: newOrder },
                });

                // Refetch categories instead of manually updating
                await this.fetchCategories(this.categoriesPaginationData.page);
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to reorder categories';
                console.error('Reorder categories error:', error);
            } finally {
                this.loading = false;
            }
        },
    },
});
