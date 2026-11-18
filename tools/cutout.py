import sys, os, json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

def cut(path, bg_thresh=232, min_h=90, merge=9, bg_rgb=None, tol=22):
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.int16)
    H, W, _ = im.shape
    if bg_rgb is None:
        near = (im.min(axis=2) >= bg_thresh)
    else:
        near = (np.abs(im - np.array(bg_rgb)).max(axis=2) <= tol)
    lab, n = ndi.label(near)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    fg = ~bg
    fg = ndi.binary_opening(fg, iterations=1)
    # soft edge: pixels of fg touching bg get alpha by darkness
    edge = fg & ndi.binary_dilation(bg, iterations=2)
    alpha = np.where(fg, 255, 0).astype(np.float32)
    ref = 255 if bg_rgb is None else np.array(bg_rgb).min()
    dark = (ref - im.min(axis=2)).clip(0, None) / max(ref - 150, 1)
    alpha[edge] = (dark[edge].clip(0, 1) * 255)
    # components
    grown = ndi.binary_dilation(fg, iterations=merge)
    lab2, n2 = ndi.label(grown)
    boxes = []
    for i, sl in enumerate(ndi.find_objects(lab2), 1):
        h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        if h < min_h: continue
        boxes.append((sl, i))
    rgba = np.dstack([im.clip(0, 255).astype(np.uint8), alpha.astype(np.uint8)])
    out = []
    for sl, i in boxes:
        m = (lab2[sl] == i)
        crop = rgba[sl].copy()
        crop[..., 3] = np.where(m, crop[..., 3], 0)
        ys, xs = np.nonzero(crop[..., 3] > 8)
        crop = crop[ys.min():ys.max()+1, xs.min():xs.max()+1]
        out.append(((sl[0].start, sl[1].start), Image.fromarray(crop, "RGBA")))
    return out, (W, H)

def order(items, row_tol=150):
    items = sorted(items, key=lambda t: t[0][0])
    rows = []
    for it in items:
        if rows and abs(it[0][0] - rows[-1][0][0][0]) < row_tol: rows[-1].append(it)
        else: rows.append([it])
    res = []
    for r in rows: res += sorted(r, key=lambda t: t[0][1])
    return res
