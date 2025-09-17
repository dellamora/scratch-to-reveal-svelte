# Scratch to Reveal Svelte

<img src="/gif.gif">

## Installation

```bash
npm i scratch-to-reveal-svelte
```

## Minimal Example

```svelte
<ScratchToReveal 
  width={250}
  height={250}
  minScratchPercentage={70}
  gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
  onComplete={() => console.log('done!')}
>
  <p style="font-size: 6rem;">Hiii</p>
</ScratchToReveal>
```

## Props

- **`width` / `height`** → Canvas size
- **`minScratchPercentage`** → When to trigger complete event
- **`gradientColors`** → Overlay colors 
- **`imageUrl`** → Optional image to use instead of gradient
- **`onComplete`** → Completion callback
- **`className`** → Custom CSS classes

## Events

- **`on:complete`** → Fired when reveal threshold is hit
- **`on:scratchProgress`** → Live percentage updates

## Methods

- **`.reveal()`** → Reveal all content programmatically
- **`.reset()`** → Reset to initial scratch state


## License

MIT. Build fun stuff.

## Contributing

PRs welcome!
