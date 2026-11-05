# findnearest-kit

Shared FindNearest UI for Svelte 5 apps:

- **Base CSS**: design tokens, light and dark mode, base element styles and the `fn-*`
  utility and component classes. Plain CSS, no CSS framework.
- **`GeocoderSearch`**: the place search box for the FindNearest geocoder, used by FindNearest
  Admin, ANTS, Shifter, Thematrix and the public client sites instead of each keeping its own
  copy.
- **`UpdateBanner`**: the "new version available" prompt every SvelteKit app shows when a new
  build is deployed.
- **`AccountBlock`, `AccountMenu`, `themeState`**: the logged-in user, the dark mode switch and
  sign out, in the same place in every app.

## Install

Installed from GitHub at a tag (not published to npm):

```bash
bun add github:findnearest/findnearest-kit#v0.3.1
```

Requires `svelte` 5.20 or later. Upgrading means bumping the tag.

## Base CSS

Import it once, from the root layout's stylesheet:

```css
@import 'findnearest-kit/fn.css';
```

or, when the app has global rules of its own that must sit at a set point in the cascade:

```css
@import 'findnearest-kit/fn-core.css'; /* tokens, dark mode, base elements, fn-* classes */
@import './app-base.css';              /* the app's own globals */
@import 'findnearest-kit/fn-late.css'; /* toast, flat Option A overrides */
@import 'findnearest-kit/fn-last.css'; /* rules that must win: fn-hidden, fn-sm-* ... */
```

**Dark mode:** set `data-mode="dark"` on `<html>` (before first paint, from `localStorage.theme`
or the system setting). Every token switches; `color-scheme` follows. The switch itself is
`AccountBlock` or `AccountMenu`.

**Colours in app CSS:** use the tokens, never a bare hex, and dark mode comes for free.

| Token | Use |
|---|---|
| `--fn-color-body`, `-body-muted`, `-body-faint` | text |
| `--fn-color-bg-surface` | the page |
| `--fn-color-bg-page`, `-bg-elevated` | cards, panels, inputs |
| `--fn-color-bg-muted`, `-bg-accent` | table heads, hover, subtle fills |
| `--fn-color-bg-inverse` + `--fn-color-on-solid` | dark chip with white text |
| `--fn-color-border`, `-border-strong` (control edges), `-border-hover`, `-border-focus`, `-divide` | lines |
| `--fn-color-placeholder` | input placeholders |
| `--fn-color-link`, `-link-strong` | links |
| `--fn-color-{primary,secondary,tertiary,success,warning,error,surface}-{50…950}` | the scales |
| `--fn-tint-{primary,success,warning,error,tertiary,orange,fuchsia,teal}-bg-soft` | a highlighted row or section |
| `--fn-tint-<hue>-{bg,border,text}` | pastel badges and callouts |

## Use UpdateBanner

```svelte
<!-- root +layout.svelte, once -->
<script lang="ts">
	import { UpdateBanner } from 'findnearest-kit';
</script>

<UpdateBanner appName="Centrelinker" />
```

with SvelteKit polling for new builds in `svelte.config.js`:

```js
kit: { version: { pollInterval: 60_000 } }
```

When the poll sees a newer build, a dark pill appears at the bottom centre: "A new version of
{appName} is available", a Reload button and a dismiss button. It never reloads by itself, so
nobody loses a half-finished edit. In dev the build version never changes, so it never shows.

- Needs SvelteKit 2.12 or later (`$app/state`) and the base CSS: its colours are the kit tokens
  (`bg-inverse`, `on-solid`, `primary-600`, `warning-300`), so it follows dark mode.
- `show` forces it on or off, for demos and tests (`bun run dev`, then `/update-banner`).

## Use AccountBlock and AccountMenu

The user, dark mode and sign out go together, and never as icons taking up header space:

- **An app with a sidebar:** `AccountBlock` at the foot of the sidebar and the drawer.
- **An app with a row of links across the top:** `AccountMenu` at the right of the header, an
  avatar button that opens the same block.

