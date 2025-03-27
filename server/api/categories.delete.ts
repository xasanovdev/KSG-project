import { SubCategory } from "~/types/categories";

export default defineEventHandler(async (event) => {
    if (event.method !== 'DELETE') {
        throw createError({
            statusCode: 405,
            message: 'Method Not Allowed',
        });
    }

    const body = await readBody(event);
    console.log("Received DELETE request body:", body); // Debugging log

    const { subId, type, categoryId } = body;

    // Validate required parameters based on type
    if (type === "category" && !categoryId) {
        throw createError({ statusCode: 400, message: "Missing categoryId for category deletion" });
    }
    if (type === "subcategory" && (!subId || !categoryId)) {
        throw createError({ statusCode: 400, message: "Missing subId or categoryId for subcategory deletion" });
    }

    if (type === 'category') {
        // Delete Category
        const { error } = await supabase.from('categories').delete().eq('id', categoryId);

        if (error) {
            throw createError({ statusCode: 500, message: error.message });
        }

        return { success: true, message: 'Category deleted successfully' };
    } else if (type === 'subcategory') {
        // Fetch Category to update subcategories
        const { data: category, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', categoryId)
            .single();

        if (error || !category) {
            throw createError({ statusCode: 500, message: 'Category not found' });
        }

        let subCategories = Array.isArray(category.sub_categories)
            ? category.sub_categories
            : JSON.parse(category.sub_categories || '[]');

        // Remove Subcategory
        subCategories = subCategories.filter((sub: SubCategory) => sub.id !== subId);

        // Update order values
        subCategories.forEach((sub: SubCategory, index: number) => (sub.order = index + 1));

        // Save Updated Subcategories
        const { error: updateError } = await supabase
            .from('categories')
            .update({ sub_categories: subCategories })
            .eq('id', categoryId);

        if (updateError) {
            throw createError({ statusCode: 500, message: updateError.message });
        }

        return { success: true, message: 'Subcategory deleted successfully' };
    }

    throw createError({ statusCode: 400, message: 'Invalid type' });
});
