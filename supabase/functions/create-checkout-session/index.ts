import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import Stripe from "npm:stripe";

export default {
  fetch: withSupabase({ auth: ["publishable"] }, async (req, ctx) => {
    // Enable CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }});
    }

    try {
      const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
        apiVersion: '2023-10-16',
        httpClient: Stripe.createFetchHttpClient(),
      });

      const { items } = await req.json();
      
      if (!items || items.length === 0) {
        return Response.json({ error: 'No items provided' }, { status: 400 });
      }

      // Check if user is authenticated
      const { user } = ctx.auth;

      const lineItems = items.map((item: any) => ({
        price: item.stripe_price_id,
        quantity: item.quantity,
      }));

      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get('origin')}/checkout/cancel`,
        client_reference_id: user ? user.id : undefined,
        metadata: {
          items: JSON.stringify(items.map((i: any) => ({ id: i.id, variant_id: i.variant_id }))),
        },
      });

      return Response.json({ url: session.url }, {
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    } catch (err: any) {
      console.error('Error creating checkout session', err);
      return Response.json({ error: err.message }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
  }),
};
