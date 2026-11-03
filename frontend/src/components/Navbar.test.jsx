import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderRoutes } from "../test/utils";
import Navbar from "./Navbar";

const renderNavbar = (options) =>
    renderRoutes([{ path: "/*", element: <Navbar /> }], {
        initialEntries: ["/search"],
        ...options,
    });

describe("Navbar", () => {
    it("shows only public links and Login when logged out", () => {
        renderNavbar();

        expect(screen.getByRole("link", { name: "Search" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Best Picture" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Foreign Films" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Add Movie" })).not.toBeInTheDocument();
    });

    it("shows protected links and Logout when logged in", () => {
        renderNavbar({ token: "tok" });

        expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Add Movie" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
    });

    it("highlights the current page", () => {
        renderNavbar();
        expect(screen.getByRole("link", { name: "Search" })).toHaveClass("bg-black");
        expect(screen.getByRole("link", { name: "Best Picture" })).not.toHaveClass("bg-black");
    });

    it("logs out and goes to the login page", async () => {
        renderNavbar({ token: "tok" });

        await userEvent.click(screen.getByRole("button", { name: "Logout" }));

        expect(localStorage.getItem("token")).toBeNull();
        expect(screen.getByTestId("location")).toHaveTextContent("/login");
        expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    });

    it("toggles the mobile menu", async () => {
        const user = userEvent.setup();
        renderNavbar();
        const menuButton = screen.getByRole("button", { name: "Open main menu" });

        expect(menuButton).toHaveAttribute("aria-expanded", "false");
        expect(screen.getAllByRole("link", { name: "Search" })).toHaveLength(1);

        await user.click(menuButton);
        expect(menuButton).toHaveAttribute("aria-expanded", "true");
        expect(screen.getAllByRole("link", { name: "Search" })).toHaveLength(2);

        // Picking a page closes the menu
        await user.click(screen.getAllByRole("link", { name: "Best Picture" })[1]);
        expect(menuButton).toHaveAttribute("aria-expanded", "false");
        expect(screen.getByTestId("location")).toHaveTextContent("/best-picture");
    });
});
