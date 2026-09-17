import React from 'react';

/**
 * The four companies that print American driver's licenses, as their own marks.
 *
 * Every logo is drawn in `currentColor` so a caller sets one `color` and the mark
 * arrives in that vendor's map colour — which is why the legend needs no separate
 * swatch: the logo *is* the swatch. Each `viewBox` is the measured ink box of the
 * artwork rather than the box the vendor shipped, so `height` alone lays them out
 * on a shared baseline.
 *
 * Two are trimmed, which is the only liberty taken with them. Canadian Bank Note's
 * mark is reduced to the `cbn` monogram: the real artwork sets "CANADIAN BANK NOTE
 * COMPANY, LIMITED" underneath in type that turns to mush below about 40px, and the
 * legend renders at 18. Veridos loses the GmbH tagline under its wordmark for the
 * same reason. Sources: IDEMIA, Thales and Canadian Bank Note from Wikimedia
 * Commons (all public domain, no attribution required); Veridos from its own
 * vector wordmark.
 */
export interface VendorLogoProps {
  /** Rendered height in px; width follows from the aspect ratio. */
  height: number;
  /** Accessible name, since a bare wordmark is an image to a screen reader. */
  title: string;
}

/**
 * `viewBox`, the aspect ratio callers need to reserve horizontal space, and
 * `baseline` — the fraction of the viewBox sitting *below* the wordmark's baseline.
 *
 * That last one exists because the legend aligns logos on their bottom edge, which
 * is only the same thing as the baseline when nothing hangs below the text. IDEMIA's
 * chevrons do: its wordmark baseline is 8 units up in a 36-unit box, so bottom-
 * aligning it floats the word a fifth of its height above the count beside it. Each
 * logo pays its own ratio back as negative bottom margin, so callers need not care.
 *
 * These are measured, not eyeballed, and the measurement is fussier than it looks.
 * Rasterise the wordmark alone at 16x, then take the lowest row still carrying about
 * a third of peak ink: below that line only the overshoot of round glyphs survives —
 * the O and S in VERIDOS sit ~1 unit under the baseline, and cbn's swash a good deal
 * further. Trimming the bitmap instead measures the overshoot, and taking the modal
 * column bottom instead measures THALES' wide crossbars, which is 45 units wrong.
 * Every logo here was out by 0.1-0.7px before this was done properly.
 */
const box = (vb: string, ratio: number, baseline = 0) => ({ vb, ratio, baseline });

export const IDEMIA_BOX = box('0 0 144 36', 4, 0.2535);
export const THALES_BOX = box('0 0 484 57.4', 8.43, 0.0081);
export const CBN_BOX = box('6 1 175 100', 1.75, 0.025);
export const VERIDOS_BOX = box('20 215 465 70', 6.64, 0.0411);
export const ENTRUST_BOX = box('0 0 717 100', 7.17, 0.1925);

export const IdemiaLogo: React.FC<VendorLogoProps> = ({ height, title }) => (
  <svg height={height} width={height * IDEMIA_BOX.ratio} viewBox={IDEMIA_BOX.vb}
       fill="currentColor" role="img" aria-label={title}
       style={{ marginBottom: -height * IDEMIA_BOX.baseline }}>
    <title>{title}</title>
      <path d="m 60.69922,9.19922 v 17.5 h 5.60156 c 2.2,0.1 4.29961,-0.59844 6.09961,-1.89844 C 74.30039,23.20078 75.5,20.7 75.5,18 c 0,-1.8 -0.6,-3.5 -1.5,-5 -0.8,-1.1 -1.8,-2.09922 -3,-2.69922 -1.5,-0.7 -3.10078,-1.10156 -4.80078,-1.10156 z m -8.39844,0.10156 v 17.5 H 55 v -17.5 z m 27.69922,0 v 17.5 h 11.30078 v -2.5 h -8.5 V 19.09961 H 90.5 v -2.5 h -7.69922 v -4.79883 h 8.5 v -2.5 z m 16,0 v 17.5 h 2.69922 V 13.69922 h 0.10156 l 5.39844,13.10156 H 106.5 L 112,13.69922 v 13.10156 h 2.69922 v -17.5 h -3.79883 l -5.59961,13.5 -5.60156,-13.5 z m 24.40039,0 v 17.5 h 2.69922 v -17.5 z m 13.29883,0 -7.09961,17.5 h 2.80078 L 131,22.69922 h 8.5 l 1.59961,4.10156 H 144 l -7.09961,-17.5 z m -70.39844,2.59961 h 2.79883 c 1.5,0 3.10078,0.40039 4.30078,1.40039 1.4,1.2 2.19922,2.89883 2.19922,4.79883 0,1.2 -0.3,2.40039 -1,3.40039 -0.4,0.5 -0.79883,1.00039 -1.29883,1.40039 -1.2,0.9 -2.80078,1.39883 -4.30078,1.29883 h -2.69922 z m 71.89844,0.0996 3.30078,8.30078 h -6.59961 z" />
      <path d="M 9.59961,0 0,18 9.59961,36 h 3.30078 L 3.30078,18 12.90039,0 Z m 6.80078,0 -3.59961,18 3.59961,18 h 3 L 15.80078,18 19.40039,0 Z m 6.90039,0 3.59961,18 -3.59961,18 h 3 L 29.90039,18 26.30078,0 Z m 6.5,0 9.59961,18 -9.59961,18 h 3.29883 L 42.69922,18 33.09961,0 Z" />
  </svg>
);

