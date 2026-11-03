import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { describe, expect, it, vi } from "vitest";
import { API, makeMovie, mockFetch, renderRoutes } from "../test/utils";
import AxiosInstance from "./Axios";
import Edit, { movieLoader } from "./Edit";

vi.mock("./Axios", () => ({ default: { put: vi.fn() } }));
vi.mock("react-toastify", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}));

const movie = makeMovie({ id: 7 });

const renderEdit = async (entries = ["/edit/7"]) => {
    mockFetch(() => movie);
    renderRoutes([{ path: "/edit/:id", element: <Edit />, loader: movieLoader }], {
        initialEntries: entries,
        token: "tok",
    });
    // Wait for the loader to finish
    await screen.findByRole("heading", { name: "Update Movie" });
};

describe("movieLoader", () => {
    it("fetches the movie by id", async () => {
        const fetchMock = mockFetch(() => movie);
        expect(await movieLoader({ params: { id: "7" } })).toEqual(movie);
        expect(fetchMock).toHaveBeenCalledWith(`${API}api/movies/7`);
    });
});

describe("Edit", () => {
    it("pre-fills the form, with names as comma-separated text", async () => {
        await renderEdit();

        expect(screen.getByPlaceholderText("Title")).toHaveValue("Heat");
        expect(screen.getByPlaceholderText("Director")).toHaveValue("Michael Mann");
        expect(
            screen.getByPlaceholderText("Actor(s), separated by commas"),
        ).toHaveValue("Al Pacino, Robert De Niro");
        expect(
            screen.getByPlaceholderText("Actresses, separated by commas"),
        ).toHaveValue("Ashley Judd");
        expect(screen.getByPlaceholderText("Date Watched")).toHaveValue("2024-01-15");
        expect(screen.getByPlaceholderText("Released")).toHaveValue(1995);
    });

    it("puts the edited movie and goes home", async () => {
        const user = userEvent.setup();
        AxiosInstance.put.mockResolvedValue({ data: {} });
        await renderEdit();

        const actors = screen.getByPlaceholderText("Actor(s), separated by commas");
        await user.clear(actors);
        await user.type(actors, "Al Pacino, Val Kilmer");
        await user.click(screen.getByRole("button", { name: "Submit" }));

        expect(AxiosInstance.put).toHaveBeenCalledWith("api/movies/7/", {
            id: "7",
            title: "Heat",
            director: "Michael Mann",
            actors: ["Al Pacino", "Val Kilmer"],
            actresses: ["Ashley Judd"],
            date_watched: "2024-01-15",
            released: 1995,
            image: "https://example.com/heat.jpg",
        });
        expect(toast.success).toHaveBeenCalledWith("Film Updated Successfully");
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });

    it("shows an error when saving fails", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        AxiosInstance.put.mockRejectedValue(new Error("500"));
        await renderEdit();

        await userEvent.click(screen.getByRole("button", { name: "Submit" }));

        expect(toast.error).toHaveBeenCalledWith("Could not update the film");
        expect(screen.getByTestId("location")).toHaveTextContent("/edit/7");
    });

    it("goes back to the previous page", async () => {
        await renderEdit(["/?page=3", "/edit/7"]);

        await userEvent.click(screen.getByRole("button", { name: "Go Back" }));

        expect(screen.getByTestId("location")).toHaveTextContent("/?page=3");
    });
});
