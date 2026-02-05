import { LayoutGrid, Zap } from "lucide-react";

export default function Header() {
    return (
        <header className="h-22 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20 relative">

            <div className="flex items-center gap-3">
                <div>

                    <img src="/gate-learning-logo.png" alt="gate-learning" className="w-42" />
                </div>
            </div>

            {/* Right: Challenges Button */}
            <div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-gray-200 transition-colors duration-200 font-medium text-sm">
                    <Zap className="w-4 h-4 text-orange-500" />
                    Desafíos
                </button>
            </div>
        </header>
    );
}