export const ThalesLogo: React.FC<VendorLogoProps> = ({ height, title }) => (
  <svg height={height} width={height * THALES_BOX.ratio} viewBox={THALES_BOX.vb}
       fill="currentColor" role="img" aria-label={title}
       style={{ marginBottom: -height * THALES_BOX.baseline }}>
    <title>{title}</title>
      <path d="m484 42.1c0 7.8-2.3 10.1-8.5 12-6.7 2-18.6 3.3-25.7 3.3-8.4 0-18.9-0.5-27.8-2.6v-9h49.3v-12.3h-34.9c-10.5 0-14.4-2.9-14.4-13.1v-5.4c0-8.1 2.4-10.5 8.9-12.2 6.6-1.7 17.4-2.8 24.5-2.8 8.6 0 18.9 0.7 27.8 2.7v9h-48.5v10.3h34.9c10.5 0 14.4 2.8 14.4 13.1z" />
      <path d="m400 54.7c-10.2 2-20.5 2.6-30.5 2.6s-20.4-0.6-30.7-2.6v-52c10.2-2 20.6-2.7 30.5-2.7 10 0 20.1 0.6 30.3 2.7v9.3h-46.2v10.4h30.1v10.8h-30.1v12.3h46.4v9.2z" />
      <path d="m321 54.7c-9.2 2-18.4 2.6-27.3 2.6s-18.3-0.5-27.5-2.6v-53.4h14.7v43.5h40.1z" />
      <path d="m249 55.1c-4.9 1.4-11.4 1.9-16.2 2l-22.7-45.8h-1.3l-22.6 45.8c-4.8-0.1-10.5-0.6-15.4-2l28.7-53.7h20.5z" />
      <path d="m219 41.4c0 5.3-4.3 9.5-9.6 9.5s-9.5-4.3-9.5-9.5c0-5.3 4.3-9.5 9.5-9.5 5.3 0 9.6 4.2 9.6 9.5" fill="#5ebfd4" />
      <path d="m153 55.1c-4.7 1.4-9.7 1.8-14.7 1.9v-23.3h-36.5v23.3c-5-0.1-10-0.6-14.7-1.9v-52.8c4.7-1.4 9.7-1.8 14.7-1.9v22.5h36.5v-22.5c5 0.1 10 0.6 14.7 1.9z" />
      <path d="m66.2 12.1h-25.8v44h-14.6v-44h-25.8v-9.4c11.1-2 22.3-2.7 33.1-2.7s22 0.6 33.1 2.7z" />
  </svg>
);

