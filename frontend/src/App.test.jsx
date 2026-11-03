import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFetch } from "./test/utils";

// App builds its browser router at import time, so each test sets the URL
// first and imports a fresh copy
const renderAppAt = async (path, { token } = {}) => {
    if (token) localStorage.setItem("token", token);
    window.history.replaceState(null, "", path);
    const { default: App } = await import("./App");
    const { AuthProvider } = await import("./context/AuthContext");
    render(
        <AuthProvider>
            <App />
        </AuthProvider>,
    );
};

describe("App routes", () => {
    beforeEach(() => {
        vi.resetModules();
        mockFetch(() => []);
    });

    it.each(["/", "/add_movie", "/edit/1", "/delete/1"])(
        "sends logged-out visitors from %s to the login page",
        async (path) => {
            await renderAppAt(path);

            expect(
                await screen.findByRole("heading", { name: "Login" }),
            ).toBeInTheDocument();
            expect(window.location.pathname).toBe("/login");
        },
    );

    it("shows the home page when logged in", async () => {
        await renderAppAt("/", { token: "tok" });

        expect(
            await screen.findByPlaceholderText("Movie, Director, or Actor"),
        ).toBeInTheDocument();
        expect(window.location.pathname).toBe("/");
    });

    it("lets anyone search", async () => {
        await renderAppAt("/search");

        expect(
            await screen.findByRole("button", { name: "Sort By" }),
        ).toBeInTheDocument();
    });

    it("shows a 404 for unknown paths", async () => {
        await renderAppAt("/no-such-page");

        expect(
            await screen.findByRole("heading", { name: "404 Not Found" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    });
});
