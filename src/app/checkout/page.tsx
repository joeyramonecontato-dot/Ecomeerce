import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-24">
                <h1 className="text-3xl font-heading font-bold mb-8">
                    Finalizar <span className="text-gradient">Compra</span>
                </h1>

                <CheckoutForm />
            </main>

            <Footer />
        </div>
    );
}
