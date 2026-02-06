interface HomeHeaderProps {
    userLevel?: number;
}

export default function HomeHeader({ userLevel = 0 }: HomeHeaderProps) {
    return (
        <header className="h-21 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
                <img src="/gate-learning-logo.png" alt="Gate Learning" className="w-32" />
            </div>

            {/* Right: User Level */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-500">Nivel actual:</span>
                    <span className="text-sm font-bold text-blue-600">{userLevel}</span>
                </div>
            </div>
        </header>
    );
}
