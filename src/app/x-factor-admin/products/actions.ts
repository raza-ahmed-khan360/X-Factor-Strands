'use server';

import { createClient } from '@supabase/supabase-js';

// Helper to check if admin is logged in
async function checkAdminAuth() {
  // Server-side action check
}

// Create a Supabase client with Service Role Key for admin tasks (bypasses RLS)
function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from environment variables. Please restart dev server or set SUPABASE_SERVICE_ROLE_KEY in .env.local.');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function addProduct(formData: FormData) {
  await checkAdminAuth();
  
  const supabase = getAdminSupabase();
  
  // Extract data from form
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const imageFile = formData.get('imageFile') as File | null;
  const variantsJson = formData.get('variants') as string;
  
  let imageUrl = formData.get('imageUrl') as string;

  if (!id || !name || !category) {
    return { success: false, error: 'Missing required product fields' };
  }

  try {
    // 1. Handle Image Upload if a file was provided
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${id}-${crypto.randomUUID()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
        
      imageUrl = publicUrlData.publicUrl;
    }

    // 2. Insert Product
    const { error: productError } = await supabase
      .from('products')
      .insert({
        id,
        name,
        description,
        category,
        image_url: imageUrl || null,
        active: true
      });

    if (productError) {
      throw new Error(`Failed to insert product: ${productError.message}`);
    }

    // 3. Insert Variants
    if (variantsJson) {
      const variants = JSON.parse(variantsJson);
      if (Array.isArray(variants) && variants.length > 0) {
        const variantsToInsert = variants.map((v: any, idx: number) => ({
          id: v.id || `var_${id}_${idx}_${Date.now()}`,
          product_id: id,
          size: v.size,
          price: Number(v.price) || 0
        }));
        
        const { error: variantsError } = await supabase
          .from('variants')
          .insert(variantsToInsert);

        if (variantsError) {
          throw new Error(`Failed to insert variants: ${variantsError.message}`);
        }
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Add product error:', error);
    return { success: false, error: error.message || 'Failed to add product' };
  }
}

export async function updateProduct(formData: FormData) {
  await checkAdminAuth();
  
  const supabase = getAdminSupabase();
  
  const id = formData.get('id') as string; // original ID for WHERE clause
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const imageFile = formData.get('imageFile') as File | null;
  const variantsJson = formData.get('variants') as string;
  const existingImageUrl = formData.get('existingImageUrl') as string;

  if (!id || !name || !category) {
    return { success: false, error: 'Missing required product fields' };
  }

  try {
    let finalImageUrl = existingImageUrl;

    // 1. Handle new image upload if provided
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${id}-${crypto.randomUUID()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
        
      finalImageUrl = publicUrlData.publicUrl;
    }

    // 2. Update Product
    const { error: productError } = await supabase
      .from('products')
      .update({
        name,
        description,
        category,
        image_url: finalImageUrl || null,
      })
      .eq('id', id);

    if (productError) {
      throw new Error(`Failed to update product: ${productError.message}`);
    }

    // 3. Update Variants
    if (variantsJson) {
      const variants = JSON.parse(variantsJson); // [{id?, size, price}]
      
      // Get existing variants from DB
      const { data: existingVariants } = await supabase
        .from('variants')
        .select('id')
        .eq('product_id', id);

      const existingIds = (existingVariants || []).map(v => v.id);
      const incomingIds = variants.filter((v: any) => v.id).map((v: any) => v.id);

      // Delete variants that were removed
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      if (idsToDelete.length > 0) {
        await supabase.from('variants').delete().in('id', idsToDelete);
      }

      // Upsert incoming variants
      const variantsToUpsert = variants.map((v: any, idx: number) => ({
        id: v.id || `var_${id}_${idx}_${Date.now()}`,
        product_id: id,
        size: v.size,
        price: Number(v.price) || 0
      }));

      if (variantsToUpsert.length > 0) {
        const { error: variantsError } = await supabase
          .from('variants')
          .upsert(variantsToUpsert);

        if (variantsError) {
          throw new Error(`Failed to update variants: ${variantsError.message}`);
        }
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Update product error:', error);
    return { success: false, error: error.message || 'Failed to update product' };
  }
}

export async function deleteProduct(id: string) {
  await checkAdminAuth();
  
  const supabase = getAdminSupabase();
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
    
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}
