import { NavLink } from "react-router-dom";
import { useState } from "react";
import React from "react";

const navItems = [
    "Home",
    "Add Movie",
    "Search",
    "Best Picture",
    "Foreign Films",
];

const routePaths = [
    "/",
    "/add_movie",
    "Search",
    "best_picture",
    "foreign-films",
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const linkClass = ({ isActive }) =>
        isActive
            ? "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
            : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="flex flex-col">
            <nav className="bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <span className="text-xl font-bold">Movies</span>
                        </div>
                        <div className="hidden sm:flex flex-grow justify-center items-center space-x-8">
                            {navItems.map((item, index) => (
                                <React.Fragment key={item}>
                                    <NavLink
                                        to={routePaths[index]}
                                        className={linkClass}
                                    >
                                        {item}
                                    </NavLink>
                                    {index < navItems.length - 1 && (
                                        <span className="text-white">|</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="sm:hidden">
                            <button
                                onClick={toggleMenu}
                                className="text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item, index) => (
                            <NavLink
                                key={item}
                                to={routePaths[index]}
                                className={linkClass}
                                onClick={toggleMenu}
                            >
                                {item}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
