import { defineEventHandler, readBody, createError } from 'h3';
import { supabase } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
    // Method check
    if (event.method !== 'PUT') {
        throw createError({
            statusCode: 405,
            message: 'Method Not Allowed',
        });
    }

    // Read request body
    const body = await readBody(event);
    const { categoryId, category } = body;

    // Validate input
    if (!categoryId || !category) {
        throw createError({
            statusCode: 400,
            message: 'Invalid request data',
        });
    }

    // Ensure sub_categories is stored as JSON if present
    if (category.sub_categories) {
        try {
            category.sub_categories = JSON.stringify(category.sub_categories);
        } catch (stringifyError) {
            throw createError({
                statusCode: 400,
                message: 'Invalid sub_categories format',
            });
        }
    }

    // Update the category in Supabase
    const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', categoryId)
        .select()
        .single(); // Add .single() to get the first result directly

    if (error) {
        throw createError({
            statusCode: 500,
            message: error.message,
        });
    }

    return {
        success: true,
        message: 'Category updated successfully',
        category: data,
    };
});
