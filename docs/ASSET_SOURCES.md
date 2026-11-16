# BestSauna asset sources

## Scope and permitted presentation

These six editorial images were created using the built-in image generation tool on 2026-11-16 for the BestSauna.ca website. They are unbranded conceptual illustrations of sauna settings. They are not supplier photographs, verified product configurations, actual BestSauna installations, or evidence of a product's safety, compliance, capacity, dimensions, availability, or warranty. Use them as category and lifestyle imagery. Do not attach them to a real model listing or completed-project testimonial.

The original generated files remain in the working session's generated_images directory. Project WebP copies are committed under public/images. WebP conversion retained full dimensions without cropping or content edits. Image generation was the built-in mode; no external photo provider or CLI fallback was used. No third-party attribution requirement was supplied with these generated outputs.

| Web asset | Dimensions | Bytes | Generated source filename |
| --- | --- | ---: | --- |
| `/images/outdoor.webp` | 1672 × 941 | 291706 | `exec-e5231ce8-9bcd-4f15-9432-bd77bb26634b.png` |
| `/images/indoor.webp` | 1672 × 941 | 155830 | `exec-22e207d2-95b7-4b2d-813c-04052b331de2.png` |
| `/images/infrared.webp` | 1672 × 941 | 211684 | `exec-70776469-f8ba-439c-9f31-838bbb9637da.png` |
| `/images/cottage.webp` | 1672 × 941 | 292436 | `exec-c010110f-e4b9-4aab-bf70-46e1c706acc6.png` |
| `/images/commercial.webp` | 1672 × 941 | 205892 | `exec-392e475f-25e4-4ccd-8efe-62320d78875c.png` |
| `/images/sauna-detail.webp` | 1672 × 941 | 129174 | `exec-d1356018-da38-4b2b-8fe8-ef42d0c139d7.png` |

All six outputs were visually inspected for composition, unwanted labels, visible people and branding. Their visual details must not substitute for manufacturer installation instructions.

## Approved brand artwork

The supplied build-kit originals were copied without changing their pixels. The primary wordmark is the user's approved concept 04. These are raster artwork, not vector masters.

| Package file | Project path | Format / treatment |
| --- | --- | --- |
| `brand/bestsauna-approved-concept-04.png` | `public/brand/bestsauna-approved-concept-04.png` | 1536 × 1024 RGB; reference plate only, includes concept label |
| `brand/bestsauna-wordmark-en-light.png` | `public/brand/bestsauna-wordmark-en-light.png` | 2172 × 724 RGBA; transparent; English/shared SERVICE descriptor |
| `brand/bestsauna-wordmark-en-dark.png` | `public/brand/bestsauna-wordmark-en-dark.png` | 2172 × 724 RGB; opaque charcoal background; reversed artwork |
| `brand/bestsauna-wordmark-fr-light.png` | `public/brand/bestsauna-wordmark-fr-light.png` | 2172 × 724 RGBA; transparent; ENTRETIEN descriptor gated on actual maintenance offer |
| `brand/bestsauna-wordmark-fr-dark.png` | `public/brand/bestsauna-wordmark-fr-dark.png` | 2172 × 724 RGB; opaque charcoal background; same descriptor condition |

The EN light and EN dark source images were visually inspected. Dark artwork has a subtly varying charcoal background; do not assume the background will disappear against flat CSS charcoal. The French ENTRETIEN lockups remain reference assets until an actual maintenance service is approved. Use the shared SERVICE descriptor or an approved descriptor-free derivative for current French pages.

## Homepage hero and responsive exports

The homepage hero was generated and approved in the parent build task using the built-in image tool. Its source is `exec-2d700350-0506-40cf-a726-b5e094c7d2db.png`. It has the same contextual-use limits as the category imagery: it does not identify an available model or completed BestSauna installation.

| Web asset | Dimensions | Bytes |
| --- | --- | ---: |
| `/images/hero-sauna.webp` | 1672 × 941 | 285912 |
| `/images/hero-sauna-800.webp` | 800 × 450 | 81410 |
| `/images/outdoor-800.webp` | 800 × 450 | 101084 |
| `/images/indoor-800.webp` | 800 × 450 | 42122 |
| `/images/infrared-800.webp` | 800 × 450 | 56460 |
| `/images/cottage-800.webp` | 800 × 450 | 99028 |
| `/images/commercial-800.webp` | 800 × 450 | 54682 |
| `/images/sauna-detail-800.webp` | 800 × 450 | 36854 |

Responsive variants were resampled directly from the original generated PNGs without crops or content changes. Their small rounding difference in height preserves the original composition.

## Favicon and application icon exports

The approved S derivative source is `exec-fc38830e-536a-4c2e-897b-3121ba24562e.png` (1254 × 1254 RGB), generated and approved in the parent build task. It retains the charcoal S and amber heat-cap detail on a warm opaque background. The exports preserve its square composition. They are technical raster exports, not a vector redraw.

| File | Size / role |
| --- | --- |
| `public/favicon.ico` | Verified embedded sizes: 16 × 16, 32 × 32, 48 × 48 |
| `public/icons/favicon-16.png` | 16 × 16 browser icon |
| `public/icons/favicon-32.png` | 32 × 32 browser icon |
| `public/icons/apple-touch-icon.png` | 180 × 180 Apple touch icon |
| `public/icons/icon-192.png` | 192 × 192 application icon; purpose `any` |
| `public/icons/icon-512.png` | 512 × 512 application icon; purpose `any` |
| `public/icons/maskable-192.png` | 192 × 192 maskable export |
| `public/icons/maskable-512.png` | 512 × 512 maskable export |

