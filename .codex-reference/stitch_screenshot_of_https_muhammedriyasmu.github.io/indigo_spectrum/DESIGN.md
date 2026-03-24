# Portfolio Design System: High-End Editorial Strategy

## 1. Overview & Creative North Star
The **Creative North Star** for this design system is **"The Digital Curator."** 

Moving away from the generic "tech portfolio" template, this system treats a developer’s body of work as an editorial gallery. It emphasizes intentional asymmetry, oversized display typography, and a "soft-tech" aesthetic. By utilizing the depth of the Flutter-inspired palette and high-contrast spacing, we transform a simple list of projects into a high-end digital experience. The goal is to convey technical mastery through visual restraint and sophisticated layering.

## 2. Colors
Our palette balances the vibrancy of modern tech with the grounded stability of deep indigos and soft grays.

*   **Primary (#3525cd):** Used for key brand moments and primary actions.
*   **Secondary (#b4136d):** Used for high-energy accents and specific tech-stack highlights.
*   **Surface Hierarchy:** We utilize the `surface` tokens to create a "paper-on-glass" effect.
*   **The "No-Line" Rule:** Designers are strictly prohibited from using 1px solid borders to define sections. Layout boundaries must be achieved through background shifts—for example, moving from `surface` (#f8f9fa) to `surface_container_low` (#f3f4f5).
*   **The Glass & Gradient Rule:** Floating elements like Navigation Bars or specific project labels should utilize Glassmorphism. Use `surface_container_lowest` at 70% opacity with a 12px backdrop-blur.
*   **Signature Textures:** Apply a linear gradient from `primary` (#3525cd) to `primary_container` (#4f46e5) on Hero CTAs to add "soul" and depth that flat hex codes cannot provide.

## 3. Typography
The system uses a pairing of **Plus Jakarta Sans** for authority and **Inter** for clarity.

*   **Display (Plus Jakarta Sans):** Oversized and confident. Used for the Hero and major section headers. The `display-lg` (3.5rem) should be used to make a statement, often paired with asymmetric alignment.
*   **Headline (Plus Jakarta Sans):** Used for section titles. These provide the "Editorial" feel, emphasizing high-contrast scale between the title and the body text.
*   **Body (Inter):** Optimized for readability. Used for project descriptions and personal bios. The `body-lg` (1rem) is the standard for long-form content to ensure a premium, easy-to-read experience.
*   **Labels & Monospace:** Used for metadata (dates, tech stack tags). This reflects the "Flutter Developer" identity through a clean, technical lens.

## 4. Elevation & Depth
We reject the standard "shadow-on-white" approach in favor of **Tonal Layering.**

*   **The Layering Principle:** Hierarchy is achieved by stacking. Place a `surface_container_lowest` (#ffffff) card on top of a `surface_container_low` (#f3f4f5) background. This creates a soft, natural "lift."
*   **Ambient Shadows:** When a floating state is required (e.g., a hovered project card), use a shadow with a 32px blur, 4% opacity, tinted with the `on_surface` color. It should feel like a soft glow of light, not a dark smudge.
*   **The "Ghost Border" Fallback:** If a container needs more definition, use the `outline_variant` token at 15% opacity. Never use 100% opaque borders.
*   **Glassmorphism:** Navigation menus and interactive chips should use a semi-transparent `surface_bright` with a heavy blur to allow background colors to "bleed" through, creating an integrated, high-end feel.

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `xl` roundedness, no border.
*   **Secondary:** `surface_container_high` background with `primary` text.
*   **Tertiary:** Transparent background, `primary` text, with a `ghost-border` on hover.

### Cards (Projects & Skills)
*   **Structure:** No dividers. Use `spacing-6` (2rem) to separate internal elements.
*   **Style:** `surface_container_lowest` background, `lg` roundedness (1rem). 
*   **Hover State:** Shift background to `surface_bright` and apply an **Ambient Shadow**.

### Chips (Tech Stack)
*   **Style:** Minimalist. Use `primary_fixed` background with `on_primary_fixed` text. 
*   **Shape:** `full` roundedness (capsule) to contrast against the `lg` roundedness of the project cards.

### Input Fields (Contact)
*   **Style:** `surface_container_low` background. 
*   **Focus State:** Transition background to `surface_container_highest` and add a subtle `primary` ghost-border. No heavy outlines.

### Progress Bars (Skill Levels)
*   **Track:** `surface_container_high`.
*   **Indicator:** Linear gradient of `primary` to `secondary`. This reinforces the "high-end tech" persona.

## 6. Do's and Don'ts

### Do
*   **Do** use extreme whitespace (`spacing-20` or `spacing-24`) between major sections to allow the design to breathe.
*   **Do** use asymmetrical layouts (e.g., text on the left, project image offset to the right) to break the "grid" feel.
*   **Do** ensure all interactive elements have a soft, elastic transition (300ms cubic-bezier).
*   **Do** use `on_surface_variant` for secondary text to maintain a sophisticated contrast ratio.

### Don't
*   **Don't** use 1px solid black or high-contrast gray borders.
*   **Don't** use standard "Drop Shadows" with high opacity.
*   **Don't** use more than two font families; the hierarchy must be driven by weight and scale, not variety.
*   **Don't** crowd components. If it feels tight, double the spacing.