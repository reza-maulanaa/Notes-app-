# Design

## Color palette

Strategy: **Restrained** — pure white surface, one warm crimson accent, no decorative color.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `oklch(1.000 0.000 0)` | Page background — pure white |
| `--color-surface` | `oklch(0.968 0.002 28)` | Card / input backgrounds |
| `--color-border` | `oklch(0.905 0.008 28)` | Dividers, input borders |
| `--color-ink` | `oklch(0.145 0.015 28)` | Body text — near-black, warm hint |
| `--color-muted` | `oklch(0.480 0.009 28)` | Secondary text, metadata |
| `--color-primary` | `oklch(0.548 0.210 28)` | Primary CTAs only — warm crimson |
| `--color-primary-fg` | `oklch(1.000 0.000 0)` | Text on primary fills |
| `--color-danger` | `oklch(0.500 0.190 15)` | Delete / error states |

Accent is used exclusively for the primary action button (Simpan). Nothing else.

## Typography

Single family: **Inter** via `next/font/google`. No pairing needed for a product UI.

| Element | Size | Weight | Notes |
|---|---|---|---|
| Page heading | 22px | 600 | `letter-spacing: -0.02em` |
| Note title (list) | 14px | 600 | `letter-spacing: -0.01em` |
| Content preview | 13px | 400 | Muted, truncated |
| Article heading | 22px | 700 | `letter-spacing: -0.03em` |
| Body text | 15px | 400 | `line-height: 1.7`, max `65ch` |
| Metadata / date | 12px | 400 | Muted |
| Button | 13px | 500 | `letter-spacing: 0.01em` |

## Spacing

Base unit: 4px. Common steps: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48.

Page padding: `48px 24px 80px`. Content max-width: 600px centered.

## Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `6px` | Buttons, small inputs |
| `--radius-md` | `8px` | Medium surfaces |
| `--radius-lg` | `12px` | Form card panels |

## Component vocabulary

**Form card**: `--color-surface` bg + `--color-border` border + `--radius-lg`. Borderless inputs inside — title bold, content regular, separated by a 1px divider. CTA right-aligned.

**Note row**: Simple `border-bottom` list rows. Title + preview left, delete icon right. No card chrome — border-only is lighter.

**Buttons**: 
- Primary: `--color-primary` bg, white text, `--radius-sm`, 7×16px padding
- Secondary: transparent bg, `--color-border` border, ink text
- Icon button: no bg, muted color, icon only with aria-label

**Back nav**: Small muted text with arrow icon, no underline, hover shifts color toward ink.

## Motion

150ms `cubic-bezier(0.16, 1, 0.3, 1)` on color/bg transitions only.
Respects `prefers-reduced-motion` — transitions disabled entirely when set.

## Layout

Single-column, centered. No sidebar, no top nav — content surface only.
