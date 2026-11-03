import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { describe, expect, it, vi } from "vitest";
import { renderRoutes } from "../test/utils";
import AddMovie from "./AddMovie";
import AxiosInstance from "./Axios";

vi.mock("./Axios", () => ({ default: { post: vi.fn() } }));
vi.mock("react-toastify", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}));

const renderAddMovie = () =>
    renderRoutes([{ path: "/add_movie", element: <AddMovie /> }], {
        initialEntries: ["/add_movie"],
        token: "tok",
    });

const fillForm = async () => {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Title"), "Heat");
    await user.type(screen.getByPlaceholderText("Director"), "Michael Mann");
    await user.type(
        screen.getByPlaceholderText("Actor(s), separated by commas"),
        "Al Pacino,  Robert De Niro, ",
    );
    await user.type(
        screen.getByPlaceholderText("Actresses, separated by commas"),
        "Ashley Judd",
    );
    // user-event can't type into date inputs reliably in jsdom
    fireEvent.change(screen.getByPlaceholderText("Date Watched"), {
        target: { value: "2024-01-15" },
    });
    await user.type(screen.getByPlaceholderText("Released"), "1995");
    await user.type(screen.getByPlaceholderText("Image"), "https://example.com/heat.jpg");
    await user.click(screen.getByRole("button", { name: "Add Movie" }));
};

describe("AddMovie", () => {
    it("posts the movie with names split into lists, then goes home", async () => {
        AxiosInstance.post.mockResolvedValue({ data: {} });
        renderAddMovie();

        await fillForm();

        expect(AxiosInstance.post).toHaveBeenCalledWith("api/movies/", {
            title: "Heat",
            director: "Michael Mann",
            actors: ["Al Pacino", "Robert De Niro"],
            actresses: ["Ashley Judd"],
            date_watched: "2024-01-15",
            released: 1995,
            image: "https://example.com/heat.jpg",
        });
        expect(toast.success).toHaveBeenCalledWith("Film Added Successfully");
        expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
    });

    it("stays on the form and shows an error when saving fails", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        AxiosInstance.post.mockRejectedValue(new Error("500"));
        renderAddMovie();

        await fillForm();

        expect(toast.error).toHaveBeenCalledWith("Could not add the film");
        expect(screen.getByTestId("location")).toHaveTextContent("/add_movie");
    });

    it("doesn't submit while required fields are empty", async () => {
        renderAddMovie();

        await userEvent.click(screen.getByRole("button", { name: "Add Movie" }));

        expect(AxiosInstance.post).not.toHaveBeenCalled();
    });
});
