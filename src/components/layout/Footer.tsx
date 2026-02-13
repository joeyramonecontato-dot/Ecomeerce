import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-card border-t border-white/5 pt-16 pb-8 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-heading font-bold mb-4 block">
                            Impulso<span className="text-primary">&</span>Hype
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Sua curadoria diária dos produtos mais desejados da internet.
                            Tecnologia, Fitness e Lifestyle em um só lugar.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-white">Navegação</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-primary transition-colors">Início</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Loja</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
                            <li><Link href="/contacts" className="hover:text-primary transition-colors">Contato</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-white">Categorias</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/shop/supplements" className="hover:text-primary transition-colors">Suplementos</Link></li>
                            <li><Link href="/shop/tech" className="hover:text-primary transition-colors">Tech & Gadgets</Link></li>
                            <li><Link href="/shop/equipment" className="hover:text-primary transition-colors">Musculação</Link></li>
                            <li><Link href="/shop/apparel" className="hover:text-primary transition-colors">Moda Fitness</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-white">Pagamento Seguro</h4>
                        <div className="flex gap-4 items-center opacity-70">
                            {/* Ícones de pagamento simplificados para MVP */}
                            <div className="w-10 h-6 bg-white/10 rounded" title="Pix"></div>
                            <div className="w-10 h-6 bg-white/10 rounded" title="Mastercard"></div>
                            <div className="w-10 h-6 bg-white/10 rounded" title="Visa"></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© 2026 Impulso & Hype. Todos os direitos reservados. <span className="text-gray-700 text-[10px] ml-2">v0.1.1</span></p>
                    <div className="flex gap-4">
                        <Link href="/privacy">Privacidade</Link>
                        <Link href="/terms">Termos de Uso</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
