import { describe, it, expect } from "vitest";
import { transformers } from "./api-transformers";

describe("transformers", () => {
  it("book converts camelCase keys to snake_case per keyMap", () => {
    const input = { tenantId: "t1", userId: "u1", title: "My Book", createdAt: "2024-01-01" };
    const out = transformers.book(input);
    expect(out).toHaveProperty("tenant_id", "t1");
    expect(out).toHaveProperty("user_id", "u1");
    expect(out).toHaveProperty("title", "My Book");
    expect(out).toHaveProperty("created_at", "2024-01-01");
  });

  it("books maps array", () => {
    const input = [{ id: "1", title: "A" }, { id: "2", title: "B" }];
    const out = transformers.books(input);
    expect(out).toHaveLength(2);
    expect(out[0]).toHaveProperty("title", "A");
    expect(out[1]).toHaveProperty("title", "B");
  });

  it("chapter converts camelCase to snake_case", () => {
    const input = { bookId: "b1", chapterNumber: 1, wordCount: 100 };
    const out = transformers.chapter(input);
    expect(out).toHaveProperty("book_id", "b1");
    expect(out).toHaveProperty("chapter_number", 1);
    expect(out).toHaveProperty("word_count", 100);
  });

  it("character converts camelCase to snake_case", () => {
    const input = { bookId: "b1", avatarUrl: "https://x.com" };
    const out = transformers.character(input);
    expect(out).toHaveProperty("book_id", "b1");
    expect(out).toHaveProperty("avatar_url", "https://x.com");
  });

  it("handles null or non-object", () => {
    expect(transformers.book(null as never)).toBeNull();
  });
});