```svelte
<script lang="ts">
	import { AccountMenu } from 'findnearest-kit';
</script>

<AccountMenu name={user.name ?? user.email} email={user.email} onSignOut={signOut} />
```

- `href` makes the name row a link (`active` marks it as the current page; `onnavigate` lets a
  drawer close). `extra` is a snippet for anything app-specific, such as a role badge.
- `AccountBlock` has no divider or outer spacing, so the sidebar sets its own.
- Needs the base CSS, and the first-paint script from *Base CSS* above: `themeState` starts from
  the `data-mode` that script set, and only writes it when someone switches.
- `themeState.toggle()`, `themeState.setMode()` and `themeState.mode` are there if an app needs
  the mode itself. Don't keep a local copy.
- `bun run dev`, then `/account`, shows both in every variant.

## Use GeocoderSearch

```svelte
<script lang="ts">
	import { GeocoderSearch, geocoderSearch, zoomFor } from 'findnearest-kit';

	// Your app's own same-origin proxy adds the geocoder key server side;
	// the browser never holds it.
	const search = geocoderSearch({ endpoint: '/geocoder/search', country: 'AU' });
</script>

<GeocoderSearch
	{search}
	bias={() => {
		const c = map?.getCenter();
		return c ? { lat: c.lat, lon: c.lng } : null;
	}}
	onSelect={(r, { pin }) => {
		map.flyTo({ center: [r.coordinates.lon, r.coordinates.lat], zoom: zoomFor(r) });
		if (pin) dropMarker(r);
	}}
/>
```

### Props

| Prop | Default | |
|---|---|---|
| `search` | required | A `SearchFn`, normally `geocoderSearch({ endpoint })`. Wrap it to add your own lookups (ANTS answers H3 cell ids itself). |
| `onSelect` | required | `(result, { pin, kind })`. `pin` is false for towns (an area: move the map only) and true for addresses, places, points and environment locations. |
| `value` | `''` | Box text. Pass one-way to pre-fill (no search until the box is focused) or `bind:value`. |
| `bias` | none | `() => ({ lat, lon })`, read at search time, usually the map centre. |
| `layout` | `'dropdown'` | `'dropdown'` floats over a map; `'inline'` pushes the form down. |
| `clearOnSelect` | `false` | Empty the box after a pick instead of showing the picked text. |
| `id`, `label`, `placeholder`, `disabled` | | With a visible `<label for={id}>`, leave `label` unset. |
| `limit`, `minLength`, `debounceMs` | 6, 3, 250 | The geocoder rejects queries under 3 characters. |
| `timeoutMs`, `slowAfterMs` | 35 000, 2 000 | The geocoder's cold street path can take 6 to 10 s. |
| `kindLabel` | the kind | Chip text per result (`town`, `address`, `place`, `point`, `location`). |

### Behaviour

- Debounced search, biased to `bias()`; a newer query always wins (older in-flight requests are
  aborted, and a late response is dropped).
- Every state is shown: searching, still searching, nothing found (with a hint for ranges like
  "68-70 Elbow Street", which the geocoder doesn't match yet), and errors (geocoder unavailable,
  key rejected, timed out, unreachable).
- Keyboard: ↑/↓ to move, Enter to pick, Escape to close then clear. Enter never submits a
  surrounding form.
- ARIA combobox/listbox; password managers are told to ignore the input.

### Theming

Set any of these custom properties on an ancestor. The fallbacks are the flat FindNearest
"Option A" light values, so map them to your own tokens for dark mode.

`--fnk-bg`, `--fnk-fg`, `--fnk-muted`, `--fnk-border`, `--fnk-divider`, `--fnk-hover`,
`--fnk-accent`, `--fnk-accent-soft`, `--fnk-chip-bg`, `--fnk-error`, `--fnk-radius`,
`--fnk-height`, `--fnk-font-size`, `--fnk-ring`, `--fnk-shadow`, `--fnk-z`.

