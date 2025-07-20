// src/components/ui/Testimonials.tsx
import { Star } from 'lucide-react';

const testimonials = [
    {
        name: "João Silva",
        text: "Transformou a maneira como eu gerencio meus projetos. A facilidade de uso e os resultados são incríveis. Recomendo a todos!",
        avatar: "JS"
    },
    {
        name: "Maria Garcia",
        text: "Excelente! Nunca pensei que conseguiria otimizar tanto meu tempo. A plataforma é intuitiva e o suporte é de primeira.",
        avatar: "MG"
    },
    {
        name: "Pedro Almeida",
        text: "Resultados impressionantes em pouco tempo. O plano vitalício foi o melhor investimento que fiz para o meu negócio este ano.",
        avatar: "PA"
    }
];

function TestimonialCard({ name, text, avatar }: { name: string, text: string, avatar: string }) {
    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-4">
                    {avatar}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{name}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                    </div>
                </div>
            </div>
            <p className="text-gray-600 text-sm">"{text}"</p>
        </div>
    );
}

export default function Testimonials() {
    return (
        <div className="w-full max-w-lg mt-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">O que nossos clientes dizem</h2>
            <div className="space-y-6">
                {testimonials.map((t, i) => (
                    <TestimonialCard key={i} name={t.name} text={t.text} avatar={t.avatar} />
                ))}
            </div>
        </div>
    );
}
