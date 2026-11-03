import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { describe, expect, it, vi } from "vitest";
import { makeMovie, renderRoutes } from "../test/utils";
import AxiosInstance from "./Axios";
import Delete from "./Delete";

vi.mock("./Axios", () => ({ default: { get: vi.fn(), delete: vi.fn() } }));
vi.mock("react-toastify", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}));

const renderDelete = () => {
    AxiosInstance.get.mockResolvedValue({ data: makeMovie({ id: 7 }) });
    renderRoutes([{ path: "/delete/:id", element: <Delete /> }], {
        initialEntries: ["/delete/7"],
        token: "tok",
    });
};

describe("Delete", () => {
    it("loads the movie and asks for confirmation", async () => {
        renderDelete();

        expect(await screen.findByText("Heat")).toBeInTheDocument();
        expect(AxiosInstance.get).toHaveBeenCalledWith("api/movies/7/");
        expect(AxiosInstance.delete).not.toHaveBeenCalled();
    });

    it("deletes the movie and goes home", async () => {
        AxiosInstance.delete.mockResolvedValue({});
        renderDelete();

        await userEvent.click(await screen.findByRole("button", { name: "Delete" }));

        expect(AxiosInstance.delete).toHaveBeenCalledWith("api/movies/7/");
        expect(toast.success).toHaveBeenCalledWith("Film Deleted Successfully");
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });

    it("shows an error when deleting fails", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        AxiosInstance.delete.mockRejectedValue(new Error("403"));
        renderDelete();

        await userEvent.click(await screen.findByRole("button", { name: "Delete" }));

        expect(toast.error).toHaveBeenCalledWith("Could not delete the film");
        expect(screen.getByTestId("location")).toHaveTextContent("/delete/7");
    });
});
