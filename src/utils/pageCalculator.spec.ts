import { describe, it, expect } from "vitest";
import {
  calculatePages,
  getGenrePageRange,
  calculateTotalPages,
  formatPageInfo,
  WORDS_PER_PAGE_BY_GENRE,
  type IPageRange,
} from "./pageCalculator";

describe("calculatePages", () => {
  it("returns ceil of wordCount / 250", () => {
    expect(calculatePages(0)).toBe(0);
    expect(calculatePages(250)).toBe(1);
    expect(calculatePages(251)).toBe(2);
    expect(calculatePages(500)).toBe(2);
  });
});

describe("getGenrePageRange", () => {
  it("returns default range when genre is null or undefined", () => {
    const defaultRange: IPageRange = { min: 50000, max: 90000, average: 70000 };
    expect(getGenrePageRange(null)).toEqual(defaultRange);
    expect(getGenrePageRange(undefined)).toEqual(defaultRange);
  });

  it("returns romance range for romance genre", () => {
    expect(getGenrePageRange("romance")).toEqual(WORDS_PER_PAGE_BY_GENRE["romance"]);
    expect(getGenrePageRange("Romance")).toEqual(WORDS_PER_PAGE_BY_GENRE["romance"]);
  });

  it("returns fiction range for fiction genre", () => {
    expect(getGenrePageRange("fiction")).toEqual(WORDS_PER_PAGE_BY_GENRE["fiction"]);
  });

  it("normalizes accent in genre key", () => {
    expect(getGenrePageRange("ficção")).toEqual(WORDS_PER_PAGE_BY_GENRE["fiction"]);
  });

  it("returns short-story range for short-story", () => {
    expect(getGenrePageRange("short-story")).toEqual(WORDS_PER_PAGE_BY_GENRE["short-story"]);
  });

  it("returns default for unknown genre", () => {
    const defaultRange: IPageRange = { min: 50000, max: 90000, average: 70000 };
    expect(getGenrePageRange("unknown-genre")).toEqual(defaultRange);
  });
});

describe("calculateTotalPages", () => {
  it("returns pages, range and isWithinRange", () => {
    const result = calculateTotalPages(70000, "fiction");
    expect(result.pages).toBe(280);
    expect(result.range).toEqual(WORDS_PER_PAGE_BY_GENRE["fiction"]);
    expect(result.isWithinRange).toBe(true);
  });

  it("sets isWithinRange false when below min", () => {
    const result = calculateTotalPages(10000, "fiction");
    expect(result.isWithinRange).toBe(false);
  });

  it("sets isWithinRange false when above max", () => {
    const result = calculateTotalPages(100000, "fiction");
    expect(result.isWithinRange).toBe(false);
  });
});

describe("formatPageInfo", () => {
  it("formats when within range", () => {
    const s = formatPageInfo(70000, "fiction");
    expect(s).toContain("280 páginas");
    expect(s).toContain("palavras");
    expect(s).toMatch(/70[,.]?000/);
    expect(s).not.toContain("Faltam");
    expect(s).not.toContain("acima");
  });

  it("includes missing words when below min", () => {
    const s = formatPageInfo(10000, "fiction");
    expect(s).toContain("Faltam");
  });

  it("includes excess words when above max", () => {
    const s = formatPageInfo(100000, "fiction");
    expect(s).toContain("acima do máximo");
  });
});
