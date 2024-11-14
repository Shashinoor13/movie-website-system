"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const { user, isLoaded } = useUser();

    // Close the menu if clicking outside the nav
    useEffect(() => {
        const handleClickOutside = (event: { target: any; }) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navLinks = [
        { href: "/home", label: "Home" },
        { href: "/my-movies", label: "My Movies" },
        { href: "/recommendation", label: "Get Recommendation" },
        { href: "/about", label: "About" },
    ];

    const authLinks = [
        { href: "/profile", label: "Profile" },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const router = useRouter();

    return (
        <nav
            className="bg-primary text-white py-4 px-6 shadow-md fixed w-full z-50"
            ref={navRef}
        >
            <div className="mx-auto flex flex-col md:flex-row items-center justify-between">
                {/* Logo and Menu Toggle */}
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link href="/" className="text-xl font-bold">
                        <img src="/logo.svg" alt="Logo" className="h-8" />
                    </Link>
                    <button
                        className="md:hidden block text-white focus:outline-none ml-auto"
                        onClick={toggleMenu}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                    isMenuOpen
                                        ? "M6 18L18 6M6 6l12 12"
                                        : "M4 6h16M4 12h16M4 18h16"
                                }
                            />
                        </svg>
                    </button>
                </div>

                {/* Links and Auth Buttons */}
                <div
                    className={`${isMenuOpen ? "block" : "hidden"
                        } md:flex md:items-center md:space-x-4 mt-4 md:mt-0 w-full md:w-auto`}
                >
                    <ul className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mt-4 md:mt-0">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="block text-center md:text-left hover:underline py-2"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mt-4 md:mt-0">
                        <SignedOut>
                            {/* <SignInButton /> */}
                            <Button onClick={() => router.push("/login")}>Sign In</Button>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
