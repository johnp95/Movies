import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import { useAuth } from "../context/AuthContext";

const navItems = [
    { label: "Home", path: "/", protected: true },
    { label: "Add Movie", path: "/add_movie", protected: true },
    { label: "Search", path: "/search" },
    { label: "Best Picture", path: "/best_picture" },
    { label: "Foreign Films", path: "/foreign-films" },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const visibleItems = navItems.filter(
        (item) => !item.protected || isAuthenticated,
    );

    const linkClass = ({ isActive }) =>
        isActive
            ? "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
            : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate("/login");
    };

    // Login link or Logout button, shared by both menus
    const authLink = isAuthenticated ? (
        <button
            onClick={handleLogout}
            className="text-left text-white hover:bg-gray-900 rounded-md px-3 py-2"
        >
            Logout
        </button>
    ) : (
        <NavLink
            to="/login"
            className={linkClass}
            onClick={() => setIsMenuOpen(false)}
        >
            Login
        </NavLink>
    );

    return (
        <div className="flex flex-col">
            <nav className="bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="shrink-0">
                            <span className="text-xl font-bold">Movies</span>
                        </div>
                        <div className="hidden md:flex grow justify-center items-center space-x-4 lg:space-x-8">
                            {visibleItems.map((item, index) => (
                                <React.Fragment key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        end={item.path === "/"}
                                        className={linkClass}
                                    >
                                        {item.label}
                                    </NavLink>
                                    {index < visibleItems.length - 1 && (
                                        <span className="text-white">|</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="hidden md:block">{authLink}</div>
                        <div className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                aria-expanded={isMenuOpen}
                                className="p-2 rounded-md text-white hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white"
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
                <div className="md:hidden">
                    <div className="bg-blue-600 px-2 pt-2 pb-3 space-y-1 flex flex-col">
                        {visibleItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                className={linkClass}
                                onClick={toggleMenu}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        {authLink}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
