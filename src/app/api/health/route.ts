import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    try {
        // Tenta uma query simples
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({
            status: 'Conectado ao Banco de Dados!',
            env: process.env.DATABASE_URL ? 'Variável DATABASE_URL encontrada' : 'Variável DATABASE_URL AUSENTE'
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'Erro na conexão',
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
