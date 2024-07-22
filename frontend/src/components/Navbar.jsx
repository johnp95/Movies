import * as React from "react";
import { NavLink } from "react-router-dom";

const navItems = ["Home", "Add Movie", "Search", "Best Picture"];
const routePaths = ["/", "/add_movie", "Search", "best_picture"];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const toggleDrawer = () => {
        setMobileOpen((prevState) => !prevState);
    };

    return (
        <div className="flex flex-col">
            <nav className="bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="text-xl font-bold">
                                    Movies
                                </span>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navItems.map((item, index) => (
                                    <NavLink
                                        key={item}
                                        to={routePaths[index]}
                                        className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        {item}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                        <div className="sm:hidden">
                            <button
                                onClick={toggleDrawer}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
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

            <div className={`sm:hidden ${mobileOpen ? "block" : "hidden"}`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={item}
                            to={routePaths[index]}
                            className="text-gray-800 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        >
                            {item}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
