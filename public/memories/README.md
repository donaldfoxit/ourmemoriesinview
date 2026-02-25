# 📸 How to Add Your Photos

Each folder below corresponds to a memory card on the site.
Drop your photos into the matching folder.

## Folder → Memory Map

| Folder | Location |
|--------|-------------|
| `sino-mart/` | SINOMART SUPERMARKET, ONIRU |
| `sip-and-paint/` | SIP AND PAINT OGUDU |
| `harvester-church/` | HARVESTER CHURCH LEKKI |
| `thompson-bubble-tea/` | THOMPSON BOBBLE TEA SHOP |
| `shu-gardens/` | SHU GARDENS ONIRU |
| `random-wednesday/` | That random Wednesday |

## Rules
1. Name your files like `1.jpg`, `2.jpg`, `3.jpg` etc.
2. **The first image (`1.jpg`) is the cover** — it shows on the card by default
3. The rest are gallery photos that cycle on hover (flipbook effect)
4. Supported formats: `.jpg`, `.png`, `.webp`
5. After adding photos, update the `images` array in `src/lib/memories.ts`

## Example
If you drop 3 photos into `sino-mart/`:
```
public/memories/sino-mart/1.jpg  ← cover
public/memories/sino-mart/2.jpg  ← gallery
public/memories/sino-mart/3.jpg  ← gallery
```

Then update `memories.ts`:
```ts
images: [
    '/memories/sino-mart/1.jpg',
    '/memories/sino-mart/2.jpg',
    '/memories/sino-mart/3.jpg',
]
```
