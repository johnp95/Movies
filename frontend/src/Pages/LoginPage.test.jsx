import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { describe, expect, it, vi } from "vitest";
import AxiosInstance from "../components/Axios";
import { renderRoutes } from "../test/utils";
import LoginPage from "./LoginPage";

vi.mock("../components/Axios", () => ({ default: { post: vi.fn() } }));
vi.mock("react-toastify", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}));

const renderLogin = (options) =>
    renderRoutes([{ path: "/login", element: <LoginPage /> }], {
        initialEntries: ["/login"],
        ...options,
    });

const submit = async (username = "john", password = "secret") => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Username"), username);
    await user.type(screen.getByLabelText("Password"), password);
    await user.click(screen.getByRole("button", { name: "Login" }));
};

describe("LoginPage", () => {
    it("logs in and goes home", async () => {
        AxiosInstance.post.mockResolvedValue({ data: { token: "tok" } });
        renderLogin();

        await submit();

        expect(AxiosInstance.post).toHaveBeenCalledWith("api/token/", {
            username: "john",
            password: "secret",
        });
        expect(localStorage.getItem("token")).toBe("tok");
        expect(toast.success).toHaveBeenCalledWith("Logged in");
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });

    it("shows an error for bad credentials", async () => {
        AxiosInstance.post.mockRejectedValue({ response: { status: 400 } });
        renderLogin();

        await submit("john", "wrong");

        expect(toast.error).toHaveBeenCalledWith("Invalid username or password");
        expect(screen.getByTestId("location")).toHaveTextContent("/login");
        expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
    });

    it("shows a different error when the server can't be reached", async () => {
        AxiosInstance.post.mockRejectedValue(new Error("Network Error"));
        renderLogin();

        await submit();

        expect(toast.error).toHaveBeenCalledWith("Could not reach the server");
    });

    it("redirects home when already logged in", () => {
        renderLogin({ token: "tok" });

        expect(screen.queryByLabelText("Username")).not.toBeInTheDocument();
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });
});
