"""Compose laptop + phone mockups from raw captures.
Run after capture.py: python3 scripts/mockups/compose.py
Writes public/images/mockups/<slug>.webp (1600x1000) and <slug>-sm.webp (800x500)."""
import asyncio, subprocess, sys
from pathlib import Path
from playwright.async_api import async_playwright

HERE = Path(__file__).parent
RAW = HERE / "raw"
OUT = HERE.parent.parent / "public" / "images" / "mockups"
COLORS = {
  "western-cars-brighton": ("#DCE6F7", "#F3F6FB"),
  "barkers-executive": ("#E4DEF5", "#F5F3FB"),
  "gm-taxis-lewes": ("#DDF1E4", "#F4FAF6"),
  "humandata-labs": ("#D8EEEC", "#F2F8F8"),
  "brhex-studio": ("#F2E8DA", "#FAF6F0"),
  "bloom-studio": ("#F6E1E6", "#FCF5F7"),
  "a1-airport-cars": ("#F7EFD2", "#FCF9EE"),
  "western-cars-littlehampton": ("#E0E7F0", "#F6F8FB"),
  "western-cars-haywards-heath": ("#E3E9F8", "#F5F7FC"),
  "western-cars-pulborough": ("#DFF0E8", "#F4FAF7"),
  "western-cars-content-hub": ("#EAE3F6", "#F7F4FB"),
  "brighton-taxi": ("#E2E4EA", "#F5F6F8"),
  "western-cars-crawley": ("#DCEAF4", "#F2F7FB"),
  "western-cars-east-grinstead": ("#F4E6DA", "#FBF6F1"),
  "western-cars-horley": ("#DDEFF2", "#F3F9FA"),
  "western-cars-horsham": ("#EEF0D9", "#F9FAF0"),
  "western-cars-redesign-concept": ("#F0E2EC", "#FAF4F8"),
  "western-cars-staff-registration": ("#E6ECF2", "#F6F8FA"),
}
LAPTOP_ONLY = {"brhex-studio", "western-cars-staff-registration"}

def html(slug, c1, c2):
    desk = (RAW / f"{slug}-desktop.png").resolve().as_uri()
    mob = (RAW / f"{slug}-mobile.png").resolve().as_uri()
    solo = slug in LAPTOP_ONLY
    left = 224 if solo else 120
    phone = "" if solo else f"""
    <div class="phone"><div class="pscreen"><img src="{mob}"><div class="island"></div></div></div>"""
    return f"""<!doctype html><html><head><style>
    *{{box-sizing:border-box;margin:0}}
    body{{width:1600px;height:1000px;overflow:hidden;background:linear-gradient(160deg,{c1} 0%,{c2} 100%);position:relative}}
    .laptop{{position:absolute;left:{left}px;top:120px;width:1152px}}
    .lid{{background:#1d1e21;border-radius:26px 26px 6px 6px;padding:22px 22px 26px;
      box-shadow:0 0 0 2px #3a3b3f inset}}
    .lscreen{{aspect-ratio:16/10;overflow:hidden;border-radius:4px;background:#000}}
    .lscreen img{{width:100%;height:100%;object-fit:cover;object-position:top;display:block}}
    .base{{height:22px;margin:0 -64px;border-radius:2px 2px 18px 18px;
      background:linear-gradient(180deg,#e8eaed 0%,#c9ccd1 55%,#a6aab0 100%);position:relative}}
    .base:before{{content:"";position:absolute;left:50%;top:0;width:170px;height:9px;transform:translateX(-50%);
      background:#b5b9bf;border-radius:0 0 10px 10px}}
    .lshadow{{position:absolute;left:-40px;right:-40px;bottom:-34px;height:40px;border-radius:50%;
      background:radial-gradient(closest-side,rgba(20,25,35,.32),rgba(20,25,35,0));z-index:-1}}
    .laptop{{filter:drop-shadow(0 30px 40px rgba(20,25,35,.18))}}
    .phone{{position:absolute;right:150px;top:330px;width:292px;height:600px;padding:10px;border-radius:52px;
      background:#0d0d0f;box-shadow:0 0 0 2px #2b2c30 inset,0 50px 70px rgba(20,25,35,.30),0 16px 26px rgba(20,25,35,.20)}}
    .pscreen{{position:relative;width:100%;height:100%;border-radius:42px;overflow:hidden;background:#000}}
    .pscreen img{{width:100%;height:100%;object-fit:cover;object-position:top;display:block}}
    .island{{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:88px;height:26px;border-radius:14px;background:#000}}
    </style></head><body>
    <div class="laptop"><div class="lid"><div class="lscreen"><img src="{desk}"></div></div><div class="base"></div><div class="lshadow"></div></div>
    {phone}</body></html>"""

def to_webp(png, out, size, limit_kb):
    for q in (82, 76, 70, 64, 58, 50):
        subprocess.run(["magick", str(png), "-resize", size, "-quality", str(q), "-define", "webp:method=6", str(out)], check=True)
        if out.stat().st_size / 1000 < limit_kb: break
    return q

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    only = sys.argv[1:]
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        page = await b.new_page(viewport={"width": 1600, "height": 1000}, device_scale_factor=1)
        for slug, (c1, c2) in COLORS.items():
            if only and slug not in only: continue
            if not (RAW / f"{slug}-desktop.png").exists():
                print("SKIP (no capture)", slug); continue
            doc = HERE / "raw" / f"_{slug}.html"
            doc.write_text(html(slug, c1, c2))
            await page.goto(doc.resolve().as_uri(), wait_until="load")
            png = Path(f"/tmp/mockup-{slug}.png")
            await page.screenshot(path=str(png))
            q1 = to_webp(png, OUT / f"{slug}.webp", "1600x1000", 180)
            q2 = to_webp(png, OUT / f"{slug}-sm.webp", "800x500", 70)
            print(slug, f"{(OUT/f'{slug}.webp').stat().st_size//1024}KB q{q1}", f"sm {(OUT/f'{slug}-sm.webp').stat().st_size//1024}KB q{q2}")
        await b.close()
asyncio.run(main())
