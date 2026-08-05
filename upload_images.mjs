import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateImages() {
  console.log("Starting image migration to Supabase bucket...");

  // 1. Get all products
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, image_url');

  if (fetchError) {
    console.error("Failed to fetch products", fetchError);
    return;
  }

  let migratedCount = 0;

  for (const product of products) {
    if (product.image_url && product.image_url.startsWith('/new-products/')) {
      const localFilePath = path.join(process.cwd(), 'public', product.image_url);
      
      if (fs.existsSync(localFilePath)) {
        console.log(`Uploading image for product: ${product.id}`);
        const fileData = fs.readFileSync(localFilePath);
        const fileName = path.basename(localFilePath);
        const bucketPath = `migrated/${Date.now()}-${fileName}`;

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase
          .storage
          .from('product-images')
          .upload(bucketPath, fileData, {
            contentType: 'image/jpeg', // Assuming jpeg based on extension
            upsert: true,
          });

        if (uploadError) {
          console.error(`Failed to upload ${fileName}:`, uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('product-images')
          .getPublicUrl(bucketPath);

        // Update product record
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: publicUrl })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Failed to update DB for ${product.id}:`, updateError);
        } else {
          console.log(`Success: ${product.id} -> ${publicUrl}`);
          migratedCount++;
        }
      } else {
        console.warn(`Local file not found: ${localFilePath}`);
      }
    }
  }

  console.log(`Migration complete. Migrated ${migratedCount} images.`);
}

migrateImages();
