"""Prepare job photos for the site.

Reads originals from Downloads, fixes orientation, STRIPS ALL EXIF (incl. GPS),
resizes to 2000px on the long edge, writes progressive JPEG q85 to src/assets/photos/.
Only these derivatives are committed. Re-run any time; idempotent.
"""
import os, sys
from PIL import Image, ImageOps

SRC = r"C:\Users\Ed\Downloads"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "assets", "photos")
os.makedirs(OUT, exist_ok=True)
MAX = 2000

# source filename -> output stem
MANIFEST = {
    # 01 HOA community (Apr 2024)
    "20240402_113228.jpg": "hoa-01", "20240402_113726.jpg": "hoa-02", "20240402_113730.jpg": "hoa-03",
    "20240402_114245.jpg": "hoa-04", "20240402_114343.jpg": "hoa-05", "20240402_114913.jpg": "hoa-06",
    "20240402_114924.jpg": "hoa-07", "20240402_114958.jpg": "hoa-08", "20240402_115013.jpg": "hoa-09",
    "20240402_115839.jpg": "hoa-10", "20240402_115933.jpg": "hoa-11", "20240402_115942.jpg": "hoa-12",
    "20240402_120023.jpg": "hoa-13",
    # 02 New construction, golden hour (Sep 2025)
    "20250919_182048.jpg": "newbuild-01", "20250919_182058.jpg": "newbuild-02", "20250919_182117.jpg": "newbuild-03",
    "20250919_182152.jpg": "newbuild-04", "20250919_182216.jpg": "newbuild-05", "20250919_182223.jpg": "newbuild-06",
    "20250919_182258.jpg": "newbuild-07", "20250919_182314.jpg": "newbuild-08",
    # 03 Dark bronze on stucco (Oct 2025)
    "IMG-20251002-WA0010.jpg": "bronze-01", "IMG-20251002-WA0012.jpg": "bronze-02", "IMG-20251002-WA0014.jpg": "bronze-03",
    "IMG-20251002-WA0016.jpg": "bronze-04", "IMG-20251002-WA0019.jpg": "bronze-05", "IMG-20251002-WA0024.jpg": "bronze-06",
    "IMG-20251002-WA0026.jpg": "bronze-07", "IMG-20251002-WA0028.jpg": "bronze-08", "IMG-20251002-WA0031.jpg": "bronze-09",
    # 04 Tile-roof Mediterranean (Oct 2025)
    "20251003_163612.jpg": "tile-01", "20251003_163626.jpg": "tile-02", "20251003_163634.jpg": "tile-03", "20251003_163653.jpg": "tile-04",
    # 05 Four-story condo, boom lift (Jun 2023)
    "20230630_142300.jpg": "condo-01", "20230630_142307.jpg": "condo-02",
    # 06 Modern white house, black gutters (Sep 2025)
    "20250908_123054.jpg": "modern-01", "20250908_123145.jpg": "modern-02",
    # 07 Brick ranch (2020-2021)
    "20210204_151957.jpg": "brick-01", "20210204_152015.jpg": "brick-02", "20210204_152026.jpg": "brick-03",
    "20201204_161945.jpg": "brick-04", "20201204_161838.jpg": "brick-05",
    # 08 Two-story farmhouse (Feb 2019)
    "20190221_160134.jpg": "farmhouse-01", "20190221_160150.jpg": "farmhouse-02", "20190221_160152.jpg": "farmhouse-03",
    # 09 Dormered colonial (Facebook set)
    "470499781_561836503475566_1951031510287567032_n.jpg": "colonial-01",
    "470641894_561836726808877_8192290381161294886_n.jpg": "colonial-02",
    "487225104_9388084654644867_975032320796017091_n.jpg": "colonial-03",
    # 10 Siding home (Sep 2025)
    "20250923_105844.jpg": "siding-01", "20250923_105940.jpg": "siding-02",
    # 11 New commercial build (Sep 2025)
    "20250924_133512.jpg": "commercial-01", "20250924_133603.jpg": "commercial-02",
    # details / craft / extras
    "20231019_174716.jpg": "detail-elbow", "20231019_174823.jpg": "detail-miter", "20240204_114403.jpg": "detail-downspout",
    "20240224_102449.jpg": "detail-tile-eave", "20250918_154708.jpg": "detail-ladder", "20251003_135602.jpg": "detail-guard",
    "20251003_135613.jpg": "detail-drip", "IMG-20230606-WA0000.jpeg": "detail-corner", "IMG-20230606-WA0002.jpeg": "detail-run",
    "IMG-20230609-WA0000.jpeg": "detail-box", "IMG-20230609-WA0004.jpeg": "detail-roof-edge", "IMG-20230609-WA0006.jpeg": "detail-entry-ladder",
    "20200904_135149.jpg": "ranch-palm", "20251001_104829.jpg": "ranch-pink",
    # added Sep 14 2026: rest of the HOA set + Facebook album houses + two older WhatsApp shots
    "20240402_104243.jpg": "hoa-14", "20240402_113238.jpg": "hoa-15", "20240402_113327.jpg": "hoa-16", "20240402_113609.jpg": "hoa-17",
    "20240402_113633.jpg": "hoa-18", "20240402_114312.jpg": "hoa-19", "20240402_114854.jpg": "hoa-20", "20240402_114929.jpg": "hoa-21",
    "20240402_115844.jpg": "hoa-22", "20240402_115913.jpg": "hoa-23",
    "IMG-20200317-WA0005.jpg": "cottage-01", "IMG-20201223-WA0002.jpeg": "rear-brick-01",
    "470203918_561836483475568_3159907888502802205_n.jpg": "fb-brick-01", "470214112_561836510142232_8668443679172246467_n.jpg": "fb-brick-02",
    "470540819_561836426808907_8095269790939382574_n.jpg": "fb-brick-03", "470575549_561836496808900_6876553636942898177_n.jpg": "fb-stucco-01",
    "470577528_561836403475576_3164964519404700339_n.jpg": "fb-stucco-02", "470584439_561836733475543_1241294781586678357_n.jpg": "fb-brick-04",
    "470600219_561836420142241_3575141471513547905_n.jpg": "fb-brick-05", "470601323_561836433475573_8248586026285601526_n.jpg": "fb-stucco-03",
    "470604742_561836530142230_3314618990132666180_n.jpg": "fb-stucco-04", "470626855_561836463475570_8120760256430403555_n.jpg": "fb-brick-06",
    "470672868_561836533475563_4258359093765815825_n.jpg": "fb-stucco-05", "470778351_561836616808888_2341551531617437449_n.jpg": "fb-brick-07",
}

rows, total = [], 0
for src, stem in MANIFEST.items():
    p = os.path.join(SRC, src)
    if not os.path.exists(p):
        print(f"MISSING {src}"); sys.exit(1)
    im = Image.open(p)
    im = ImageOps.exif_transpose(im).convert("RGB")
    im.thumbnail((MAX, MAX), Image.LANCZOS)
    out = os.path.join(OUT, stem + ".jpg")
    im.save(out, "JPEG", quality=85, optimize=True, progressive=True, exif=b"")
    # verify: no EXIF survives
    chk = Image.open(out)
    assert len(chk.getexif()) == 0, f"EXIF survived on {stem}"
    kb = os.path.getsize(out) // 1024
    total += kb
    rows.append((stem, chk.width, chk.height, kb))

for stem, w, h, kb in rows:
    print(f"{stem:22s} {w:4d}x{h:<4d} {kb:4d} KB")
print(f"{len(rows)} photos, {total/1024:.1f} MB total, EXIF verified empty on all")
