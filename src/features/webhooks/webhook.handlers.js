import { prisma } from '../../config/prisma.js';

// Each function handles the logic for a specific webhook topic.
// This is the "Separation of Concerns" principle in action.

export async function handleNewOrder(shopDomain, orderPayload) {
    const store = await prisma.store.findUnique({ where: { shopifyShopDomain: shopDomain } });
    if (!store) throw new Error(`Store not found: ${shopDomain}`);

    // Find or create customer
    const customer = await prisma.customer.upsert({
        where: { shopifyCustomerId: orderPayload.customer.id },
        update: { totalSpent: { increment: orderPayload.total_price }, ordersCount: { increment: 1 } },
        create: {
            shopifyCustomerId: orderPayload.customer.id,
            email: orderPayload.customer.email,
            firstName: orderPayload.customer.first_name,
            lastName: orderPayload.customer.last_name,
            totalSpent: orderPayload.total_price,
            ordersCount: 1,
            storeId: store.id,
        },
    });

    // Create the order
    await prisma.order.create({
        data: {
            shopifyOrderId: orderPayload.id,
            totalPrice: orderPayload.total_price,
            financialStatus: orderPayload.financial_status,
            processedAt: new Date(orderPayload.processed_at),
            note: orderPayload.note,
            storeId: store.id,
            customerId: customer.id,
        },
    });
    console.log(`[${shopDomain}] Processed new order ${orderPayload.id}`);
}

export async function handleNewProduct(shopDomain, productPayload) {
    const store = await prisma.store.findUnique({ where: { shopifyShopDomain: shopDomain } });
    if (!store) throw new Error(`Store not found: ${shopDomain}`);

    await prisma.product.create({
        data: {
            shopifyProductId: productPayload.id,
            title: productPayload.title,
            vendor: productPayload.vendor,
            productType: productPayload.product_type,
            status: productPayload.status,
            tags: productPayload.tags.split(',').map(tag => tag.trim()), // Shopify tags are comma-separated
            storeId: store.id
        }
    });
    console.log(`[${shopDomain}] Processed new product ${productPayload.title}`);
}

// TODO: Add more handler functions for customers/create, orders/update, etc.