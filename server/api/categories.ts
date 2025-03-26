import fs from 'fs';
import path from 'path';

interface SubCategory {
    id: number;
    name: string;
    order: number;
}

interface Category {
    id: number;
    name: string;
    order: number;
    sub_categories: SubCategory[];
}

interface UserAction {
    type: 'create' | 'update' | 'delete';
    timestamp: number;
    details: any;
}

const CATEGORIES_FILE = path.resolve('server/db/categories.json');
const ACTIONS_HISTORY_FILE = path.resolve('server/db/categories-history.json');

export default defineEventHandler(async (event) => {
    const method = event.method;

    // Ensure data directory exists
    const ensureDirectoryExists = (dirPath: string) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    };

    // Utility function to read JSON file
    const readJsonFile = (filePath: string) => {
        ensureDirectoryExists(path.dirname(filePath));

        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (error) {
            return [];
        }
    };

    // Utility function to write JSON file
    const writeJsonFile = (filePath: string, data: any) => {
        ensureDirectoryExists(path.dirname(filePath));

        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error writing to ${filePath}:`, error);
        }
    };

    // Add action to history
    const addActionToHistory = (action: UserAction) => {
        const actions = readJsonFile(ACTIONS_HISTORY_FILE);

        // Keep only last 20 actions
        if (actions.length >= 20) {
            actions.shift();
        }

        actions.push(action);
        writeJsonFile(ACTIONS_HISTORY_FILE, actions);
    };

    if (method === 'GET') {
        const query = getQuery(event);
        const categories = readJsonFile(CATEGORIES_FILE);

        if (query.type === 'history') {
            return readJsonFile(ACTIONS_HISTORY_FILE);
        }

        // Pagination
        const page = parseInt(query.page as string) || 1;
        const limit = parseInt(query.limit as string) || 4;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedCategories = categories.slice(startIndex, endIndex);

        return {
            data: paginatedCategories,
            pagination: {
                page,
                limit,
                total: categories.length,
                totalPages: Math.ceil(categories.length / limit),
            },
        };
    }

    if (method === 'POST') {
        const body = await readBody(event);
        const categories = body.categories as Category[];

        // Validate input
        if (!categories || !Array.isArray(categories)) {
            throw createError({
                statusCode: 400,
                message: 'Invalid categories data',
            });
        }

        // Save categories
        writeJsonFile(CATEGORIES_FILE, categories);

        // Log action
        addActionToHistory({
            type: 'create',
            timestamp: Date.now(),
            details: {
                categoriesCount: categories.length,
                categoryNames: categories.map((c) => c.name),
            },
        });

        return { success: true, message: 'Categories saved successfully' };
    }

    if (method === 'PUT') {
        const body = await readBody(event);
        const { categoryId, updates } = body;

        const categories = readJsonFile(CATEGORIES_FILE);
        const categoryIndex = categories.findIndex(
            (c: Category) => c.id === categoryId
        );

        if (categoryIndex === -1) {
            throw createError({
                statusCode: 404,
                message: 'Category not found',
            });
        }

        // Apply updates
        categories[categoryIndex] = {
            ...categories[categoryIndex],
            ...updates,
        };
        writeJsonFile(CATEGORIES_FILE, categories);

        // Log action
        addActionToHistory({
            type: 'update',
            timestamp: Date.now(),
            details: { categoryId, updates },
        });

        return { success: true, message: 'Category updated successfully' };
    }

    if (method === 'DELETE') {
        const body = await readBody(event);
        const { categoryId, subId } = body;

        let categories = readJsonFile(CATEGORIES_FILE);

        if (subId) {
            // Delete subcategory from the given category
            categories = categories.map((category: Category) => {
                if (String(category.id) === String(categoryId)) {
                    return {
                        ...category,
                        sub_categories: category.sub_categories?.filter(
                            (sub: SubCategory) =>
                                String(sub.id) !== String(subId)
                        ),
                    };
                }
                return category;
            });
        } else {
            // Delete entire category
            categories = categories.filter(
                (category: Category) =>
                    String(category.id) !== String(categoryId)
            );
        }

        writeJsonFile(CATEGORIES_FILE, categories);

        // Log action
        addActionToHistory({
            type: 'delete',
            timestamp: Date.now(),
            details: subId ? { categoryId, subId } : { categoryId },
        });

        return {
            success: true,
            message: subId
                ? 'Subcategory deleted successfully'
                : 'Category deleted successfully',
        };
    }
});
