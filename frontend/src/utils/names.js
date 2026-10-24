// Actors and actresses are stored as lists but edited as "Name One, Name Two"
export const namesToText = (names) => (names || []).join(", ");

export const textToNames = (text) =>
    text
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
