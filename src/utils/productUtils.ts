import { Product } from "@/types/product";

// Função para normalizar nome do produto (remove variações comuns para agrupar)
function normalizeProductName(name: string): string {
    return name
        .toLowerCase()
        .replace(/\s+-\s+.*$/, '') // Remove sufixos com hífen " - Cor X"
        .replace(/\s+(preto|branco|azul|vermelho|verde|rosa|amarelo|cinza|prata|dourado).*$/i, '')
        .replace(/\s+(p|m|g|gg|xg|xxg)\b.*$/i, '')
        .replace(/\s+\d+v\b.*$/i, '') // Remove voltagem
        .trim();
}

export function getUniqueProducts(products: Product[]): Product[] {
    const groups: { [key: string]: Product[] } = {};

    // 1. Agrupar produtos similares
    products.forEach(product => {
        const normalizedName = normalizeProductName(product.name);
        // Usa as primeiras 4 palavras como chave de agrupamento aproximado se o nome for muito longo
        // ou o nome normalizado completo
        const key = normalizedName;

        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(product);
    });

    const uniqueProducts: Product[] = [];

    // 2. Selecionar o "Campeão" de cada grupo
    Object.values(groups).forEach(group => {
        // Ordena por relevância (salesCount) decrescente
        group.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));

        // Campeão (O mais vendido) sempre entra
        const champion = group[0];
        uniqueProducts.push(champion);

        // Regra de Variante Relevante (Opcional - "Dobro de relevância")
        // Como o campeão já é o mais relevante, tecnicamente nenhum outro será "dobro" dele.
        // O usuário disse: "se tivermos uma variante... ela tem que ser o dobro de relevante do item numero 1 selecionado"
        // Talvez "item numero 1" seja um limiar fixo? Ou talvez ele quis dizer "muito relevante".
        // Para simplificar e atender "vamos ter somente um item", vou manter apenas o champion por enquanto.
        // Se quiséssemos manter variantes muito fortes, a lógica seria comparar com o 2º lugar, mas ele nunca x2 o 1º.
    });

    return uniqueProducts;
}
