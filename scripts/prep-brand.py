"""Turn the black-background logo PNG into transparent brand assets.

Outputs (src/assets/brand/):
  mark.png / mark-dark.png            shield only (light-on-dark / dark-on-light variants)
  wordmark.png / wordmark-dark.png    FLO UNION LLC text
  lockup.png / lockup-dark.png        mark above wordmark
"""
import os
import numpy as np
from PIL import Image

SRC = r"C:\Users\Ed\Downloads\IMG_20260913_222039.png"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "assets", "brand")
os.makedirs(OUT, exist_ok=True)

img = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)
r, g, b = img[..., 0], img[..., 1], img[..., 2]
mx = img.max(axis=2)
mn = img.min(axis=2)
sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)

orange = (sat > 0.35) & (r > g) & (g > b) & (mx > 40)
ink = (mx > 8) & ~orange

# reference brightness per class = 95th percentile of solid pixels
L_or = np.percentile(mx[orange & (mx > 120)], 95) if (orange & (mx > 120)).any() else 232.0
L_gr = np.percentile(mx[ink & (mx > 60)], 95) if (ink & (mx > 60)).any() else 150.0
print(f"orange ref {L_or:.0f}, gray ref {L_gr:.0f}")

ref = np.where(orange, L_or, L_gr)
alpha = np.clip(mx / ref, 0, 1)
alpha = np.where(mx <= 8, 0, alpha)
scale = np.where(mx > 0, ref / np.maximum(mx, 1), 0)
rgb = np.clip(img * scale[..., None], 0, 255)

rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
full = Image.fromarray(rgba, "RGBA")

# split mark (top) and wordmark (bottom) by scanning rows with content
rows = np.where(alpha.max(axis=1) > 0.15)[0]
gaps = np.where(np.diff(rows) > 25)[0]
split = rows[gaps[0]] + 1 if len(gaps) else int(len(alpha) * 0.6)
print(f"content rows {rows[0]}..{rows[-1]}, split at {split}")

def crop_bbox(a, y0, y1):
    sub = a[y0:y1]
    ys = np.where(sub.max(axis=1) > 0.15)[0]
    xs = np.where(sub.max(axis=0) > 0.15)[0]
    pad = 8
    return (max(xs[0] - pad, 0), max(y0 + ys[0] - pad, 0), min(xs[-1] + pad, a.shape[1]), min(y0 + ys[-1] + pad, a.shape[0]))

mark_box = crop_bbox(alpha, 0, split)
word_box = crop_bbox(alpha, split, alpha.shape[0])
mark = full.crop(mark_box)
word = full.crop(word_box)

def dark_variant(im):
    a = np.asarray(im).astype(np.float32)
    rr, gg, bb, aa = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    m = a[..., :3].max(axis=2); n = a[..., :3].min(axis=2)
    s = np.where(m > 0, (m - n) / np.maximum(m, 1), 0)
    gray = (s < 0.25) & (aa > 0)
    out = a.copy()
    out[gray, 0] = 0x2A; out[gray, 1] = 0x2A; out[gray, 2] = 0x2D
    return Image.fromarray(out.astype(np.uint8), "RGBA")

def lockup(m, w, gap=28):
    W = max(m.width, w.width)
    H = m.height + gap + w.height
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.paste(m, ((W - m.width) // 2, 0), m)
    canvas.paste(w, ((W - w.width) // 2, m.height + gap), w)
    return canvas

mark.save(os.path.join(OUT, "mark.png"))
word.save(os.path.join(OUT, "wordmark.png"))
lockup(mark, word).save(os.path.join(OUT, "lockup.png"))
dark_variant(mark).save(os.path.join(OUT, "mark-dark.png"))
dark_variant(word).save(os.path.join(OUT, "wordmark-dark.png"))
lockup(dark_variant(mark), dark_variant(word)).save(os.path.join(OUT, "lockup-dark.png"))

for f in sorted(os.listdir(OUT)):
    im = Image.open(os.path.join(OUT, f))
    print(f"{f:20s} {im.width}x{im.height}")
