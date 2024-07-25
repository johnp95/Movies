import { NavLink } from "react-router-dom";

const navItems = [
    "Home",
    "Add Movie",
    "Search",
    "Best Picture",
    "Foreign Films",
    "Test Search",
];
const routePaths = [
    "/",
    "/add_movie",
    "Search",
    "best_picture",
    "foreign-films",
    "test-search",
];

const Navbar = () => {
    const linkClass = ({ isActive }) =>
        isActive
            ? "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
            : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

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
                                        className={linkClass}
                                    >
                                        {item}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
