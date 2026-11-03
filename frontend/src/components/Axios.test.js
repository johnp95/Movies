import { describe, expect, it } from "vitest";
import AxiosInstance from "./Axios";

// Captures the outgoing request config instead of sending it
const sentConfig = async () => {
    const res = await AxiosInstance.get("api/movies/", {
        adapter: async (config) => ({
            data: config,
            status: 200,
            statusText: "OK",
            headers: {},
            config,
        }),
    });
    return res.data;
};

describe("AxiosInstance", () => {
    it("targets the dev API on port 8000", async () => {
        const config = await sentConfig();
        expect(config.baseURL).toBe("http://localhost:8000/");
    });

    it("attaches the token from localStorage", async () => {
        localStorage.setItem("token", "abc123");
        const config = await sentConfig();
        expect(config.headers.Authorization).toBe("Token abc123");
    });

    it("sends no Authorization header when logged out", async () => {
        const config = await sentConfig();
        expect(config.headers.Authorization).toBeUndefined();
    });
});
