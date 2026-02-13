export interface Review {
    id: number;
    author: string;
    avatar?: string;
    rating: number;
    date: string;
    content: string;
    verified: boolean;
    images?: string[];
}

export const reviews: Review[] = [
    {
        id: 1,
        author: "Rafael M.",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        rating: 5,
        date: "Há 2 dias",
        content: "Produto excelente! Chegou super rápido e a qualidade é impressionante. Recomendo demais!",
        verified: true,
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=300&auto=format&fit=crop"
        ]
    },
    {
        id: 2,
        author: "Camila S.",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
        rating: 5,
        date: "Há 1 semana",
        content: "Estava em dúvida mas me surpreendi. O atendimento foi nota 10 e o produto é exatamente como na foto.",
        verified: true,
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop"
        ]
    },
    {
        id: 3,
        author: "João P.",
        rating: 4,
        date: "Há 2 semanas",
        content: "Muito bom, cumpre o que promete. Só a caixa que veio um pouco amassada, mas o produto intacto.",
        verified: true
    },
    {
        id: 4,
        author: "Beatriz L.",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
        rating: 5,
        date: "Há 3 semanas",
        content: "Melhor compra que fiz esse ano. O design é lindo!",
        verified: true
    }
];

export const faq = [
    {
        question: "Qual o prazo de entrega?",
        answer: "Nossos produtos são enviados em até 24h úteis. O prazo médio de entrega é de 7 a 15 dias úteis para todo o Brasil."
    },
    {
        question: "O site é confiável?",
        answer: "Sim! Utilizamos tecnologia de criptografia de ponta a ponta (SSL) e processamos pagamentos através das plataformas mais seguras do mercado."
    },
    {
        question: "Tem garantia?",
        answer: "Todos os produtos possuem garantia de 7 dias para devolução por arrependimento e 90 dias contra defeitos de fabricação."
    },
    {
        question: "Como acompanho meu pedido?",
        answer: "Após a compra, você receberá um código de rastreio por e-mail para acompanhar cada etapa da entrega."
    }
];
