"""Capture desktop (1440x900 @2x) and mobile (390x844 @2x) screenshots of client sites.
Run: python3 scripts/mockups/capture.py  -> writes PNGs to scripts/mockups/raw/"""
import asyncio, sys
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).parent / "raw"
SITES = {
  "western-cars-brighton": "https://westerncarsbrighton.co.uk/",
  "barkers-executive": "https://barkersexecutive.vercel.app/",
  "gm-taxis-lewes": "https://gmtaxislewes.co.uk/",
  "humandata-labs": "https://humandatalabs.tech/",
  "bloom-studio": "https://bloom.incodet.com",
  "a1-airport-cars": "https://a1airportcarsworthing.vercel.app/",
  "western-cars-littlehampton": "https://www.westerncarslittlehampton.co.uk/",
  "brhex-studio": "https://virtual-tour-poc.vercel.app/tour/50ad98c9",
  "western-cars-haywards-heath": "https://www.westerncars-haywardsheath.co.uk/",
  "western-cars-pulborough": "https://www.westerncarspulborough.co.uk/",
  "western-cars-content-hub": "https://content.westerncars.com/",
  "brighton-taxi": "https://brightontaxi.westerncarsbrighton.co.uk/",
  "western-cars-crawley": "https://www.westerncars.co.uk/",
  "western-cars-east-grinstead": "https://www.westerncars-eastgrinstead.co.uk/",
  "western-cars-horley": "https://westerncars-horley.co.uk/",
  "western-cars-horsham": "https://www.westerncars-horsham.co.uk/",
  "western-cars-redesign-concept": "https://western-cars-website-prototype.vercel.app/",
  # Internal tool: captured for the case study image only. Its URL is never used on the site.
  "western-cars-staff-registration": "https://employeeinfogenerator.vercel.app/",
}
NO_MOBILE = {"brhex-studio", "western-cars-staff-registration"}
HIDE = r"""
(() => {
  const css = `[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],
  [id*="onetrust" i],[class*="cc-window"],[id*="CybotCookiebot"],
  [id*="intercom" i],[class*="intercom" i],[id*="crisp" i],[class*="crisp" i],[id*="tawk" i],
  [id*="hubspot-messages" i],[class*="chat-widget" i],[id*="chat-widget" i],[class*="drift" i],
  iframe[src*="chat" i],iframe[title*="chat" i],
  a[href*="wa.me"],a[href*="whatsapp" i],[class*="whatsapp" i],[id*="whatsapp" i]
  {display:none!important;visibility:hidden!important}`;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  // Fixed/sticky overlays: consent dialogs (by text) and floating chat bubbles (small, bottom corner).
  const vw = innerWidth, vh = innerHeight;
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') return;
    const r = el.getBoundingClientRect();
    const t = (el.textContent||'');
    const consent = /cookie|consent|privacy matters|before you continue|accept all|reject|necessary only/i.test(t) && r.top > 40;
    const chat = /chat with us|need help\?/i.test(t) && r.top > vh * 0.5;
    const bubble = r.width < 160 && r.height < 160 && r.top > vh * 0.6 && (r.left > vw * 0.6 || r.right < vw * 0.4);
    if (consent || bubble || chat) el.style.setProperty('display','none','important');
  });
  document.querySelectorAll('[role="dialog"],[aria-modal="true"]').forEach(el => {
    if (/cookie|consent|privacy|accept/i.test(el.textContent||'')) el.style.setProperty('display','none','important');
  });
  document.documentElement.style.overflow=''; document.body.style.overflow='';
})()
"""

async def shot(browser, slug, url, w, h, suffix):
    ctx = await browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=2,
        is_mobile=suffix == "mobile", has_touch=suffix == "mobile",
        user_agent=None if suffix == "desktop" else "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
    page = await ctx.new_page()
    try:
        await page.goto(url, wait_until="load", timeout=45000)
        await page.wait_for_timeout(6000 if slug == "brhex-studio" else 4000)
        await page.evaluate(HIDE)
        await page.wait_for_timeout(300)
        await page.screenshot(path=str(OUT / f"{slug}-{suffix}.png"))
        print("OK", slug, suffix)
    except Exception as e:
        print("FAIL", slug, suffix, str(e)[:120])
    await ctx.close()

async def main():
    OUT.mkdir(exist_ok=True)
    only = sys.argv[1:]
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        jobs = []
        for slug, url in SITES.items():
            if only and slug not in only: continue
            jobs.append(shot(b, slug, url, 1440, 900, "desktop"))
            if slug not in NO_MOBILE:
                jobs.append(shot(b, slug, url, 390, 844, "mobile"))
        await asyncio.gather(*jobs)
        await b.close()
asyncio.run(main())