export const CbnLogo: React.FC<VendorLogoProps> = ({ height, title }) => (
  <svg height={height} width={height * CBN_BOX.ratio} viewBox={CBN_BOX.vb}
       fill="currentColor" role="img" aria-label={title}
       style={{ marginBottom: -height * CBN_BOX.baseline }}>
    <title>{title}</title>
    {/* The artwork is authored at a 162/74 offset; the viewBox above is post-shift. */}
    <g transform="translate(-162,-74)">
        <path d="M237.99,76.258L237.99,117.538L238.273,117.25C241.978,113.465 248.666,109.046 255.317,109.046C271.171,109.046 278.558,127.397 278.558,139.798C278.558,153.778 269.926,173.138 253.714,173.138C247.579,173.138 243.715,168.974 242.129,165.206C245.129,167.419 249.23,168.641 251.738,168.641C263.983,168.641 267.25,150.823 267.25,140.297C267.25,130.649 262.613,115.342 250.169,115.342C246.24,115.342 242.309,117.569 238.154,122.148L238.111,162.326L238.104,163.68L228.722,173.045C228.722,173.045 227.785,173.009 227.531,173.004L227.531,97.778C227.531,87.331 225.941,87.223 218.306,86.705C218.306,86.705 217.356,86.64 217.116,86.623L217.116,83.266C217.334,83.191 237.568,76.402 237.99,76.258ZM238.104,75.871L216.786,83.028L216.786,86.93L218.286,87.036C225.838,87.55 227.199,87.638 227.199,97.778L227.199,173.328L228.838,173.328L238.386,163.798L238.441,162.326L238.441,122.261C242.489,117.864 246.338,115.673 250.169,115.673C262.373,115.673 266.921,130.776 266.921,140.297C266.921,150.701 263.722,168.312 251.738,168.312C249.161,168.312 244.822,167.026 241.855,164.635L241.387,164.263L241.594,164.822C243.079,168.811 247.14,173.47 253.714,173.47C270.142,173.47 278.89,153.914 278.89,139.798C278.89,127.265 271.397,108.718 255.317,108.718C248.719,108.718 242.275,112.817 238.322,116.75L238.322,75.797L238.104,75.871Z" />
        <path d="M249.178,137.842L248.448,136.565C230.677,153.127 212.388,170.633 193.784,167.11C173.895,163.342 181.852,129.05 191.768,118.822C199.537,110.825 206.374,106.872 212.179,123.708C212.179,123.708 214.764,121.294 217.166,122.359C219.033,123.178 213.174,100.114 188.392,114.11C167.602,125.844 155.586,174.36 193.593,172.937C211.214,172.265 230.85,155.465 248.878,139.97L249.178,137.842Z" />
        <path d="M248.878,139.97C266.071,125.194 281.803,111.605 292.93,114.331C314.791,119.683 280.022,172.572 318.007,172.082C333.83,171.874 341.429,157.058 341.429,157.058C341.429,157.058 332.323,170.359 319.26,168.71C299.27,166.21 333.175,110.95 291.922,109.846C277.872,109.469 263.342,122.686 248.448,136.565L248.878,139.97Z" />
        <path d="M241.752,164.767C244.723,167.158 249.11,168.475 251.738,168.475C263.99,168.475 267.086,150.293 267.086,140.294C267.086,130.282 262.186,115.507 250.169,115.507C245.383,115.507 241.342,118.882 238.277,122.261L238.277,162.326L238.268,163.68L228.838,173.16L227.365,173.16L227.365,97.778C227.365,86.902 225.654,87.403 216.95,86.777L216.95,83.146L238.154,76.03L238.154,117.132C242.441,112.757 249.062,108.881 255.317,108.881C270.638,108.881 278.726,126.161 278.726,139.798C278.726,154.178 270.026,173.304 253.714,173.304C247.632,173.304 243.415,169.241 241.752,164.767Z" />
    </g>
  </svg>
);

export const VeridosLogo: React.FC<VendorLogoProps> = ({ height, title }) => (
  <svg height={height} width={height * VERIDOS_BOX.ratio} viewBox={VERIDOS_BOX.vb}
       fill="currentColor" role="img" aria-label={title}
       style={{ marginBottom: -height * VERIDOS_BOX.baseline }}>
    <title>{title}</title>
      <path d="M55.7,282.1h-8.9l-26.3-66h9.3l15.7,41.1c2.3,5.7,4.2,11.2,5.7,16.5h0.1c1.8-5.3,3.7-10.7,5.7-15.9l17-41.8 		h8.5L55.7,282.1z" />
      <polygon points="103.9,282.1 103.9,216.1 138.8,216.1 138.8,222.5 112.1,222.5 112.1,245 137.7,245 137.7,251.2 		112.1,251.2 112.1,275.7 138.8,275.7 138.8,282.1 	" />
      <path d="M202.9,282.1l-24.7-30.2h-0.4v30.2h-8.1v-66c3.7-0.1,9.3-0.3,16.9-0.3c14.8,0,22.8,6,22.8,16.6 		c0,12.1-9.6,18.8-22.3,19c1.9,1.8,3.9,4.3,6.1,6.9l20.3,23.7H202.9z M185.4,222.1c-3.4,0-5.5,0.1-7.6,0.4v23.4 		c2.3,0.3,5.2,0.4,8,0.4c9.4,0,15.2-4.9,15.2-12.7C201,225.8,195,222.1,185.4,222.1" />
      <rect x="239.8" y="216.1" width="8.1" height="66" />
      <path d="M295.5,282.4c-7.1,0-12.2-0.3-17-0.3v-66c5.3,0,13.3-0.3,20.2-0.3c22.1,0,35.5,9.8,35.5,32.6 		C334.2,271.5,317.9,282.4,295.5,282.4 M297.2,222.2c-3.1,0-7.1,0.1-10.5,0.4v52.8c2.4,0.3,7,0.4,9.9,0.4c17.3,0,29.2-8.2,29.2-26.7 		C325.7,231.3,316.1,222.2,297.2,222.2" />
      <path d="M386.3,283c-21.3,0-30.3-14.2-30.3-33.4c0-22,14.7-34.4,32.2-34.4c19.7,0,30.7,12.2,30.7,33.5 		C418.9,270.9,404.7,283,386.3,283 M387.4,222c-12.1,0-22.8,9.4-22.8,26.8c0,14.6,5.6,27.4,22.3,27.4c13.2,0,23.4-9.1,23.4-26.5 		C410.3,231.6,401.6,222,387.4,222" />
      <path d="M456.9,283.2c-5.3,0-11.6-0.8-15.2-1.8l0.5-8.1c4.1,1.8,9.8,2.9,15.9,2.9c7.9,0,16.6-3.4,16.6-12.8 		c0-15.4-34.1-8.3-34.1-29.2c0-11.6,9.5-18.9,25.1-18.9c4.2,0,9.8,0.5,13.7,1.1l-0.4,7.5c-3.8-1.1-9.8-2-13.8-2 		c-11,0-16.2,4.4-16.2,11.3c0,15.2,34.4,8,34.4,29.4C483.3,275.5,470.9,283.2,456.9,283.2" />
  </svg>
);

