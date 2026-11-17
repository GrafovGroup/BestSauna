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



## Distinct page imagery — 2026-11-16

Added 30 new images using the built-in image-generation tool, with separate prompts for each placement. The seven existing editorial images now belong to seven distinct primary pages. In total, the 20 page topics use 37 distinct images including their supporting cards; only the English/French versions of the same page share artwork. Brand marks and responsive size variants are intentionally shared.

Each new output was visually inspected, including a contact-sheet review. All are conceptual editorial illustrations, not approved model photography or completed-project evidence. Technical WebP exports preserve the complete 1672 × 941 source composition; 800-pixel variants are 800 × 450. Sharp was used only for encoding/resampling, with quality 79 for full images and 76 for smaller copies. Descriptive bilingual alt text accompanies each placement. The content verifier checks distinct source paths and file hashes.

| Asset | Generated source | Full bytes | Mobile bytes |
| --- | --- | ---: | ---: |
| `/images/editorial-installation.webp` | `exec-60fdd75a-5648-4877-9fba-2bf8c99c8d64.png` | 205420 | 69016 |
| `/images/editorial-saunas.webp` | `exec-07067a59-5a3d-4a7d-9691-6c5fa2c5dc9e.png` | 148618 | 42884 |
| `/images/editorial-compare.webp` | `exec-3817404e-be77-41ba-914e-bce3f5b9e223.png` | 135694 | 43292 |
| `/images/editorial-guides.webp` | `exec-dda7328e-739e-4983-b76a-d3b5094e321f.png` | 136456 | 38634 |
| `/images/editorial-coverage.webp` | `exec-967b5d5b-5ef1-4bf5-8009-c839091b06d8.png` | 327848 | 85994 |
| `/images/editorial-support.webp` | `exec-5d7ad65d-348c-4d67-ab93-104836e53d19.png` | 99650 | 26970 |
| `/images/editorial-quote.webp` | `exec-659cbe04-7b46-487d-88d5-cf4106f4e735.png` | 121930 | 39574 |
| `/images/editorial-about.webp` | `exec-5ed5f55b-e6f7-4d78-86aa-79f8ec064de1.png` | 66516 | 19772 |
| `/images/editorial-privacy.webp` | `exec-1ece3383-42d2-4d76-9f25-7871a36facb0.png` | 199156 | 32040 |
| `/images/editorial-terms.webp` | `exec-1b5966a4-bb51-4846-85bd-1238db5d5003.png` | 92394 | 25016 |
| `/images/editorial-guide-budget.webp` | `exec-13b9b841-e217-4730-8b99-355a0c89d6e5.png` | 153858 | 35356 |
| `/images/editorial-guide-delivery.webp` | `exec-d086697c-11bb-4f9a-8642-c4761cb58ce8.png` | 243874 | 66296 |
| `/images/editorial-guide-commercial.webp` | `exec-45e917df-03f4-4d25-b4e4-42df3d0b8db8.png` | 110416 | 32306 |
| `/images/editorial-home-outdoor.webp` | `exec-afcefe73-65ae-4f19-a4d4-115ad93b114a.png` | 232444 | 65642 |
| `/images/editorial-home-indoor.webp` | `exec-336cfcfb-fb36-4bc6-964d-9b0c16e45f39.png` | 73458 | 20844 |
| `/images/editorial-home-infrared.webp` | `exec-1826c2ad-8431-4a88-896e-53c90fe0972b.png` | 134136 | 35096 |
| `/images/editorial-home-cottage.webp` | `exec-0ee909d2-d437-4c25-9546-3e7740fa26e5.png` | 202360 | 60284 |
| `/images/editorial-home-commercial.webp` | `exec-7a2b98d2-4a3c-4ade-96c9-a0742bf324b9.png` | 125888 | 36438 |
| `/images/editorial-browse-outdoor.webp` | `exec-93d1e971-6bef-420f-ab79-30570b4cba68.png` | 308006 | 87818 |
| `/images/editorial-browse-indoor.webp` | `exec-aef7ff37-8694-4abb-871f-d5f37785c084.png` | 132742 | 36392 |
| `/images/editorial-browse-infrared.webp` | `exec-43f4a35f-1d70-4646-af2b-eeb7a7e86892.png` | 99518 | 28146 |
| `/images/editorial-browse-cottage.webp` | `exec-8717fae7-eee6-4bff-b72f-c89afde7a7a3.png` | 235466 | 74028 |
| `/images/editorial-browse-commercial.webp` | `exec-a21c8107-9edc-45b4-9b7d-04717535bdcc.png` | 74254 | 20508 |
| `/images/editorial-browse-heaters.webp` | `exec-c9330040-b375-4fa2-9acc-9268313c4041.png` | 94202 | 23508 |
| `/images/editorial-home-guide-budget.webp` | `exec-b53acb99-b490-461f-a1b9-61983bcc0d72.png` | 129758 | 37960 |
| `/images/editorial-home-guide-delivery.webp` | `exec-49a9cc22-c259-4b9b-97d2-3e2dc38edb1f.png` | 163008 | 51168 |
| `/images/editorial-home-guide-commercial.webp` | `exec-73e9803c-185b-4c9e-ac7a-6756a3eb0915.png` | 96416 | 29278 |
| `/images/editorial-index-guide-budget.webp` | `exec-3b8bf968-0ed7-4bad-9e03-2bee2c5d532d.png` | 141502 | 41792 |
| `/images/editorial-index-guide-delivery.webp` | `exec-8101e3ec-ef0d-4e7b-93c0-1a764f36131b.png` | 297066 | 83706 |
| `/images/editorial-index-guide-commercial.webp` | `exec-788c21cd-c9af-4689-bac9-e38bd8b1930a.png` | 131750 | 33694 |

