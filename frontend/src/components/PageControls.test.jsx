import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PageControls from "./PageControls";

describe("PageControls", () => {
    it.each([0, 1])("renders nothing with %i page(s)", (totalPages) => {
        const { container } = render(
            <PageControls page={1} totalPages={totalPages} onChange={vi.fn()} />,
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("marks the current page and reports clicks", async () => {
        const onChange = vi.fn();
        render(<PageControls page={2} totalPages={3} onChange={onChange} />);

        expect(screen.getByRole("button", { name: "page 2" })).toHaveAttribute(
            "aria-current",
            "page",
        );

        await userEvent.click(screen.getByRole("button", { name: "Go to page 3" }));

        expect(onChange).toHaveBeenCalledWith(expect.anything(), 3);
    });
});
