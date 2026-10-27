# PureRef Web Viewer

A lightweight, standalone viewer for opening PureRef `.pur` boards in your browser. View your reference board across the full page, inspect individual images, and export your work without installing PureRef.

**[Open the viewer](https://gregrioum.github.io/pureref_webvierer/)**

## Features

- Full-page board viewing with drag-to-pan and scroll or pinch-to-zoom.
- Light and dark interface themes. Switching themes never inverts the board, images, or notes.
- Floating **Board controls** in the bottom-left and **Zoom out**, **Zoom in**, and **Fit** in the bottom-right.
- Board and image-gallery views, plus individual image previews.
- PureRef 2.x group backgrounds and supported freehand drawings, including their colors, transparency, and placement.
- Download individual images, all embedded images as a ZIP, or the board as PNG or PDF when its layout is available.
- Local file processing: your `.pur` file is not uploaded to a server.
- A single HTML file with the viewer's JavaScript bundled inside, suitable for offline use.

## Quick start

1. [Open the viewer](https://gregrioum.github.io/pureref_webvierer/) and select **Open a .pur file**, or drag a `.pur` file onto the page.
2. **Drag** the board to move around. **Scroll** with a mouse or **pinch** on a touch screen to zoom. Use **Fit** to bring the whole board back into view.
3. Select an image to open a larger preview. Use **Download image** to save it, then **Close** to return to your board.
4. Open **Board controls** in the bottom-left. The panel expands upward and contains:
   - **Open another file** to switch boards.
   - **Board / Images** to switch views when a board layout is available.
   - **Download all as .zip** to save the embedded images together.
   - **Save PNG / Save PDF** to export the board when its layout is available.
5. Use the theme button at the top-right to switch between light and dark controls. Your choice is remembered when browser storage is available. The adjacent **Fullscreen** button is available in browsers that support it.

Select **Board controls** again to collapse the panel and make more room for your references.

## Offline use

Download [`index.html`](https://github.com/Gregrioum/pureref_webvierer/blob/main/index.html) using GitHub's **Download raw file** option, then open the saved HTML file in your browser. The viewer processes local boards without a server. Download the page itself first; visiting the hosted URL still requires an internet connection.

## Compatibility and limitations

- Supports PureRef 2.x boards. Support for PureRef 1.x is newer and may be less complete.
- This is a viewer and exporter; it does not edit or save changes to `.pur` boards.
- Group backgrounds and standard solid-line drawing records are supported in the viewer and PNG/PDF exports. This support was checked with a PureRef 2.1.3 board. Other stroke formats or styles may still be unsupported; the viewer reports drawings it cannot decode.
- Notes are shown when their board layout can be read; some files may offer an images-only view. Group bounds are reconstructed from their contents, so text wrapping and frame spacing may differ slightly from the desktop app.
- Images that are not embedded in the `.pur` file cannot be displayed or exported.
- Large boards can use substantial memory. Board exports may reduce image resolution to stay within device limits. ZIP exports are limited to 4 GB and 65,535 files.
- If a file cannot be opened, make sure it is fully downloaded to your device. If it opens in PureRef, try saving a fresh copy there and reopening it here.

## Project details

The app is served through GitHub Pages from `index.html` on the `main` branch. No build step or backend is required. The repository currently contains the standalone bundled app, rather than a separate source/build project.

Run the drawing and group regression checks with `node tests/shapes.test.cjs` (Node.js required).

Found a problem? [Open an issue](https://github.com/Gregrioum/pureref_webvierer/issues) with your browser, device, PureRef version, and the steps to reproduce it. Only share a sample board if you are comfortable making its contents public.
