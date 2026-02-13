import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-heading font-bold">
                    Pedido Realizado!
                </h1>

                <p className="text-gray-400">
                    Obrigado pela sua compra. Você receberá um e-mail com os detalhes do pedido e o código de rastreamento assim que o pagamento for confirmado.
                </p>

                <div className="pt-6 border-t border-white/10">
                    <p className="text-sm font-medium mb-4">O que fazer agora?</p>
                    <div className="space-y-3">
                        <Link href="/">
                            <Button className="w-full" size="lg" variant="neon">
                                Voltar para a Loja
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
