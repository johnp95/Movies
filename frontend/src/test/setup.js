import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom doesn't implement scrolling; usePagination scrolls to the top on page change
window.scrollTo = vi.fn();

afterEach(() => {
    cleanup();
    localStorage.clear();
});
