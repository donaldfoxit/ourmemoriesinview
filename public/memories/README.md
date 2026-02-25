# 📸 How to Add Your Photos

Each folder below corresponds to a memory card on the site.
Drop your photos into the matching folder.

## Folder → Memory Map

| Folder | Memory Title |
|--------|-------------|
| `beach-sunset/` | "That sunset we almost missed" |
| `rooftop-night/` | "Rooftop conversations at 2am" |
| `first-trip/` | "Our first trip together" |
| `cozy-sunday/` | "Cozy Sundays are our thing" |
| `birthday-surprise/` | "The surprise that made you cry" |
| `random-wednesday/` | "That random Wednesday" |

## Rules
1. Name your files like `1.jpg`, `2.jpg`, `3.jpg` etc.
2. **The first image (`1.jpg`) is the cover** — it shows on the card by default
3. The rest are gallery photos that cycle on hover (flipbook effect)
4. Supported formats: `.jpg`, `.png`, `.webp`
5. After adding photos, update the `images` array in `src/lib/memories.ts`

## Example
If you drop 3 photos into `beach-sunset/`:
```
public/memories/beach-sunset/1.jpg  ← cover
public/memories/beach-sunset/2.jpg  ← gallery
public/memories/beach-sunset/3.jpg  ← gallery
```

Then update `memories.ts`:
```ts
images: [
    '/memories/beach-sunset/1.jpg',
    '/memories/beach-sunset/2.jpg',
    '/memories/beach-sunset/3.jpg',
]
```
