import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderRoutes } from "../test/utils";
import RequireAuth from "./RequireAuth";

const routes = [
    {
        element: <RequireAuth />,
        children: [{ path: "/add_movie", element: <p>Add movie form</p> }],
    },
];

describe("RequireAuth", () => {
    it("redirects to /login when logged out", () => {
        renderRoutes(routes, { initialEntries: ["/add_movie"] });

        expect(screen.queryByText("Add movie form")).not.toBeInTheDocument();
        expect(screen.getByTestId("location")).toHaveTextContent("/login");
    });

    it("renders the protected page when logged in", () => {
        renderRoutes(routes, { initialEntries: ["/add_movie"], token: "t" });

        expect(screen.getByText("Add movie form")).toBeInTheDocument();
        expect(screen.getByTestId("location")).toHaveTextContent("/add_movie");
    });
});
