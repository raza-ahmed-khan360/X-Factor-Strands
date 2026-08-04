import "@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe";
import { createClient } from "npm:@supabase/supabase-js";

export default {
  fetch: async (req: Request) => {
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

      const signature = req.headers.get('stripe-signature');
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

      if (!signature || !webhookSecret) {
        return Response.json({ error: 'Missing signature or secret' }, { status: 400 });
      }

      const body = await req.text();
      let event;
      
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret, undefined, Stripe.createCryptoProvider());
      } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return Response.json({ error: err.message }, { status: 400 });
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
      );

      // Handle the event
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const customerId = session.customer;
        const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
        const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
        const userId = session.client_reference_id;

        // Create the order in Supabase
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userId || null,
            status: 'paid',
            stripe_session_id: session.id,
            total_amount: totalAmount,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Insert order items
        if (items.length > 0 && order) {
          const orderItems = items.map((item: any) => ({
            order_id: order.id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.price,
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

          if (itemsError) throw itemsError;
        }
      }

      return Response.json({ received: true }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      return Response.json({ error: err.message }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
  },
};
