"use client";

import { Home, FolderOpen, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { icon: <Home className="w-5 h-5" />, label: "Home", href: "/dashboard" },
    { icon: <FolderOpen className="w-5 h-5" />, label: "Proyectos Libres", href: "/dashboard/projects" },
    { icon: <Zap className="w-5 h-5" />, label: "Desafíos", href: "/dashboard/challenges" },
];

export default function HomeSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col py-4">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200
              ${isActive
                                ? "bg-blue-500 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                            }
            `}
                    >
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </aside>
    );
}
