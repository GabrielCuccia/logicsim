"use client";

import { useState, useEffect } from "react";
import HomeSidebar from "../components/home/HomeSidebar";
import HomeHeader from "../components/home/HomeHeader";
import { getCurrentLevel } from "../lib/progress";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [userLevel, setUserLevel] = useState(1);

    useEffect(() => {
        setUserLevel(getCurrentLevel());
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <HomeHeader userLevel={userLevel} />
            <div className="flex flex-1 overflow-hidden">
                <HomeSidebar />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
