import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function PromoBanners() {
    return (
        <section className="py-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Banner 1 */}
                    <Link href="/shop/supplements" className="relative h-64 md:h-80 rounded-2xl overflow-hidden group">
                        <Image
                            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
                            alt="Suplementos"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-8 flex flex-col justify-center items-start">
                            <span className="text-primary font-bold tracking-wider text-sm mb-2 uppercase">Performance</span>
                            <h3 className="text-3xl font-heading font-bold text-white mb-4 max-w-[200px]">Suplementos de Elite</h3>
                            <Button size="sm" className="group-hover:bg-primary group-hover:text-black transition-colors pointer-events-none">
                                Ver Ofertas <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    </Link>

                    {/* Banner 2 */}
                    <Link href="/shop/equipment" className="relative h-64 md:h-80 rounded-2xl overflow-hidden group">
                        <Image
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                            alt="Acessórios"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent p-8 flex flex-col justify-center items-start">
                            <span className="text-blue-400 font-bold tracking-wider text-sm mb-2 uppercase">Equipamentos</span>
                            <h3 className="text-3xl font-heading font-bold text-white mb-4 max-w-[200px]">Treine em Casa</h3>
                            <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-black transition-colors pointer-events-none">
                                Confira Agora <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
