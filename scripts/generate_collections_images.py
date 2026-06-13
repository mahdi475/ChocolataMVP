"""
Generate 8 photorealistic chocolate-candy/truffle/praline images for the
Collections page using Gemini Nano Banana via Emergent LLM key.
"""

import asyncio
import base64
import os
import sys
from pathlib import Path

from emergentintegrations.llm.chat import LlmChat, UserMessage

OUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "collections"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPTS = [
    (
        "hero-truffles",
        "Cinematic ultra-wide editorial photograph of a luxurious arrangement of "
        "assorted gourmet chocolate truffles, pralines, and bonbons on a dark marble "
        "surface, dusted with cocoa powder, gold leaf accents, dramatic warm side "
        "lighting, deep chocolate browns and gold highlights, shallow depth of field, "
        "premium chocolate boutique aesthetic, very wide 16:9 composition, no text, no logos.",
    ),
    (
        "winter-truffles",
        "Photorealistic editorial photograph of spiced winter chocolate truffles "
        "dusted with cinnamon and cocoa powder, garnished with star anise and a "
        "cinnamon stick, on a rustic wooden board with a warm knit fabric in the "
        "background, cozy candlelight, deep red and brown tones, premium chocolate "
        "magazine style, horizontal 4:3 composition, no text, no logos.",
    ),
    (
        "romance-pralines",
        "Photorealistic editorial photograph of heart-shaped pink and red chocolate "
        "pralines and bonbons in an elegant open gift box on a soft blush satin "
        "background, scattered rose petals, soft romantic lighting, premium "
        "Valentine's confectionery aesthetic, dreamy pastel pink and gold tones, "
        "horizontal 4:3 composition, no text, no logos.",
    ),
    (
        "lunar-gold-bonbons",
        "Photorealistic editorial photograph of luxurious chocolate bonbons covered "
        "in real edible gold leaf, arranged in a red lacquer box with golden accents, "
        "scattered gold confetti, deep red silk background, festive lunar new year "
        "luxury aesthetic, dramatic warm lighting, premium confectionery style, "
        "horizontal 4:3 composition, no text, no logos.",
    ),
    (
        "self-care-truffles",
        "Photorealistic editorial photograph of dark chocolate truffles in a small "
        "ceramic dish next to a steaming cup of herbal tea, sprigs of fresh lavender, "
        "open book and soft knit blanket on a calm marble surface, soft natural "
        "afternoon light, muted lavender and chocolate tones, cozy self-care "
        "aesthetic, horizontal 4:3 composition, no text, no logos.",
    ),
    (
        "office-praline-box",
        "Photorealistic editorial photograph of an open premium gift box filled with "
        "an assortment of colorful chocolate pralines and bonbons in many shapes and "
        "designs, presented on a modern office desk with subtle blurred laptop and "
        "plant in background, bright daylight, cheerful inviting mood, premium "
        "confectionery style, horizontal 4:3 composition, no text, no logos.",
    ),
    (
        "celebration-bonbons",
        "Photorealistic editorial photograph of an elegant tiered tower of luxury "
        "chocolate bonbons and pralines decorated with gold leaf and edible flowers, "
        "set on a celebratory white table with soft bokeh fairy lights in the "
        "background, dramatic festive lighting, deep gold and ivory tones, premium "
        "wedding cake-style centerpiece, horizontal 4:3 composition, no text, no logos.",
    ),
    (
        "tasting-flight",
        "Photorealistic editorial photograph of a sophisticated chocolate tasting "
        "flight: a wooden tasting board with four square pieces of dark chocolate bars "
        "from different origins arranged in a row, each labeled with small tasting "
        "cards, paired with a wine glass, on a slate dark surface, warm museum-quality "
        "lighting, premium chocolate sommelier aesthetic, horizontal 4:3 composition, "
        "no text on the chocolate, no logos.",
    ),
]


async def generate_one(api_key: str, slug: str, prompt: str) -> bool:
    out_path = OUT_DIR / f"{slug}.png"
    if out_path.exists() and out_path.stat().st_size > 10_000:
        print(f"  [skip] {slug}.png exists ({out_path.stat().st_size} bytes)")
        return True

    print(f"  [gen]  {slug} ...", flush=True)
    chat = LlmChat(
        api_key=api_key,
        session_id=f"collections-{slug}",
        system_message="You generate photorealistic editorial photographs.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(
        modalities=["image", "text"]
    )

    try:
        _t, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
    except Exception as e:
        print(f"  [fail] {slug}: {type(e).__name__}: {e}")
        return False

    if not images:
        print(f"  [fail] {slug}: no image returned")
        return False

    data = base64.b64decode(images[0]["data"])
    out_path.write_bytes(data)
    print(f"  [ok]   {slug}.png ({len(data)} bytes)")
    return True


async def main() -> int:
    api_key = os.getenv("EMERGENT_LLM_KEY")
    if not api_key:
        print("ERROR: EMERGENT_LLM_KEY not set.", file=sys.stderr)
        return 1
    print(f"Generating {len(PROMPTS)} images into {OUT_DIR}")
    results = [(slug, await generate_one(api_key, slug, prompt)) for slug, prompt in PROMPTS]
    print("\n=== Summary ===")
    for slug, ok in results:
        print(f"  {'OK' if ok else 'FAIL'} {slug}")
    return 0 if all(ok for _, ok in results) else 2


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
