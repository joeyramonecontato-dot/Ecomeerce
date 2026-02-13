"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/useCart";
import { useState } from "react";
import { Loader2, CreditCard, Banknote, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

// Schema de Validação
const checkoutSchema = z.object({
    name: z.string().min(3, "Nome completo é obrigatório"),
    email: z.string().email("E-mail inválido"),
    cpf: z.string().min(11, "CPF inválido"), // Validação simples de tamanho por enquanto
    phone: z.string().min(10, "Telefone inválido"),
    cep: z.string().min(8, "CEP inválido"),
    address: z.string().min(5, "Endereço obrigatório"),
    number: z.string().min(1, "Número obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, "Bairro obrigatório"),
    city: z.string().min(2, "Cidade obrigatória"),
    state: z.string().length(2, "Estado inválido"),
    paymentMethod: z.enum(["pix", "card", "boleto"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
    const { items, getCartTotal, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const totals = getCartTotal();

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            paymentMethod: "pix",
            amount: totals.total // Campo virtual só pra lógica
        } as any
    });

    const onSubmit = async (data: CheckoutFormValues) => {
        if (items.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, items })
            });

            const result = await response.json();

            if (result.success && result.checkoutUrl) {
                // Limpar carrinho antes de redirecionar (ou depois? Melhor aqui para não duplicar se voltar)
                clearCart();
                window.location.href = result.checkoutUrl;
            } else {
                throw new Error(result.error || "Erro desconhecido");
            }

        } catch (error) {
            console.error(error);
            alert("Erro ao processar pagamento. Tente novamente.");
            setIsLoading(false);
        }
    };

    // Máscaras manuais simples
    const handleCepMask = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, "$1-$2");
        form.setValue("cep", value);
    };

    const handleCpfMask = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 9) value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");
        else if (value.length > 6) value = value.replace(/^(\d{3})(\d{3})(\d)/, "$1.$2.$3");
        else if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, "$1.$2");
        form.setValue("cpf", value);
    };

    const handlePhoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 10) value = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        else if (value.length > 6) value = value.replace(/^(\d{2})(\d{4})(\d)/, "($1) $2-$3");
        else if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, "($1) $2");
        form.setValue("phone", value);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-2">

            {/* Coluna Esquerda: Dados */}
            <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border border-white/5 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        📋 Dados Pessoais
                    </h2>

                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nome Completo</label>
                            <input
                                {...form.register("name")}
                                className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Seu nome completo"
                            />
                            {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CPF</label>
                                <input
                                    {...form.register("cpf")}
                                    onChange={handleCpfMask}
                                    maxLength={14}
                                    className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="000.000.000-00"
                                />
                                {form.formState.errors.cpf && <p className="text-red-500 text-xs">{form.formState.errors.cpf.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Telefone</label>
                                <input
                                    {...form.register("phone")}
                                    onChange={handlePhoneMask}
                                    maxLength={15}
                                    className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="(11) 99999-9999"
                                />
                                {form.formState.errors.phone && <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">E-mail</label>
                            <input
                                {...form.register("email")}
                                type="email"
                                className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="seu@email.com"
                            />
                            {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-white/5 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        📍 Endereço
                    </h2>

                    <div className="grid gap-4">
                        <div className="flex gap-4">
                            <div className="space-y-2 w-1/3">
                                <label className="text-sm font-medium">CEP</label>
                                <input
                                    {...form.register("cep")}
                                    onChange={handleCepMask}
                                    maxLength={9}
                                    className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="00000-000"
                                />
                                {form.formState.errors.cep && <p className="text-red-500 text-xs">{form.formState.errors.cep.message}</p>}
                            </div>
                            <div className="flex items-end pb-0.5">
                                <Button type="button" variant="outline" size="sm" onClick={() => alert("Busca de CEP em breve")}>
                                    Buscar
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-[3fr_1fr] gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Endereço</label>
                                <input
                                    {...form.register("address")}
                                    className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Rua, Avenida..."
                                />
                                {form.formState.errors.address && <p className="text-red-500 text-xs">{form.formState.errors.address.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Número</label>
                                <input
                                    {...form.register("number")}
                                    className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="123"
                                />
                                {form.formState.errors.number && <p className="text-red-500 text-xs">{form.formState.errors.number.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bairro</label>
                                <input
                                    {...form.register("neighborhood")}
                                    className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Bairro"
                                />
                                {form.formState.errors.neighborhood && <p className="text-red-500 text-xs">{form.formState.errors.neighborhood.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cidade</label>
                                <input
                                    {...form.register("city")}
                                    className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Cidade"
                                />
                                {form.formState.errors.city && <p className="text-red-500 text-xs">{form.formState.errors.city.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Estado</label>
                            <select
                                {...form.register("state")}
                                className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Selecione</option>
                                <option value="SP">São Paulo</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="PR">Paraná</option>
                                <option value="SC">Santa Catarina</option>
                                {/* Adicionar outros estados se necessário, mas para MVP ok */}
                            </select>
                            {form.formState.errors.state && <p className="text-red-500 text-xs">{form.formState.errors.state.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-white/5 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        💳 Pagamento
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        <label className={cn(
                            "cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 transition-all hover:bg-accent/5",
                            form.watch("paymentMethod") === "pix" ? "border-primary bg-primary/10" : "border-white/10"
                        )}>
                            <input type="radio" value="pix" {...form.register("paymentMethod")} className="hidden" />
                            <QrCode className="w-6 h-6 text-primary" />
                            <span className="text-sm font-medium">PIX</span>
                            <span className="text-[10px] text-green-400 font-bold">-10% OFF</span>
                        </label>

                        <label className={cn(
                            "cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 transition-all hover:bg-accent/5",
                            form.watch("paymentMethod") === "card" ? "border-primary bg-primary/10" : "border-white/10"
                        )}>
                            <input type="radio" value="card" {...form.register("paymentMethod")} className="hidden" />
                            <CreditCard className="w-6 h-6 text-primary" />
                            <span className="text-sm font-medium">Cartão</span>
                            <span className="text-[10px] text-gray-400">Até 12x</span>
                        </label>

                        <label className={cn(
                            "cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 transition-all hover:bg-accent/5",
                            form.watch("paymentMethod") === "boleto" ? "border-primary bg-primary/10" : "border-white/10"
                        )}>
                            <input type="radio" value="boleto" {...form.register("paymentMethod")} className="hidden" />
                            <Banknote className="w-6 h-6 text-primary" />
                            <span className="text-sm font-medium">Boleto</span>
                            <span className="text-[10px] text-green-400 font-bold">-10% OFF</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Coluna Direita: Resumo */}
            <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border border-white/5 space-y-4 sticky top-24">
                    <h2 className="text-xl font-bold">Resumo do Pedido</h2>

                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <div>
                                    <span className="font-medium">{item.name}</span>
                                    <div className="text-gray-400 text-xs">Qtd: {item.quantity}</div>
                                </div>
                                <span className="font-medium">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Subtotal</span>
                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.total)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Frete</span>
                            <span className="text-primary font-bold">GRÁTIS</span>
                        </div>

                        {/* Exemplo de desconto se fosse pix */}
                        {(form.watch("paymentMethod") === "pix" || form.watch("paymentMethod") === "boleto") && (
                            <div className="flex justify-between text-sm text-green-400">
                                <span>Desconto (10%)</span>
                                <span>- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.total * 0.1)}</span>
                            </div>
                        )}

                        <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-4 mt-2">
                            <span>Total</span>
                            <span className="text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                    (form.watch("paymentMethod") === "pix" || form.watch("paymentMethod") === "boleto")
                                        ? totals.total * 0.9
                                        : totals.total
                                )}
                            </span>
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full text-lg h-12 mt-4" variant="neon">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            "Finalizar Pedido"
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
