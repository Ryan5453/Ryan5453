import React, { ReactNode, useState } from 'react';
import { GUTTER_ORDER, JURISDICTIONS, NA_VIEW, TERRITORY_ORDER } from './northAmerica';
import type { Jurisdiction } from './northAmerica';

/**
 * A categorical choropleth of every North American license-issuing jurisdiction.
 * Fill says who prints the card; everything else about a jurisdiction lives in a
 * popup you get by clicking it.
 *
 * Things worth knowing before editing:
 *
 * **The palette is not a matter of taste.** A choropleth has to separate *all*
 * pairs, not just adjacent ones, because any two jurisdictions can end up side by
 * side — and that caps how many colours it can carry. Five is the ceiling here, and
 * only just. Each hue is snapped from that vendor's own logo and stepped for a black
 * surface. The first four clear a colour-distance of 18.0 under simulated
 * deuteranopia against a threshold of 8. The fifth, Entrust's magenta, was the only
 * candidate of many that cleared both gates at all: it sits at 6.0 against Thales'
 * teal, inside the 6-8 band that is legal only alongside secondary encoding. That
 * encoding is present twice over — every jurisdiction carries its own two-letter
 * label, and each fill is separated by a background-coloured seam. Note Yukon
 * (Entrust) borders Alaska (Thales), so that weak pair is genuinely adjacent; for a
 * red-green colour-blind reader the labels, not the fills, do the work there. The
 * sixth bucket is grey, which carries no hue at all and so collides with nothing.
 *
 * **Signature status is deliberately not on the map.** It used to be: a star on each
 * of the six signed jurisdictions. But six markers competing with 69 labels cost more
 * legibility than they bought, for a fact that only matters once a reader is asking
 * about somewhere specific — so it moved into the popup, where the question is
 * already being asked.
 *
 * **Labels sit in ink chosen per fill** — white on the dark fills, near-black on the
 * light ones. One global label colour fails contrast at one end or the other.
 *
 * Label anchors are checked two ways: no two overlap, and each sits at least 80%% on
 * its own shape. Maryland failed the second at 42%% — its centroid is in the
 * Chesapeake — which is why it is a gutter chip rather than labelled in place.
 */

export interface MapCategory {
  /** Assignment values this category covers; several, for the pooled buckets. */
  keys: string[];
  /** Legend name. */
  label: string;
  color: string;
  /** Label ink for text set on this fill. */
  ink: string;
  /** Legend mark — a vendor logo, or a plain word for the grey bucket. */
  legend: ReactNode;
  /**
   * Set when `legend` is text rather than an SVG. Logos need lifting to their
   * wordmark baseline; text is already positioned correctly by the browser, so
   * lifting it too would put it a pixel and a half high.
   */
  legendIsText?: boolean;
}

export interface SignatureMark {
  /** Jurisdiction codes carrying this signature status. */
  codes: string[];
  /** Shown in the popup for those jurisdictions. */
  label: string;
}

interface Props {
  /** Code to vendor name, verbatim — the popup shows exactly what is stored here. */
  assignments: Record<string, string>;
  categories: MapCategory[];
  signed: SignatureMark[];
}

const LABEL_FS = 36;
/**
 * Where Departure Mono's baseline sits above the bottom of a `text-xs`/`leading-none`
 * line box, in px: descent + half-leading, with the font's 550/-150 metrics over 550
 * units per em at a 12px font size in a 12px line box. Derivation lives beside the
 * legend, which is the only thing that uses it.
 */
const LEGEND_BASELINE = 1.636;
/** Chip geometry, in map units. */
const CHIP = { w: 86, h: 50, gap: 10 };
/** The Atlantic east of the mid-Atlantic coast — verified clear of every outline. */
const GUTTER_X = 2110;
const GUTTER_CENTER_Y = 1470;
/** The Pacific at the bottom left of the crop, likewise clear of every outline. */
const TERRITORY_X = 540;
const TERRITORY_TOP = 1350;