### Final prompts for the new images

#### installation

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A sauna project being prepared: neatly stacked smooth cedar wall and bench components on a clean workbench beside a level empty gravel foundation in a landscaped garden; a simple unmarked tape measure and carpenter square in the foreground, birch trees beyond. No completed cabin, no power tools in use. Soft morning sidelight. Emphasize thoughtful preparation and clear work stages, not a specific kit.

#### saunas

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A bright architectural sauna showroom-inspired room with three tactile samples of cedar, aspen and dark exterior timber on a stone ledge in foreground; beyond, a single open doorway reveals a softly lit timber sauna bench. Wide thoughtful material selection editorial, no catalogue labels.

#### compare

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. An architectural studio table with two small unbranded sauna concept scale models, one compact rectangular outdoor cabin with dark exterior and one pale timber glass-front indoor cabin. Three-quarter tabletop perspective, folded neutral fabric and wood swatches, sunlight through a window. No technical labels, no diagrams or readable writing.

#### guides

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A quiet reading corner beside a sauna: open blank cream notebook, pencil and a single small cedar sample on a round charcoal side table, comfortable linen chair, softly blurred timber sauna doorway behind. Natural side light, editorial planning atmosphere.

#### coverage

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A low rectangular timber sauna cabin on the edge of a Canadian boreal forest clearing, spacious distant mountain foothills and mixed evergreen trees, calm late-summer morning; broad gravel approach clearly visible in foreground. No identifiable actual property or map. Distinct expansive wide environmental composition.

#### support

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Close editorial still life of an organized sauna care shelf: soft natural brush, folded clean linen, small wooden bucket, ladle and a closed unmarked plain maintenance notebook on pale cedar shelving, warm daylight. No chemical bottles, people or operating heater.

#### quote

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. An inviting small project consultation table beside a window with a garden sauna softly visible outside. Blank open notebook, two cedar sample blocks, measuring tape and plain ceramic cup on a warm ivory surface. Off-centre tabletop still life with depth, no readable text or plans.

#### about

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Macro architectural photograph of finely finished cedar bench joinery, curved smooth corner and precisely spaced timber slats, subtle amber light along the rear wall, very shallow depth of field, emphasis on craftsmanship and honest natural grain. No accessories or heater.

#### privacy

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Minimal architectural detail of a textured frosted glass door panel bordered by warm cedar, soft diffuse light and abstract garden silhouettes beyond, no visible person. Privacy conveyed through translucent texture, quiet neutral composition, no padlock icons or text.

#### terms

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Refined still-life photograph of a closed plain charcoal document folder with several blank cream paper edges visible, a natural wood pencil laid alongside a small cedar swatch on an ivory desk. A soft window shadow creates structure, no signature, seal, logo or readable writing.

#### guide-budget

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Overhead editorial still life of three different finished timber sample blocks, a plain black calculator with an unlit blank display, pencil and blank cream planning sheets on a pale stone work surface. Precise orderly spacing, natural sidelight, no currency, numbers or readable writing.

#### guide-delivery

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A practical wide stone path leading through an open cedar garden gate toward a small dark-sided sauna cabin, viewed from outside the gate. Gate opening and path turns are clear, lush grasses and low shrubs, soft overcast daylight, no people, trucks or machinery. Photograph emphasizes the route rather than cabin architecture.

#### guide-commercial

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A quiet boutique hotel wellness reception corner with a cedar sauna entrance beyond, simple unbranded wooden towel shelving, clean benches and a wide uncluttered walkway; balanced professional interior photograph. No staff, guests, signage or certification marks.

