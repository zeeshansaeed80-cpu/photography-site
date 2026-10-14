"""Shrink hero images and any JPG over 800 KB. Dry run by default.
Usage:  python tools/optimize_images.py          (report only, changes nothing)
        python tools/optimize_images.py --apply  (overwrites; git keeps the originals)
Needs: pip install pillow
"""
import sys, glob, os, io
from PIL import Image

APPLY = "--apply" in sys.argv
HERO_W, HERO_Q = 1920, 82      # heroes are full-width backgrounds
BIG_W, BIG_Q = 2000, 80        # other big photos
BIG_LIMIT = 800 * 1024

files = sorted(glob.glob("images/**/*.jpg", recursive=True))
total_before = total_after = 0
for f in files:
    size = os.path.getsize(f)
    hero = "hero" in os.path.basename(f)
    if not hero and size <= BIG_LIMIT:
        continue
    max_w, q = (HERO_W, HERO_Q) if hero else (BIG_W, BIG_Q)
    im = Image.open(f)
    exif, icc = im.info.get("exif"), im.info.get("icc_profile")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    kw = dict(quality=q, optimize=True, progressive=True)
    if exif: kw["exif"] = exif
    if icc: kw["icc_profile"] = icc
    buf = io.BytesIO()
    im.convert("RGB").save(buf, "JPEG", **kw)
    new = buf.tell()
    if new >= size * 0.9:                # skip if saving is under 10%
        print(f"skip  {f} (already small)"); continue
    total_before += size; total_after += new
    print(f"{'DONE' if APPLY else 'would'} {f}: {size//1024} KB -> {new//1024} KB ({im.width}px)")
    if APPLY:
        with open(f, "wb") as out: out.write(buf.getvalue())
print(f"\nTotal {total_before//1024} KB -> {total_after//1024} KB")
