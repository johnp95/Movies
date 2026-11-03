import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AxiosInstance from "../components/Axios";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("../components/Axios", () => ({ default: { post: vi.fn() } }));

const renderAuth = () => renderHook(() => useAuth(), { wrapper: AuthProvider });

describe("AuthContext", () => {
    it("starts logged out with no stored token", () => {
        const { result } = renderAuth();
        expect(result.current.token).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    it("restores a token saved in localStorage", () => {
        localStorage.setItem("token", "saved");
        const { result } = renderAuth();
        expect(result.current.token).toBe("saved");
        expect(result.current.isAuthenticated).toBe(true);
    });

    it("logs in by requesting a token and storing it", async () => {
        AxiosInstance.post.mockResolvedValue({ data: { token: "new-token" } });
        const { result } = renderAuth();

        await act(() => result.current.login("john", "secret"));

        expect(AxiosInstance.post).toHaveBeenCalledWith("api/token/", {
            username: "john",
            password: "secret",
        });
        expect(localStorage.getItem("token")).toBe("new-token");
        expect(result.current.isAuthenticated).toBe(true);
    });

    it("stays logged out and rethrows when login fails", async () => {
        AxiosInstance.post.mockRejectedValue(new Error("400"));
        const { result } = renderAuth();

        await expect(
            act(() => result.current.login("john", "wrong")),
        ).rejects.toThrow("400");
        expect(localStorage.getItem("token")).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    it("logs out by clearing the token", () => {
        localStorage.setItem("token", "saved");
        const { result } = renderAuth();

        act(() => result.current.logout());

        expect(localStorage.getItem("token")).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });
});
