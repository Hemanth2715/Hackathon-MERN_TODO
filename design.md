Color Scheme:

The use of a radial gradient background from #183EC2 to #EAEEFE suggests a preference for blue hues.
Text colors include gradients from black to #001E80 and a specific color #010D3E for body text, indicating a consistent color palette.
Typography:

The font size for the main heading is very large (text-5xl to text-7xl), indicating a preference for bold, attention-grabbing typography.
The body text is set to text-xl, suggesting a hierarchy in text sizes for better readability and emphasis.
Spacing and Layout:

Padding and margin utilities (e.g., pt-8, pb-20, mt-6, gap-1) indicate a consistent approach to spacing.
The use of container class suggests a responsive layout that adapts to different screen sizes.
Buttons and Interactive Elements:

Buttons have specific styles, such as btn btn-primary and btn btn-text, indicating a standardized approach to interactive elements.
The use of flex and gap utilities for button alignment suggests a consistent approach to button layout and spacing.
Imagery and Graphics:

The inclusion of multiple images (cog.png, cylinder.png, noodle.png) suggests a brand that uses visual elements to enhance the user interface.
The use of absolute positioning and transformations (e.g., transform:translateY(150px) translateZ(0)) indicates a detailed approach to image placement and effects.
Borders and Shadows:

The use of borders with specific colors and radii (e.g., border border-[#222]/10, rounded-lg) suggests a consistent approach to border styling.
Although not explicitly shown, the use of such utilities often accompanies shadow effects for depth.
Responsive Design:

The use of responsive utilities (e.g., md:flex, md:w-[478px], hidden md:block) indicates a design that adapts to different screen sizes.
Different layouts for mobile and desktop views suggest a mobile-first or responsive design approach.
Gradients and Transparency:

The use of gradients for both background and text (e.g., bg-gradient-to-b, from-black to-[#001E80], text-transparent bg-clip-text) suggests a modern design aesthetic.
Transparency effects (e.g., border-[#222]/10) indicate a subtle use of transparency for a refined look.
These guidelines help maintain a con


1. Color Palette
Primary Colors

Primary Blue: #183EC2 (Deep blue used in gradients)
Light Blue: #EAEEFE (Soft blue for backgrounds)
Deep Navy: #001E80 (Text gradient end)
Dark Navy: #010D3E (Body text)
Pure Black: Used for primary text and gradient starts

Usage

Radial gradient backgrounds: #183EC2 to #EAEEFE
Text gradients: Black to navy (#001E80)
Border colors: Semi-transparent black (#222 with 10% opacity)

2. Typography Hierarchy
Heading Styles

Main Headlines: 5xl on mobile, 7xl on desktop
Font Weight: Bold (font-bold)
Letter Spacing: Tighter tracking (tracking-tighter)
Gradient Text: Black to navy gradient with background-clip text

Body Text

Size: Extra large (text-xl)
Color: Dark navy (#010D3E)
Tracking: Tight letter spacing (tracking-tight)

Small Text/Labels

Size: Small (text-sm)
Style: Inline-flex with borders and padding

3. Button Design System
Primary Button

Class: btn btn-primary
Style: Likely filled with primary brand color
Usage: Main call-to-action

Secondary Button

Class: btn btn-text
Style: Text-based with minimal styling
Features: Can include icons/spans
Usage: Secondary actions like "Learn more"

4. Layout & Spacing
Container Structure

Responsive: Mobile-first with md: breakpoints
Flexbox: Extensive use of flex layouts
Container: Centered content container

Spacing Scale

Padding: pt-8 pb-20 (mobile), md:pt-5 md:pb-10 (desktop)
Margins: mt-6, mt-[30px], mt-20
Gaps: gap-1 for button groups

Responsive Breakpoints

Mobile: Default styles
Medium (md:): 768px and up
Large (lg:): 1024px and up

5. Visual Elements & Imagery
Decorative Images

Cog Image: Primary hero image, full height on desktop
Cylinder Image: Hidden on mobile, decorative element
Noodle Image: Large screens only, rotated 30 degrees

Image Positioning

Absolute Positioning: Used for decorative elements
Transforms: translateY(150px) for animation-ready elements
Responsive Visibility: hidden md:block, hidden lg:block

6. Interactive Elements
Badges/Labels

Style: Inline-flex with rounded borders
Border: 1px solid with 10% opacity
Padding: px-3 py-1
Border Radius: rounded-lg
Example: "Version 2.0 is here" announcement

Hover States

Preparation: translateZ(0) suggests 3D transforms ready
Animation Ready: Transform properties set for smooth transitions

7. Content Strategy
Messaging Hierarchy

Announcement: Small badge with version info
Headline: Large, gradient text with key value proposition
Description: Supporting text explaining benefits
Actions: Primary and secondary CTAs

Tone of Voice

Motivational: "Celebrate the joy of accomplishment"
Benefit-focused: "track your progress, motivate your efforts"
Action-oriented: "Get for free", "Learn more"

8. Technical Implementation
CSS Framework

Tailwind CSS: Utility-first approach
Custom Properties: Mix of Tailwind and custom measurements
Responsive Design: Mobile-first methodology

Performance Considerations

Image Optimization: Next.js static media optimization
Transform Preparation: translateZ(0) for GPU acceleration
Overflow Management: overflow-x-clip for clean edges

Design Principles Summary

Gradient-Heavy: Extensive use of gradients for visual depth
Blue-Dominant: Primary brand colors in blue spectrum
Typography-Forward: Large, bold headlines with careful hierarchy
Responsive-First: Mobile-optimized with desktop enhancements
Decorative Elements: Strategic use of 3D illustrations
Clean Spacing: Consistent spacing scale using Tailwind utilities
Interactive Ready: Prepared for animations and hover states
Productivity Theme: Visual language supports productivity messaging
