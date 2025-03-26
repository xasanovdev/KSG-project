import fs from 'fs';
import path from 'path';
import { Category } from '~/types/categories';

const CATEGORIES_FILE = path.resolve('server/db/categories.json');

const readJsonFile = (filePath: string) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
        return [];
    }
};

const writeJsonFile = (filePath: string, data: any) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error);
    }
};

export default defineEventHandler(async (event) => {
    if (event.method !== 'PUT') {
        throw createError({
            statusCode: 405,
            message: 'Method Not Allowed',
        });
    }

    const body = await readBody(event);
    const { categoryId, category } = body;

    if (!categoryId) {
        throw createError({ statusCode: 400, message: 'Invalid request data' });
    }

    let categories: Category[] = readJsonFile(CATEGORIES_FILE);

    // Find the category index
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);

    if (categoryIndex === -1) {
        throw createError({ statusCode: 404, message: 'Category not found' });
    }

    // Update the category
    categories[categoryIndex] = category as Category;

    // Save changes
    writeJsonFile(CATEGORIES_FILE, categories);

    return { success: true, message: 'Category updated successfully', category: categories[categoryIndex] };
});
