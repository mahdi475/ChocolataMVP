"""
Generate 12 chocolatier portrait images for the Chocolatiers page.
"""

import asyncio
import base64
import os
import sys
from pathlib import Path

from emergentintegrations.llm.chat import LlmChat, UserMessage

OUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "chocolatiers"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPTS = [
    ("maison-deluxe", "Photorealistic editorial portrait of a refined Belgian chocolatier in an elegant Brussels boutique, holding a tray of glossy pralines on a polished marble counter, warm soft lighting, gold detailing in the background, sophisticated European luxury aesthetic, vertical 3:4 portrait composition, no text, no logos."),
    ("alpenschoggi", "Photorealistic editorial portrait of a friendly Swiss chocolatier in a rustic wooden workshop with snowy Swiss Alps visible through the window, copper pots steaming with melted milk chocolate, warm golden lighting, traditional artisan apron, vertical 3:4 portrait composition, no text, no logos."),
    ("edelkakao", "Photorealistic editorial portrait of an elegant Austrian chocolatier in a classic Viennese coffeehouse with rich dark wood paneling and chandeliers, holding dark chocolate single-origin bars, refined cultured atmosphere, vertical 3:4 portrait composition, no text, no logos."),
    ("cioccolato-fiorentino", "Photorealistic editorial portrait of an Italian chocolatier in a sun-drenched rustic Tuscan workshop, fresh oranges and cacao beans on a wooden table, terracotta walls, warm Mediterranean light, passionate craftsman aesthetic, vertical 3:4 portrait composition, no text, no logos."),
    ("atelier-du-cacao", "Photorealistic editorial portrait of a sophisticated French chocolatier in a minimalist modern Lyon atelier, white marble surface with rows of delicate truffles, clean Parisian aesthetic, soft natural light, vertical 3:4 portrait composition, no text, no logos."),
    ("casa-del-cacao", "Photorealistic editorial portrait of a vibrant Spanish chocolatier in a modern Barcelona studio, red chili peppers and raw cacao beans on a wooden surface, warm Mediterranean light, bold confident pose, bean-to-bar craft aesthetic, vertical 3:4 portrait composition, no text, no logos."),
    ("dutchcraft", "Photorealistic editorial portrait of a Dutch chocolatier in a modern industrial Amsterdam loft, golden caramel drizzling from a stainless steel pot onto chocolate, exposed brick wall, contemporary craft aesthetic, vertical 3:4 portrait composition, no text, no logos."),
    ("nordisk-kakao", "Photorealistic editorial portrait of a Swedish chocolatier in a clean minimalist Scandinavian studio in Gothenburg, matte black chocolate packaging on a white surface, soft Nordic daylight, calm minimalist aesthetic, vertical 3:4 portrait composition, no text, no logos."),
    ("fjordcocoa", "Photorealistic editorial portrait of a Norwegian chocolatier in a coastal workshop near Bergen with dramatic fjord scenery in the background, dark chocolate bars topped with sea salt flakes, cool moody natural light, handcrafted nordic aesthetic, vertical 3:4 portrait composition, no text, no logos."),
    ("copenhagen-cacao-lab", "Photorealistic editorial portrait of a Danish chocolatier in an experimental modern lab in Copenhagen, geometric chocolate sculptures on a concrete table, clean Scandinavian design aesthetic, soft cool lighting, vertical 3:4 portrait composition, no text, no logos."),
    ("arctic-bean", "Photorealistic editorial portrait of a Finnish chocolatier in a cool-toned minimal studio in Helsinki, clean white space with pristine dark chocolate squares on a slate plate, calm pure Nordic aesthetic, soft daylight, vertical 3:4 portrait composition, no text, no logos."),
    ("london-cocoa-house", "Photorealistic editorial portrait of a stylish British chocolatier in a sophisticated London shop with vintage industrial details, glossy dark chocolate truffles on a black slate board, refined modern-classic aesthetic, warm focused lighting, vertical 3:4 portrait composition, no text, no logos."),
]


async def generate_one(api_key, slug, prompt):
    out_path = OUT_DIR / f"{slug}.png"
    if out_path.exists() and out_path.stat().st_size > 10_000:
        print(f"  [skip] {slug}.png exists ({out_path.stat().st_size} bytes)")
        return True

    print(f"  [gen]  {slug} ...", flush=True)
    chat = LlmChat(
        api_key=api_key,
        session_id=f"choco-{slug}",
        system_message="You generate photorealistic editorial portraits.",
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


async def main():
    api_key = os.getenv("EMERGENT_LLM_KEY")
    if not api_key:
        print("ERROR: EMERGENT_LLM_KEY not set.", file=sys.stderr)
        return 1
    print(f"Generating {len(PROMPTS)} portraits into {OUT_DIR}")
    results = [(slug, await generate_one(api_key, slug, prompt)) for slug, prompt in PROMPTS]
    print("\n=== Summary ===")
    for slug, ok in results:
        print(f"  {'OK' if ok else 'FAIL'} {slug}")
    return 0 if all(ok for _, ok in results) else 2


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
