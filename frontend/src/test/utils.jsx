import { render } from "@testing-library/react";
import {
    createMemoryRouter,
    RouterProvider,
    useLocation,
} from "react-router-dom";
import { vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";

export const API = "http://localhost:8000/";

export const makeMovie = (overrides = {}) => ({
    id: 1,
    title: "Heat",
    director: "Michael Mann",
    actors: ["Al Pacino", "Robert De Niro"],
    actresses: ["Ashley Judd"],
    date_watched: "2024-01-15",
    released: 1995,
    image: "https://example.com/heat.jpg",
    best_picture: false,
    language: "",
    ...overrides,
});

// Replaces global fetch; `handler` gets the URL and returns the JSON body
export const mockFetch = (handler) => {
    const fetchMock = vi.fn(async (url) => ({
        ok: true,
        json: async () => handler(String(url)),
    }));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
};

// Renders the current path and query so tests can check where navigation went
export const LocationDisplay = () => {
    const location = useLocation();
    return (
        <div data-testid="location">{location.pathname + location.search}</div>
    );
};

// Renders `routes` in a memory router inside AuthProvider. Every route also
// shows LocationDisplay, and unmatched paths render just LocationDisplay.
export const renderRoutes = (routes, { initialEntries = ["/"], token } = {}) => {
    if (token) localStorage.setItem("token", token);
    const withLocation = routes.map((route) => ({
        ...route,
        element: (
            <>
                {route.element}
                <LocationDisplay />
            </>
        ),
    }));
    const router = createMemoryRouter(
        [...withLocation, { path: "*", element: <LocationDisplay /> }],
        { initialEntries },
    );
    const result = render(
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>,
    );
    return { ...result, router };
};