The essential mark's measured furthest radius is approximately 38.27% of the source width, within the central 40% maskable safe radius; no additional content alteration or padding was needed. Maskable and ordinary files are separately named exports of the same already suitable composition. `public/site.webmanifest` declares the appropriate purposes and root-correct paths. The unapproved starter `public/favicon.svg` was removed.

## Generation prompts

### outdoor

Use case: photorealistic-natural. Asset type: wide landscape editorial photograph for a premium Canadian sauna buying website. Create a believable architectural photograph, restrained warm natural colours, charcoal accents, cedar grain with real variation, immaculate but lived-in natural setting, professional lens perspective, beautiful soft daylight and realistic shadows. This is an unbranded conceptual setting, not a named commercial product or completed project. No people, no branding, no lettering, no watermark, no fake signage, no collage. Landscape 16:9 composition with room for responsive cropping. Primary subject: compact contemporary rectangular outdoor sauna cabin in a thoughtfully planted Canadian back garden. Charcoal vertical exterior siding, a warm cedar-lined porch recess, modest glazed door showing softly lit timber benches. Paved approach and gravel border, mature grasses, birch trees. Eye-level three-quarter architectural view in gentle afternoon light, inviting and tangible.

### indoor

Use case: photorealistic-natural. Asset type: wide landscape editorial photograph for a premium Canadian sauna buying website. Create a believable architectural photograph, restrained warm natural colours, charcoal accents, cedar grain with real variation, immaculate but lived-in natural setting, professional lens perspective, beautiful soft daylight and realistic shadows. This is an unbranded conceptual setting, not a named commercial product or completed project. No people, no branding, no lettering, no watermark, no fake signage, no collage. Landscape 16:9 composition with room for responsive cropping. Primary subject: interior of an elegant traditional home sauna, viewed from near the doorway. Two levels of smooth cedar benches around an uncluttered corner, warm timber wall panels, restrained indirect light behind the backrest, narrow window with garden foliage. A compact heater and stones are placed at a believable distance behind a modest wood guard. No towels on heater, no clutter. Natural balanced colour, fine tactile timber grain.

### infrared

Use case: photorealistic-natural. Asset type: wide landscape editorial photograph for a premium Canadian sauna buying website. Create a believable architectural photograph, restrained warm natural colours, charcoal accents, cedar grain with real variation, immaculate but lived-in natural setting, professional lens perspective, beautiful soft daylight and realistic shadows. This is an unbranded conceptual setting, not a named commercial product or completed project. No people, no branding, no lettering, no watermark, no fake signage, no collage. Landscape 16:9 composition with room for responsive cropping. Primary subject: an elegant compact infrared sauna cabin integrated into a warm contemporary home wellness room. Pale wood interior with visible flat dark infrared panels safely recessed into the back and side walls, single-level wood bench, clear glass front door with dark slim edge. Stone floor, small linen towel on a nearby stool, soft indirect daylight. Cabin is unbranded, no electronic text displays. Distinctly contemporary and calm, believable photo.

### cottage

Use case: photorealistic-natural. Asset type: wide landscape editorial photograph for a premium Canadian sauna buying website. Create a believable architectural photograph, restrained warm natural colours, charcoal accents, cedar grain with real variation, immaculate but lived-in natural setting, professional lens perspective, beautiful soft daylight and realistic shadows. This is an unbranded conceptual setting, not a named commercial product or completed project. No people, no branding, no lettering, no watermark, no fake signage, no collage. Landscape 16:9 composition with room for responsive cropping. Primary subject: a beautiful unbranded cedar barrel sauna beside a calm Ontario cottage lake, sitting on a small practical timber deck near granite outcrops and pines. Three-quarter side view shows curved timber staves and a clean glazed end door, quietly glowing interior. Early autumn colours, soft overcast morning, still water beyond. Sauna is entirely on shore, not suspended over water. No cottage building dominating image, no people.

### commercial

Use case: photorealistic-natural. Asset type: wide landscape editorial photograph for a premium Canadian sauna buying website. Create a believable architectural photograph, restrained warm natural colours, charcoal accents, cedar grain with real variation, immaculate but lived-in natural setting, professional lens perspective, beautiful soft daylight and realistic shadows. This is an unbranded conceptual setting, not a named commercial product or completed project. No people, no branding, no lettering, no watermark, no fake signage, no collage. Landscape 16:9 composition with room for responsive cropping. Primary subject: spacious contemporary spa sauna interior with long tiered cedar benches, generous clear aisle, soft warm concealed light, glazed wall with a quiet garden beyond. A substantial dark heater filled with stones behind an appropriate guard sits at the far side. Wide professional architectural composition, clean exact wood joinery, restrained hospitality design, warm neutral palette, no signage or invented certification marks.

### sauna-detail

Use case: photorealistic-natural. Asset type: wide landscape editorial photograph for a premium Canadian sauna buying website. Create a believable architectural photograph, restrained warm natural colours, charcoal accents, cedar grain with real variation, immaculate but lived-in natural setting, professional lens perspective, beautiful soft daylight and realistic shadows. This is an unbranded conceptual setting, not a named commercial product or completed project. No people, no branding, no lettering, no watermark, no fake signage, no collage. Landscape 16:9 composition with room for responsive cropping. Primary subject: an intimate still-life closeup of a cedar sauna bench, traditional wooden sauna bucket and ladle, folded neutral linen towel, with a dark stone-filled heater softly out of focus in the background. Side lighting brings out honest timber grain, rounded smooth joinery and tactile natural materials. Keep the bucket and towel well away from the heater. Rich but subtle warmth, editorial interior detail photograph.