const JurisdictionMap: React.FC<Props> = ({ assignments, categories, signed }) => {
  /** Hover only draws the outline; the detail panel is driven by click. */
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const toggle = (code: string) => setSelected((cur) => (cur === code ? null : code));

  const categoryFor = (code: string) =>
    categories.find((c) => c.keys.includes(assignments[code]));
  const markFor = (code: string) => signed.find((s) => s.codes.includes(code));

  const counts = categories.map((c) => ({
    ...c,
    count: Object.values(assignments).filter((v) => c.keys.includes(v)).length,
  }));

  const chipY = (order: string[], code: string, centerY: number) => {
    const total = order.length * (CHIP.h + CHIP.gap) - CHIP.gap;
    return centerY - total / 2 + order.indexOf(code) * (CHIP.h + CHIP.gap);
  };

  /**
   * Where the popup points. For anything drawn on the map that is its own label
   * anchor — for the gutter states, deliberately the shape rather than the chip, so
   * the readout appears over Vermont and not over the chip standing in for it.
   *
   * The five territories have no anchor at all: the source artwork does not draw
   * them, so their coordinates are 0,0 and the popup was landing in the corner of
   * the figure instead of next to what you clicked. They are positioned by this
   * component rather than by the data, so this is the only place that knows where
   * they ended up; the anchor is the chip's right edge.
   */
  const anchorFor = (j: Jurisdiction) => {
    if (j.placement !== 'territory') return { x: j.labelX, y: j.labelY };
    const i = TERRITORY_ORDER.indexOf(j.code);
    return {
      x: TERRITORY_X + CHIP.w,
      y: TERRITORY_TOP + i * (CHIP.h + CHIP.gap) + CHIP.h / 2,
    };
  };

  const outlined = hovered ?? selected;
  const outlinedJ = outlined ? JURISDICTIONS.find((j) => j.code === outlined) : undefined;

  const sel = selected ? JURISDICTIONS.find((j) => j.code === selected) : undefined;
  const selCat = selected ? categoryFor(selected) : undefined;
  const selMark = selected ? markFor(selected) : undefined;

  /** Props shared by every clickable shape, so keyboard users get the same affordance. */
  const hit = (code: string) => ({
    onMouseEnter: () => setHovered(code),
    onClick: () => toggle(code),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(code);
      }
    },
    tabIndex: 0,
    role: 'button' as const,
    style: { cursor: 'pointer' as const, outline: 'none' },
  });

  /**
   * A chip — the same object whether it stands in the gutter, beside Hawaii, or in
   * the territory cluster.
   */
  const chip = (code: string, x: number, y: number) => {
    const j = JURISDICTIONS.find((p) => p.code === code);
    const cat = categoryFor(code);
    if (!j || !cat) return null;
    return (
      <g key={code} {...hit(code)} aria-label={`${j.name}, ${assignments[code]}`}>
        <rect x={x} y={y} width={CHIP.w} height={CHIP.h} fill={cat.color} />
        <text
          x={x + CHIP.w / 2}
          y={y + CHIP.h / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={LABEL_FS}
          fill={cat.ink}
          className="font-mono"
          style={{ pointerEvents: 'none' }}
        >
          {code}
        </text>
        <title>{`${j.name} — ${assignments[code]}`}</title>
      </g>
    );
  };

  return (
    <figure className="mb-10">
      {/*
        The map used to sit at the foot of the post and bleed out of the prose column
        with a negative margin. It has its own page now, which is already sized for
        it, so the bleed is gone — kept here it just made the panel overrun the page.
        The inner div is a tight positioning context, which keeps the popup's
        percentages measured against the SVG rather than the panel padding.
      */}
      <div className="tui-panel">
        <span className="tui-panel-title font-mono">north america</span>
        <div className="relative">
        <svg
          viewBox={`${NA_VIEW.x} ${NA_VIEW.y} ${NA_VIEW.w} ${NA_VIEW.h}`}
          className="w-full"
          role="img"
          aria-label={
            'Map of North American card producers. ' +
            counts.map((c) => `${c.label}: ${c.count} of 69 jurisdictions`).join('. ') +
            '. ' +
            signed.map((s) => `${s.label}: ${s.codes.join(', ')}`).join('. ') +
            '. Each jurisdiction is individually labelled.'
          }
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            {/*
              The terminal grid. Lines are *light*, not dark, and that is a
              constraint rather than a preference: IDEMIA's violet and CBN's crimson
              already sit at 3.05:1 and 3.02:1 on black, so cutting dark gaps into
              the fills would drop both under the 3:1 floor. Lightening lifts every
              fill instead. Cell is 15x25 units — about 7x12px as rendered, roughly
              a character cell.

              Deliberately no clipPath here. Clipping to the landmasses needs a
              clipPath full of <use> references, which is fine in browsers but could
              not be verified in the renderer available while building this, and a
              decorative grid is not worth an unverifiable dependency.
            */}
            <pattern id="cell-grid" width="15" height="25" patternUnits="userSpaceOnUse">
              <rect width="15" height="1.4" fill="#ffffff" opacity="0.12" />
              <rect width="1.4" height="25" fill="#ffffff" opacity="0.12" />
            </pattern>
          </defs>

          {/* Clicking empty sea clears the selection. */}
          <rect
            x={NA_VIEW.x}
            y={NA_VIEW.y}
            width={NA_VIEW.w}
            height={NA_VIEW.h}
            fill="transparent"
            onClick={() => setSelected(null)}
          />
          {JURISDICTIONS.filter((j) => j.d).map((j) => {
            const cat = categoryFor(j.code);
            if (!cat) return null;
            return (
              <path
                key={j.code}
                d={j.d}
                transform={j.transform}
                fill={cat.color}
                /*
                 * Stroking each shape in the page background is what puts a seam
                 * between two same-coloured neighbours — with 30 IDEMIA states
                 * touching, the map would otherwise read as one blob.
                 */
                stroke="var(--tui-bg-dark)"
                strokeWidth={3}
                {...hit(j.code)}
                aria-label={`${j.name}, ${assignments[j.code]}`}
              >
                <title>{`${j.name} — ${assignments[j.code]}`}</title>
              </path>
            );
          })}

          {/*
            The grid runs edge to edge rather than being clipped to land, so the
            whole panel reads as one screen the map is drawn on. Over black it is
            barely there; over a fill it lifts the colour slightly. Drawn after the
            fills and before every label, so nothing legible gets a line through it.
          */}
          <rect
            x={NA_VIEW.x}
            y={NA_VIEW.y}
            width={NA_VIEW.w}
            height={NA_VIEW.h}
            fill="url(#cell-grid)"
            style={{ pointerEvents: 'none' }}
          />

          {/* Two-letter code set directly on the shape. */}
          {JURISDICTIONS.filter((j) => j.placement === 'inline').map((j) => {
            const cat = categoryFor(j.code);
            if (!cat) return null;
            return (
              <text
                key={j.code}
                x={j.labelX}
                y={j.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={LABEL_FS}
                fill={cat.ink}
                className="font-mono"
                style={{ pointerEvents: 'none' }}
              >
                {j.code}
              </text>
            );
          })}

          {/*
            Hawaii: its anchor is open water beside the chain, so ink picked to sit
            on a fill would be near-black on a black page. A chip gives the label
            the fill its ink expects.
          */}
          {JURISDICTIONS.filter((j) => j.placement === 'offshore').map((j) =>
            chip(j.code, j.labelX - CHIP.w / 2, j.labelY - CHIP.h / 2),
          )}

          {/* Too small to label in place: chip in the Atlantic, tied back by a leader. */}
          {GUTTER_ORDER.map((code) => {
            const j = JURISDICTIONS.find((p) => p.code === code);
            if (!j) return null;
            const y = chipY(GUTTER_ORDER, code, GUTTER_CENTER_Y);
            return (
              <g key={`lead-${code}`}>
                {/*
                  Right-angled rather than diagonal, each with its own turn column so
                  the ten routes read as a bus instead of a fan of crossing lines.
                  Corners, not slopes — the same reason terminals draw boxes.
                */}
                <polyline
                  points={[
                    `${j.labelX},${j.labelY}`,
                    `${GUTTER_X - 40 - GUTTER_ORDER.indexOf(code) * 11},${j.labelY}`,
                    `${GUTTER_X - 40 - GUTTER_ORDER.indexOf(code) * 11},${y + CHIP.h / 2}`,
                    `${GUTTER_X},${y + CHIP.h / 2}`,
                  ].join(' ')}
                  fill="none"
                  stroke="var(--tui-bright)"
                  strokeWidth={2.5}
                  opacity={0.45}
                />
                {chip(code, GUTTER_X, y)}
              </g>
            );
          })}

          {/* The five territories, which the source artwork does not draw at all. */}
          <text
            x={TERRITORY_X}
            y={TERRITORY_TOP - 26}
            fontSize={26}
            fill="var(--tui-dim)"
            className="font-mono"
          >
            U.S. territories
          </text>
          {TERRITORY_ORDER.map((code, i) =>
            chip(code, TERRITORY_X, TERRITORY_TOP + i * (CHIP.h + CHIP.gap)),
          )}

          {/*
            The hover outline is a separate overlay drawn last. Stroking the shape
            in place would bury half the line under later-painted neighbours.
          */}
          {outlinedJ?.d && (
            <path
              d={outlinedJ.d}
              transform={outlinedJ.transform}
              fill="none"
              stroke="var(--tui-bright)"
              strokeWidth={4}
              style={{ pointerEvents: 'none' }}
            />
          )}
        </svg>

        {/*
          A popup pinned to the jurisdiction you clicked, rather than a panel in the
          page. Details belong next to the thing they describe — a readout parked
          above a map of 69 shapes makes you look away from whatever you just
          clicked. Position is the label anchor expressed as a percentage of the
          viewBox, so it tracks the map at any width; it flips to the other side of
          the cursor near the right or bottom edge so it never leaves the figure.
        */}
        {sel && selCat && (() => {
          const at = anchorFor(sel);
          const px = ((at.x - NA_VIEW.x) / NA_VIEW.w) * 100;
          const py = ((at.y - NA_VIEW.y) / NA_VIEW.h) * 100;
          const flipX = px > 58;
          const flipY = py > 62;
          return (
            <div
              className="absolute z-10 font-mono text-xs p-3 pointer-events-none"
              style={{
                left: `${px}%`,
                top: `${py}%`,
                transform: `translate(${flipX ? '-100%' : '0'}, ${flipY ? '-100%' : '0'})
                            translate(${flipX ? '-14px' : '14px'}, ${flipY ? '-14px' : '14px'})`,
                background: 'var(--tui-bg-dark)',
                border: '1px solid var(--tui-border)',
                borderLeft: `2px solid ${selCat.color}`,
                /*
                 * `max-content`, not a min-width. An absolutely positioned block
                 * takes its available width from the space left of the container
                 * edge, so at left:75% the popup gets 25% of the figure to lay out
                 * in and every line wraps — regardless of the translate that moves
                 * it back. Sizing to content decouples width from position.
                 */
                width: 'max-content',
                whiteSpace: 'nowrap',
              }}
              role="status"
              aria-live="polite"
            >
              <div className="mb-2" style={{ color: 'var(--tui-bright)' }}>
                {sel.name}
                <span style={{ color: 'var(--tui-dim)' }}>
                  {sel.country === 'CA' ? '  ·  Canada' : '  ·  United States'}
                </span>
              </div>
              <div className="leading-5">
                <span className="inline-block w-32 pr-2" style={{ color: 'var(--tui-dim)' }}>
                  card producer
                </span>
                <span style={{ color: selCat.color }}>{assignments[sel.code]}</span>
              </div>
              <div className="leading-5">
                <span className="inline-block w-32 pr-2" style={{ color: 'var(--tui-dim)' }}>
                  barcode
                </span>
                <span style={{ color: selMark ? 'var(--tui-yellow)' : 'var(--tui-dim)' }}>
                  {selMark ? selMark.label : 'no published signature'}
                </span>
              </div>
              <div className="leading-5">
                <span className="inline-block w-32 pr-2" style={{ color: 'var(--tui-dim)' }}>
                  card issued
                </span>
                <span
                  style={{
                    color:
                      sel.issuance === 'counter'
                        ? 'var(--tui-orange)'
                        : sel.issuance
                          ? 'var(--tui-text)'
                          : 'var(--tui-dim)',
                  }}
                >
                  {sel.issuance === 'central'
                    ? 'centrally, then mailed'
                    : sel.issuance === 'counter'
                      ? 'over the counter'
                      : 'not published'}
                </span>
              </div>
            </div>
          );
        })()}
        </div>

        {/*
        Always present, so identity never rests on colour memory.

        Alignment here is done by hand rather than with `items-baseline`, because
        baseline *synthesis* is the unreliable part. Tailwind's preflight sets
        `svg { display: block }`, so each logo is a block-level replaced element
        inside a wrapper span — and a block box with no line boxes has no real
        baseline, only one synthesised from its bottom margin edge. Relying on that
        put every logo about a pixel and a half low.

        So: align bottom edges, which is unambiguous, and offset by where the text
        baseline actually falls. Departure Mono is 550 units/em with a 550/-150
        ascent/descent, so its content box is 1.273em — taller than the `leading-none`
        line box it sits in. The resulting negative half-leading puts the baseline
        LEGEND_BASELINE px up from the bottom of the line box. Each logo already
        pulls itself down to its own wordmark baseline (see vendorLogos), so lifting
        the wrapper by the same amount lands the two on one line.
      */}
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4 mt-4">
        {counts.map((c) => (
          <div key={c.label} className="flex items-end gap-2.5">
            <span
              className="font-mono text-xs leading-none"
              style={{ color: c.color, marginBottom: c.legendIsText ? 0 : LEGEND_BASELINE }}
            >
              {c.legend}
            </span>
            <span className="font-mono text-xs leading-none" style={{ color: 'var(--tui-dim)' }}>
              <span style={{ color: 'var(--tui-bright)' }}>{c.count}</span>
              {c.count === 1 ? ' jurisdiction' : ' jurisdictions'}
            </span>
          </div>
        ))}
      </div>
      </div>
    </figure>
  );
};

export default JurisdictionMap;
