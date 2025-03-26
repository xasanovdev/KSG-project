import fs from 'fs';
import path from 'path';
import { Category } from '~/types/categories';

const CATEGORIES_FILE = path.resolve('data/categories.json');

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
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            message: 'Method Not Allowed',
        });
    }

    const body = await readBody(event);
    const { category } = body;

    if (!category) {
        throw createError({ statusCode: 400, message: 'Category is required' });
    }

    let categories: Category[] = readJsonFile(CATEGORIES_FILE);

    categories.unshift(category);
    writeJsonFile(CATEGORIES_FILE, categories);

    return { success: true, message: 'Category added successfully', category };
});
