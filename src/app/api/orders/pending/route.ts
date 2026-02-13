import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const orders = await getOrders();
        // Filtra pedidos com status 'pendente' e pagamento confirmado (se houver essa distinção futura)
        // Por enquanto, vamos assumir que tudo que está salvo já foi pago via MP ou está aguardando processamento.
        // Idealmente filtraríamos por status 'paid' ou 'approved' do MP.
        // Mas como nosso checkout simplificado salva tudo, vamos pegar os que ainda não foram processados pelo agente.

        const pendingOrders = orders.filter((order: any) =>
            !order.agentProcessed && // Flag para dizer se o agente já pegou
            !order.shipped // Se já foi enviado
        );

        return NextResponse.json({ success: true, orders: pendingOrders });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Erro ao buscar fila de pedidos" }, { status: 500 });
    }
}
