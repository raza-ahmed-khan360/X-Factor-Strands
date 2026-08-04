import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { productData } from '../src/components/products/ProductData';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey || !stripeSecret) {
  console.error('Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and STRIPE_SECRET_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const stripe = new Stripe(stripeSecret, { apiVersion: '2026-07-29.dahlia' as any });

async function seed() {
  console.log('Starting seed process...');

  for (const product of productData) {
    console.log(`Processing product: ${product.name}`);

    // Create Product in Stripe
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.shortDesc,
      images: [product.imageUrl],
      metadata: {
        category: product.category,
      },
    });

    // Create Product in Supabase
    const { error: productError } = await supabase
      .from('products')
      .upsert({
        id: product.id,
        name: product.name,
        description: product.longDesc,
        category: product.category,
        image_url: product.imageUrl,
        active: true,
      });

    if (productError) {
      console.error(`Error inserting product ${product.id} into Supabase:`, productError);
      continue;
    }

    // Process Variants
    for (const variant of product.variants) {
      // Create Price in Stripe
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(variant.price * 100), // Stripe uses cents
        currency: 'usd',
        metadata: {
          size: variant.size,
        },
      });

      // Create Variant in Supabase
      const { error: variantError } = await supabase
        .from('variants')
        .insert({
          product_id: product.id,
          size: variant.size,
          price: variant.price,
          stripe_price_id: stripePrice.id,
        });

      if (variantError) {
        console.error(`Error inserting variant ${variant.size} for ${product.id} into Supabase:`, variantError);
      } else {
        console.log(`Successfully added variant ${variant.size} (Stripe Price ID: ${stripePrice.id})`);
      }
    }
  }

  console.log('Seed process completed successfully!');
}

seed().catch(console.error);