/**
 * Entrust ships a stacked lockup — hexagon above, wordmark below — which would tower
 * over four wordmarks on one legend line. These two transforms rebuild it
 * horizontally: the hexagon scaled to the lockup height on the left, the wordmark
 * optically centred beside it. Measured ink boxes: hexagon x83-254 y140-337,
 * wordmark x-127-475 y354-421. The original's magenta gradient is dropped, since
 * every logo here wears its category colour.
 */
export const EntrustLogo: React.FC<VendorLogoProps> = ({ height, title }) => (
  <svg height={height} width={height * ENTRUST_BOX.ratio} viewBox={ENTRUST_BOX.vb}
       fill="currentColor" role="img" aria-label={title}
       style={{ marginBottom: -height * ENTRUST_BOX.baseline }}>
    <title>{title}</title>
    <g transform="translate(0,0) scale(0.50761) translate(-83,-140)">
      <path d="M168.1,335.8L83.6,287v-97.6l84.5-48.8l84.5,48.8V287L168.1,335.8z M239,279.2v-81.9l-70.9-40.9
	l-70.9,40.9v81.9l70.9,40.9L239,279.2z" /><polygon points="181.4,283.3 181.4,269.7 225.3,244.1 225.3,230.5 181.4,255.8 181.4,242.2 225.4,217 
	225.4,205.2 168.1,172.1 110.7,205.2 110.7,271.3 168.1,304.4 225.4,271.3 225.4,257.7 " />
    </g>
    <g transform="translate(241.8,-337.5)">
      <path d="M-60.1,418.2h-66.2v-61.8h64V370h-49.3v9.3h34.3v13.6h-34.3v11.7h51.5V418.2z M-40.3,356.4v61.8h14.7v-45.7
	l37.3,45.7h19.4v-61.8H16.4v45.8l-37.3-45.8H-40.3z M48.5,356.4V370h27.9v48.2h14.7V370H119v-13.6H48.5z M403.2,356.4V370h27.9v48.2
	h14.7V370h27.9v-13.6H403.2z M185.3,356.4c6.7,0,12,1.8,16,5.5c4,3.7,5.9,8.6,5.9,14.7c0,9.8-4.5,16-13.5,18.8l0,0l16.3,22.8h-17.1
	l-15.3-21.5h-26.5v21.5h-14.7v-61.8L185.3,356.4L185.3,356.4z M151.1,370v13.1h31.6c8.8,0,9.5-3.1,9.5-6.6c0-4-2.5-6.5-9.1-6.5
	L151.1,370L151.1,370z M264.7,406.3c19.1,0,20.9-6.5,20.9-12.2v-37.7h14.7v40.9c0,14.6-15.7,22.6-35.6,22.6h0
	c-19.9,0-35.6-8-35.6-22.6v-40.9h14.7v37.7C243.8,399.7,245.6,406.3,264.7,406.3L264.7,406.3z M379.3,374.4l9.2-9.7
	c-12.4-9.9-28.1-9.6-32.5-9.9c-4.3-0.3-33.5-0.9-34.8,18.9c-0.9,13.4,11.9,17.8,32.6,18.3c20.6,0.5,21.5,4.1,21.5,6.3
	c0,2.4-2.6,7.9-21.1,7.6c-12-0.2-22.2-4.4-27.8-9.1l-8.2,10.8c9.7,7.7,22,11.5,37.4,11.5c18.5,0,34.4-4.8,35.2-19.9
	c1-17.6-17-19.7-33.3-21c-15.8-1.3-20.8-1.7-20.8-5.6c0.1-4.3,12-4.9,20.3-4.4C366.6,368.8,373.8,371.2,379.3,374.4z" />
    </g>
  </svg>
);
