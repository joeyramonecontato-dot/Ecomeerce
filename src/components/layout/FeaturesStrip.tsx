import { Truck, CreditCard, ShieldCheck, Award } from 'lucide-react';

const features = [
    {
        icon: Truck,
        title: 'Frete Grátis',
        description: 'Para compras acima de R$ 299'
    },
    {
        icon: CreditCard,
        title: 'Até 12x Sem Juros',
        description: 'No cartão de crédito'
    },
    {
        icon: Award,
        title: 'Garantia de Qualidade',
        description: 'Produtos 100% originais'
    },
    {
        icon: ShieldCheck,
        title: 'Compra Segura',
        description: 'Seus dados protegidos'
    }
];

export function FeaturesStrip() {
    return (
        <div className="bg-secondary/10 border-y border-white/5 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-primary/20 group">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <feature.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm uppercase tracking-wide">{feature.title}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
