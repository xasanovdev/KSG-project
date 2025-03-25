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

        if (query.type === 'history') {
            // Retrieve action history
            return readJsonFile(ACTIONS_HISTORY_FILE);
        }

        // Retrieve categories
        const categories = readJsonFile(CATEGORIES_FILE);
        return categories;
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
        const { categoryId } = body;

        const categories = readJsonFile(CATEGORIES_FILE);
        const filteredCategories = categories.filter(
            (c: Category) => String(c.id) !== String(categoryId)
        );

        writeJsonFile(CATEGORIES_FILE, filteredCategories);

        // Log action
        addActionToHistory({
            type: 'delete',
            timestamp: Date.now(),
            details: { categoryId },
        });

        return { success: true, message: 'Category deleted successfully' };
    }
});
