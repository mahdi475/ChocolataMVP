"""
Generate a wide hero background image for the Sustainability page.
"""

import asyncio
import base64
import os
import sys
from pathlib import Path

from emergentintegrations.llm.chat import LlmChat, UserMessage

OUT_PATH = (
    Path(__file__).resolve().parent.parent
    / "src"
    / "assets"
    / "sustainability"
    / "hero-cacao.png"
)

PROMPT = (
    "Cinematic ultra-wide photorealistic photograph of a lush sustainable cacao "
    "plantation at golden hour. Sunlight streaming through tropical leaves, "
    "rows of cacao trees with ripe orange pods, distant misty mountains in the "
    "background, deep rich greens and warm chocolate-brown earth tones, "
    "documentary editorial style, dramatic but soft lighting, very wide horizontal "
    "16:9 composition, no text, no logos, no people in the foreground."
)


async def main() -> int:
    api_key = os.getenv("EMERGENT_LLM_KEY")
    if not api_key:
        print("ERROR: EMERGENT_LLM_KEY not set.", file=sys.stderr)
        return 1
    if OUT_PATH.exists() and OUT_PATH.stat().st_size > 10_000:
        print(f"[skip] {OUT_PATH.name} already exists")
        return 0

    chat = LlmChat(
        api_key=api_key,
        session_id="sustain-hero",
        system_message="You generate cinematic editorial photographs.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(
        modalities=["image", "text"]
    )

    print("Generating hero image ...", flush=True)
    _text, images = await chat.send_message_multimodal_response(UserMessage(text=PROMPT))
    if not images:
        print("No image returned")
        return 2
    data = base64.b64decode(images[0]["data"])
    OUT_PATH.write_bytes(data)
    print(f"[ok] {OUT_PATH.name} ({len(data)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
