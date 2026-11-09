import { describe, expect, it } from "vitest";
import { activeSocials } from "@/config/site";

describe("site config", () => {
  it("only lists socials that have a URL", () => {
    expect(activeSocials.map((s) => s.key)).toEqual(["linkedin"]);
  });
});