#### home-outdoor

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A compact cedar garden sauna viewed at blue hour with soft warm interior light, rain-darkened flagstones and subtle ornamental grasses in foreground. Asymmetrical roofline and corner window, no chimneys or branding. Medium-distance three-quarter front view.

#### home-indoor

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A traditional pale aspen home sauna viewed through a wide open glass door from a limestone-floored bathroom. Single empty upper bench and gentle concealed lighting, no heater visible. Calm framed doorway composition with soft daylight.

#### home-infrared

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Close architectural view through an unbranded compact infrared cabin's glass front, single timber bench and clearly recessed matte dark heating panels in its back wall, calm contemporary home room around it, no glowing red lights or displays.

#### home-cottage

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A lakeside cottage sauna ritual still life: two unoccupied timber chairs on a small deck beside a simple sauna wall, folded linen on one chair, granite shore and a calm lake with distant pines. Sauna cabin only partially visible at edge, soft golden early morning, landscape composition centred on deck and water.

#### home-commercial

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Spacious boutique spa relaxation room with empty low linen loungers, warm cedar wall and a wide glass sauna entrance in the far background. A dark stone feature wall, soft indirect lighting and garden window, elegant horizontal photograph with darker left half for white overlay copy.

#### browse-outdoor

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A dark timber outdoor sauna with a simple pitched roof among golden autumn birch trees, dry fallen leaves and low granite garden wall in foreground. Distant three-quarter side view, morning mist, entirely separate scene from previous garden sauna.

#### browse-indoor

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A serene traditional sauna interior corner with L-shaped pale timber benches, small high horizontal window and terracotta-toned stone entry floor, no heater in view. Close architectural perspective focused on bench proportions and wall texture.

#### browse-infrared

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A compact unbranded two-person infrared cabin made from light wood, viewed from its side through a clear door in a minimal home exercise room. Visible flat black recessed panels behind the single bench, one neutral yoga mat rolled outside, no logos or controls with text.

#### browse-cottage

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A small timber sauna with a modest covered porch beside a rustic cottage in a snowy Canadian landscape, clear shoveled footpath and pine boughs, sunny winter afternoon, no smoke or people. Wide environmental photograph, sauna fully on stable land.

#### browse-commercial

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A clean modern hotel sauna interior with broad pale timber benches facing a large frosted window, a generous empty aisle, warm indirect lighting, monochrome charcoal tile entry, no heater visible and no people.

#### browse-heaters

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Close-up of clean natural rounded sauna stones in the open top of a plain unbranded dark metal heater, softly blurred pale wood background. Heater not operating, no steam, water, cords, controls or text; careful tactile still life.

#### home-guide-budget

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Close editorial angle of a hand-held wooden sample fan resting open on a blank ivory notebook with a simple pencil, warm concrete tabletop and soft window light, no calculator, labels or writing, no hands visible.

#### home-guide-delivery

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Unloaded plain wooden shipping crate with a neatly folded protective blanket on top beside a clean covered porch, a clear paved residential approach visible beyond, no logos, shipping labels or people. Warm afternoon light, calm delivery preparation concept.

#### home-guide-commercial

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A boutique wellness interior with neatly rolled ivory towels in cubby storage, dark tile and a softly lit timber corridor toward a sauna, intimate horizontal editorial detail, no people or signage.

#### index-guide-budget

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Side-lit arrangement of pale timber, charcoal siding and natural stone material samples in shallow trays on an architectural worktable, a closed blank notebook at the side. Distinct low diagonal camera angle, no text, numbers or calculator.

#### index-guide-delivery

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. A wide garden entrance with two open dark wooden gates, level gravel access and a gentle clear route through leafy landscaping, no cabin in foreground, no vehicles or people. Eye-level photograph, soft morning light, focus on practical access.

#### index-guide-commercial

Use case: photorealistic-natural. Asset type: distinct editorial image for the BestSauna.ca bilingual Canadian sauna planning website. Create one believable high-end editorial photograph in landscape 16:9 format, warm pale cedar, charcoal and soft ivory palette, restrained natural light, tactile materials, real photographic depth. This is a conceptual illustration, never an actual supplier product or completed BestSauna installation. No people, logos, brands, legible text, watermarks, labels or collage. Avoid obvious unsafe equipment layouts. Compose the subject centrally enough to work in a responsive landscape crop. Empty architectural consultation room for a wellness project: oval timber table with blank rolled plans and small timber swatches, four plain linen chairs, timber wall and soft daylight, no people or readable text. Medium-wide calm professional photograph.
