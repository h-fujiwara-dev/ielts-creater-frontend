import { describe, expect, it } from "vitest";

import { difficultySchema, generationFormSchema, sectionSchema, topicSchema } from "@/lib/question-sets/schemas";

describe("sectionSchema", () => {
  it.each(["READING", "LISTENING"])("accepts %s", (value) => {
    expect(sectionSchema.safeParse(value).success).toBe(true);
  });

  it("rejects an unknown section", () => {
    expect(sectionSchema.safeParse("WRITING").success).toBe(false);
  });
});

describe("difficultySchema", () => {
  it.each(["BAND_4_5", "BAND_5_6", "BAND_6_7", "BAND_7_8_PLUS"])("accepts %s", (value) => {
    expect(difficultySchema.safeParse(value).success).toBe(true);
  });

  it("rejects an unknown difficulty", () => {
    expect(difficultySchema.safeParse("BAND_9").success).toBe(false);
  });
});

describe("topicSchema", () => {
  it("is optional", () => {
    expect(topicSchema.safeParse(undefined).success).toBe(true);
  });

  it("accepts up to 100 characters", () => {
    expect(topicSchema.safeParse("a".repeat(100)).success).toBe(true);
  });

  it("rejects more than 100 characters", () => {
    const result = topicSchema.safeParse("a".repeat(101));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("100文字以内で入力してください");
    }
  });
});

describe("generationFormSchema", () => {
  it("validates a full form without a topic", () => {
    const result = generationFormSchema.safeParse({
      section: "READING",
      difficulty: "BAND_6_7",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing section", () => {
    const result = generationFormSchema.safeParse({
      difficulty: "BAND_6_7",
    });
    expect(result.success).toBe(false);
  });
});
