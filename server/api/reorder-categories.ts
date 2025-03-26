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
    if (event.method !== 'POST') {
        throw createError({
            statusCode: 405,
            message: 'Method Not Allowed',
        });
    }

    const body = await readBody(event);
    const { draggedItem, targetCategoryId, type, targetSubId } = body;

    if (!draggedItem) {
        throw createError({
            statusCode: 400,
            message: 'No dragged item provided',
        });
    }

    let categories = readJsonFile(CATEGORIES_FILE) as Category[];

    if (type === 'category' && draggedItem.type === 'category') {
        const fromIndex = categories.findIndex(
            (cat) => cat.id === draggedItem.categoryId
        );
        const toIndex = categories.findIndex(
            (cat) => cat.id === targetCategoryId
        );

        if (fromIndex !== -1 && toIndex !== -1) {
            const [movedCategory] = categories.splice(fromIndex, 1);
            categories.splice(toIndex, 0, movedCategory);
            categories.forEach((cat, index) => (cat.order = index + 1));
        }
    } else if (
        type === 'subcategory' &&
        draggedItem.type === 'subcategory' &&
        draggedItem.subId !== undefined &&
        targetSubId !== undefined
    ) {
        const category = categories.find(
            (cat) => cat.id === draggedItem.categoryId
        );
        if (category && category.sub_categories) {
            const fromIndex = category.sub_categories.findIndex(
                (sub) => sub.id === draggedItem.subId
            );
            const toIndex = category.sub_categories.findIndex(
                (sub) => sub.id === targetSubId
            );

            if (fromIndex !== -1 && toIndex !== -1) {
                const [movedSubcategory] = category.sub_categories.splice(
                    fromIndex,
                    1
                );
                category.sub_categories.splice(toIndex, 0, movedSubcategory);
                category.sub_categories.forEach(
                    (sub, index) => (sub.order = index + 1)
                );
            }
        }
    }

    writeJsonFile(CATEGORIES_FILE, categories);

    return { success: true, message: 'Categories reordered successfully' };
});
