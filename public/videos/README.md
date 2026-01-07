# Video Optimization Guide

## Current Optimized Videos

- `portfolio-demo-optimized.mp4` - 1.75 MB (optimized from 171 MB original)

## Why Optimize Videos?

Large video files significantly impact:
- **Page load time** - Users wait longer for content
- **Bandwidth costs** - Higher server/CDN costs
- **Mobile experience** - Drains data plans
- **SEO rankings** - Google penalizes slow sites
- **Bounce rate** - Users leave before content loads

## Optimization Strategy

### Target Sizes
- **Thumbnail/Preview videos**: < 2 MB
- **Feature videos**: < 5 MB  
- **Full demos**: < 10 MB

### FFmpeg Compression Commands

#### Standard Web Optimization (720p, CRF 28)
```bash
ffmpeg -i input.mp4 \
  -vf "scale=-2:720" \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -movflags +faststart \
  -an \
  output-optimized.mp4
```

**Explanation:**
- `scale=-2:720` - Resize to 720p (HD), maintaining aspect ratio
- `-c:v libx264` - Use H.264 codec (best browser compatibility)
- `-crf 28` - Quality level (18=high, 28=good, 32=lower)
- `-preset slow` - Better compression (slower encoding)
- `-movflags +faststart` - Enable streaming (metadata at start)
- `-an` - Remove audio (if not needed)

#### Higher Quality (720p, CRF 23)
```bash
ffmpeg -i input.mp4 \
  -vf "scale=-2:720" \
  -c:v libx264 \
  -crf 23 \
  -preset slow \
  -movflags +faststart \
  -an \
  output-optimized.mp4
```

#### Keep Audio
```bash
ffmpeg -i input.mp4 \
  -vf "scale=-2:720" \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  output-optimized.mp4
```

#### Reduce Frame Rate (for screen recordings)
```bash
ffmpeg -i input.mp4 \
  -vf "scale=-2:720,fps=24" \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -movflags +faststart \
  -an \
  output-optimized.mp4
```

#### Very Small File (480p, CRF 32)
```bash
ffmpeg -i input.mp4 \
  -vf "scale=-2:480" \
  -c:v libx264 \
  -crf 32 \
  -preset slow \
  -movflags +faststart \
  -an \
  output-optimized.mp4
```

### Resolution Guidelines

| Resolution | Use Case | Typical Size (30s) |
|------------|----------|-------------------|
| 480p | Mobile preview | 0.5-1 MB |
| 720p | Standard web | 1-3 MB |
| 1080p | High quality | 3-8 MB |
| 4K | Avoid for web | 20-100+ MB |

### CRF (Quality) Guidelines

| CRF | Quality | Size | Use Case |
|-----|---------|------|----------|
| 18-23 | Very High | Larger | Portfolio hero videos |
| 23-28 | Good | Balanced | General web videos |
| 28-32 | Acceptable | Smallest | Background loops |

## Implementation in Code

Videos in this folder are automatically served by Vite/React. Reference them as:

```jsx
const videoSrc = '/videos/portfolio-demo-optimized.mp4';

<video
  src={videoSrc}
  autoPlay
  loop
  muted
  playsInline
  preload="none"  // Don't load until needed
  loading="lazy"   // Lazy load
/>
```

## Best Practices

1. **Use public folder** - Don't import large videos in JS bundles
2. **Lazy load** - Set `preload="none"` and `loading="lazy"`
3. **Mute by default** - Autoplay requires `muted` attribute
4. **Add poster image** - Show thumbnail while loading
5. **Optimize before adding** - Never commit huge source files
6. **Test on mobile** - Verify performance on slow connections
7. **Consider WebM** - Create both MP4 and WebM for better compression

## File Naming Convention

- `{project-name}-optimized.mp4` - Standard optimized version
- `{project-name}-poster.jpg` - Thumbnail/poster image
- `{project-name}-webm.webm` - WebM alternative (optional)

## Checking File Sizes

```bash
# PowerShell
Get-ChildItem *.mp4 | Select-Object Name, @{Name='SizeMB';Expression={[math]::Round($_.Length / 1MB, 2)}}

# Bash/Linux
ls -lh *.mp4
```

## Further Optimizations

- Create multiple versions for responsive video
- Use poster images for initial display
- Implement lazy loading with Intersection Observer
- Consider converting to WebM for even smaller files
- Use adaptive bitrate streaming (HLS/DASH) for longer videos
