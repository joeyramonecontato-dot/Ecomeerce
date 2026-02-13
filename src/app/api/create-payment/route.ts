import { NextResponse } from 'next/server';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { saveOrder } from '@/lib/db';

export const runtime = 'nodejs';

// Inicializa o Mercado Pago
// IMPORTANTE: Definir MERCADOPAGO_ACCESS_TOKEN no .env
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-00000000-0000-0000-0000-000000000000'
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, paymentMethod, ...customerData } = body; // Ajuste conforme o form envia

        // 1. Calcular totais (boa prática: recalcular no backend para segurança)
        // Aqui vamos confiar no frontend por enquanto para o MVP, mas em prod validariamos com o banco de produtos.
        // O body deve vir estruturado do CheckoutForm. Precisamos garantir a estrutura.
        // Vamos assumir que o CheckoutForm envia { items: [], ...customerFields }
        // O CheckoutForm manda (data) que tem items, paymentMethod, name, email etc.

        // Preparar Items para o MP
        const mpItems = items.map((item: any) => ({
            id: item.id,
            title: item.name,
            quantity: Number(item.quantity),
            unit_price: Number(item.price)
        }));

        // Aplicar desconto se for Pix/Boleto (na lógica do MP ou criando item de desconto)
        // O MP não tem "desconto global" fácil na Preference sem criar cupom.
        // Podemos alterar o unit_price se o pagamento for Pix.
        if (paymentMethod === 'pix' || paymentMethod === 'boleto') {
            mpItems.forEach((item: any) => {
                item.unit_price = Number((item.unit_price * 0.9).toFixed(2));
            });
        }

        // 2. Criar Preferência no Mercado Pago
        const preference = new Preference(client);

        // URL base (em dev localhost, em prod URL do site)
        // Se estiver rodando local, precisamos de um túnel (ngrok) para webhook, mas para redirect ok.
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const preferenceData = {
            body: {
                items: mpItems,
                payer: {
                    name: customerData.name.split(" ")[0],
                    surname: customerData.name.split(" ").slice(1).join(" ") || "Cliente",
                    email: customerData.email,
                    phone: {
                        area_code: customerData.phone.replace(/\D/g, "").substring(0, 2),
                        number: customerData.phone.replace(/\D/g, "").substring(2)
                    },
                    address: {
                        zip_code: customerData.cep.replace(/\D/g, ""),
                        street_name: customerData.address,
                        street_number: customerData.number
                    }
                },
                back_urls: {
                    success: `${baseUrl}/success`,
                    failure: `${baseUrl}/checkout?status=failure`,
                    pending: `${baseUrl}/checkout?status=pending`
                },
                // auto_return: "approved", // Removido temporariamente para debug
                external_reference: `ORD-${Date.now()}`,
                // Opcional: Filtrar formas de pagamento baseado na seleção do site?
                // Vamos deixar tudo liberado por enquanto para facilitar o teste.
                payment_methods: {
                    excluded_payment_types: [],
                    installments: 12
                },
                statement_descriptor: "IMPULSO HYPE"
            }
        };

        console.log("Preference Data enviado:", JSON.stringify(preferenceData, null, 2));

        const result = await preference.create(preferenceData);

        // 3. Salvar Pedido no "Banco"
        const orderNumber = preferenceData.body.external_reference;
        const orderData = {
            orderNumber,
            // @ts-ignore
            items: mpItems,
            customer: customerData,
            payment: paymentMethod,
            totals: {
                // @ts-ignore
                total: mpItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0)
            },
            mpPreferenceId: result.id,
            paymentUrl: result.init_point
        };

        // @ts-ignore
        await saveOrder(orderData);

        return NextResponse.json({
            success: true,
            checkoutUrl: result.init_point, // Redireciona para o MP (Sandbox/Prod)
            preferenceId: result.id
        });

    } catch (error: any) {
        console.error("Erro detalhado ao criar pagamento:", JSON.stringify(error, null, 2));

        // Tenta extrair mensagem de erro do Mercado Pago se existir
        const errorMessage = error.cause?.description || error.message || "Erro ao processar pagamento";

        return NextResponse.json({
            success: false,
            error: errorMessage,
            details: error
        }, { status: 500 });
    }
}
