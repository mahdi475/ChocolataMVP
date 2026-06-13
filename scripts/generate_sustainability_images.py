"""
One-time script to generate photorealistic images for the Sustainability page
using Gemini Nano Banana (gemini-3.1-flash-image-preview) via Emergent LLM key.

Run from /app:
    EMERGENT_LLM_KEY=sk-emergent-... python3 scripts/generate_sustainability_images.py
"""

import asyncio
import base64
import os
import sys
from pathlib import Path

from emergentintegrations.llm.chat import LlmChat, UserMessage

OUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "sustainability"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPTS = [
    (
        "cacao-farming",
        "Photorealistic editorial photograph of ripe orange and yellow cacao pods "
        "hanging from a healthy cacao tree on a small ethical farm in Latin America. "
        "Soft natural sunlight filtered through tropical leaves, lush green background, "
        "shallow depth of field, warm golden hour tones, premium documentary style, "
        "horizontal 4:3 composition, no text, no logos.",
    ),
    (
        "artisan-makers",
        "Photorealistic editorial photograph of an artisan chocolatier's hands tempering "
        "glossy dark chocolate on a marble worktop with a metal spatula, warm workshop "
        "lighting, soft shadows, focused craftsmanship, premium food magazine style, "
        "horizontal 4:3 composition, no text, no logos.",
    ),
    (
        "small-batch",
        "Photorealistic editorial photograph of small-batch artisan dark chocolate bars "
        "being poured into wooden molds in a tidy craft chocolate workshop, melted "
        "chocolate flowing, copper bowl, warm cinematic lighting, shallow depth of "
        "field, premium food magazine aesthetic, horizontal 4:3 composition, no text, "
        "no logos.",
    ),
    (
        "transparency",
        "Photorealistic editorial photograph of fermented cocoa beans being inspected "
        "by hand on a wooden tray at a traceable origin farm, natural daylight, "
        "earthy tones, raw beans in focus, hands gently examining beans, documentary "
        "ethical sourcing style, horizontal 4:3 composition, no text, no logos.",
    ),
    (
        "eco-packaging",
        "Photorealistic editorial photograph of minimalist craft chocolate bars wrapped "
        "in recycled kraft paper and natural twine on a wooden surface with a sprig of "
        "fresh leaves, eco-friendly compostable packaging aesthetic, soft natural light, "
        "muted earthy tones, premium sustainable brand style, horizontal 4:3 composition, "
        "no text, no logos.",
    ),
]


async def generate_one(api_key: str, slug: str, prompt: str) -> bool:
    """Generate a single image and save it. Returns True on success."""
    out_path = OUT_DIR / f"{slug}.png"
    if out_path.exists() and out_path.stat().st_size > 10_000:
        print(f"  [skip] {slug}.png already exists ({out_path.stat().st_size} bytes)")
        return True

    print(f"  [gen]  {slug} ...", flush=True)
    chat = LlmChat(
        api_key=api_key,
        session_id=f"sustain-{slug}",
        system_message="You generate photorealistic editorial photographs.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(
        modalities=["image", "text"]
    )

    msg = UserMessage(text=prompt)
    try:
        _text, images = await chat.send_message_multimodal_response(msg)
    except Exception as e:
        print(f"  [fail] {slug}: {type(e).__name__}: {e}")
        return False

    if not images:
        print(f"  [fail] {slug}: no images returned")
        return False

    img = images[0]
    data = base64.b64decode(img["data"])
    out_path.write_bytes(data)
    print(f"  [ok]   {slug}.png ({len(data)} bytes, {img.get('mime_type')})")
    return True


async def main() -> int:
    api_key = os.getenv("EMERGENT_LLM_KEY")
    if not api_key:
        print("ERROR: EMERGENT_LLM_KEY not set in environment.", file=sys.stderr)
        return 1

    print(f"Generating {len(PROMPTS)} images into {OUT_DIR}")
    results = []
    for slug, prompt in PROMPTS:
        ok = await generate_one(api_key, slug, prompt)
        results.append((slug, ok))

    print("\n=== Summary ===")
    for slug, ok in results:
        print(f"  {'✓' if ok else '✗'} {slug}")
    failed = [s for s, ok in results if not ok]
    return 0 if not failed else 2


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
