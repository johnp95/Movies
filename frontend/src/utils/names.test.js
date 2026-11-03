import { describe, expect, it } from "vitest";
import { namesToText, textToNames } from "./names";

describe("namesToText", () => {
    it("joins names with a comma and space", () => {
        expect(namesToText(["Al Pacino", "Robert De Niro"])).toBe(
            "Al Pacino, Robert De Niro",
        );
    });

    it("returns an empty string for missing or empty lists", () => {
        expect(namesToText([])).toBe("");
        expect(namesToText(null)).toBe("");
        expect(namesToText(undefined)).toBe("");
    });
});

describe("textToNames", () => {
    it("splits on commas and trims whitespace", () => {
        expect(textToNames(" Al Pacino ,Robert De Niro  ")).toEqual([
            "Al Pacino",
            "Robert De Niro",
        ]);
    });

    it("drops empty entries", () => {
        expect(textToNames("Al Pacino,, ,Val Kilmer,")).toEqual([
            "Al Pacino",
            "Val Kilmer",
        ]);
        expect(textToNames("")).toEqual([]);
    });

    it("round-trips with namesToText", () => {
        const names = ["Al Pacino", "Robert De Niro", "Val Kilmer"];
        expect(textToNames(namesToText(names))).toEqual(names);
    });
});