## Use ResultsLayout and ResultCard

The results half of a public "find nearest" page: numbered location cards beside a map, so
every client site shows results the same way and a client template only overrides details.

```svelte
<script lang="ts">
	import { ResultsLayout, ResultCard, formatDistance } from 'findnearest-kit';

	let expandedIndex = $state<number | null>(null);
	let hoveredIndex = $state<number | null>(null);
</script>

<ResultsLayout
	layout="grid"
	count={locations.length}
	withMap
	bind:expandedIndex
	onexpand={(i) => logView(locations[i])}
	onhover={(i) => (hoveredIndex = i)}
>
	{#each locations as location, index (location.uid)}
		<ResultCard
			{index}
			uid={location.uid}
			number={firstNumber + index}
			title={location.name}
			distance={formatDistance(location.distance)}
			severity={status.severity}
			badge={status.badge}
			alerts={status.alerts}
			profileHref={profileUrl(location)}
			profileLabel="service centre"
		>
			<p>{location.address}</p>
		</ResultCard>
	{/each}
	{#snippet map()}
		<MyMap highlighted={expandedIndex ?? hoveredIndex} />
	{/snippet}
	{#snippet footer()}
		<MyPagination />
	{/snippet}
</ResultsLayout>
```

- **`layout`**: `grid` (from 1024px: equal rows filling the map's height; an open card's body
  floats over the rows below, and Escape or a click outside closes it) or `wallet` (sticky
  cards that stack as the page scrolls). Below 1024px both are one column, map last.
- **The map is the app's**: pass it as the `map` snippet; it fills the map column. Drive its
  highlight from `expandedIndex` and the `onhover` index, and set `expandedIndex` from a marker
  click.
- **The card knows no rules or URLs**: the app turns its hours data into `severity`, `badge`
  and `alerts`, and passes `profileHref`. The open card's content is the children snippet.
- **Theming**: `--fnk-results-*` custom properties (`-bg`, `-border`, `-hover`, `-muted`,
  `-marker`, `-radius`, `-error`, `-error-text`, … listed at the top of the style in
  `ResultsLayout.svelte`). The fallbacks cover light and dark (`data-mode="dark"`) without the
  base CSS; `fn-last.css` maps the main ones onto the fn tokens.

**On a client site the parent site's CSS wins.** The results must look like the page they sit
in, so the kit styles the minimum: the layouts, the card structure, the marker numbers (they
match the map's) and the closure tints. It sets no font, heading or link style: card titles are
the site's `h3`, and the header button inherits the page's type. To make the profile link look
like the site's own links or buttons, pass the site's class as `profileClass`.

**Two cascade layers.** `fn-kit-look` (borders, radii, shadows, colours, tints) sits under the
parent site's CSS, so the site wins wherever it has a say: a Tailwind `*` reset takes the card
borders away, as it does on the site. `fn-kit-frame` (the layouts, the sticky and floating
positions, the ellipsis, and the box of the kit's own buttons) sits over it, so the same reset or
a site's call-to-action `button {}` rule can't break the cards. Leave the app's own overrides
unlayered and they beat both:

```html
<!-- app.html, before %sveltekit.head% -->
<style>@layer fn-kit-look, captured, fn-kit-frame;</style>
```

Layer order is fixed by the first stylesheet that names a layer, so declare it before anything
loads. An app with no captured layer can leave the order out: unlayered CSS beats both layers.

## Develop

```bash
bun install
cp .env.example .env    # GEOCODER_URL + GEOCODER_INTERNAL_KEY for the demo proxy
bun run dev             # demo page on :7014, with simulated down / slow / empty / out-of-order modes
bun run check
bun test
bun run package         # rebuilds dist/, which is committed
```

`dist/` is committed because apps install straight from GitHub and no build runs on install.
Run `bun run package` before every commit that touches `src/lib`, then tag the release.
