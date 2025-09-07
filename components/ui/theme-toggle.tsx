
"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const buttonRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setMounted(true);
        setIsDark(theme === "dark");
    }, [theme]);

    if (!mounted) {
        return null;
    }

    const animateThemeChange = async () => {
        if (!buttonRef.current) {
            setTheme(isDark ? "light" : "dark");
            return;
        }

        await (document as any).startViewTransition?.(() => {
            flushSync(() => {
                const next = isDark ? "light" : "dark";
                setTheme(next);
                setIsDark(next === "dark");
            });
        })?.ready;

        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect();
        const y = top + height / 2;
        const x = left + width / 2;

        const right = window.innerWidth - left;
        const bottom = window.innerHeight - top;
        const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRad}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 700,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            },
        );
    };

    return (
        <div
            ref={buttonRef}
            className="cursor-pointer"
            onClick={animateThemeChange}
            aria-label="Toggle theme"
            role="button"
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-white" />
            ) : (
                <Moon className="h-5 w-5 text-black" />
            )}
        </div>
    );
}

