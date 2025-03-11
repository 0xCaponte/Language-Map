# Changelog

All notable changes to the Language Map project will be documented in this file.

## Version 0.2 (2025)

### Features
- New dedicated language-specific page routing with `/{lang}` URLs. Ex: /english
- Fixed issues with input formatting and search suggestions
- Added unit tests for helpers and models integrated into Cloudflare CI
- Added support for multi-word languages. Ex: Swiss german

### Code Improvements
- Removed code redundancies
- Added test coverage for helpers and models

### Bug Fixes
- Fixed problems with input formatting and suggestions
- Resolved issues with the language API that were affecting pre-rendering of the language sites

## Version 0.1 (2024)

### Features
- Twitter/X share functionality for language statistics
- Interactive 3D globe map for smaller displays
- Flat map for larger displays
- Search suggestions with keyboard and click selection
- Language statistics with speakers count and percentage
- Emoji flag support for countries

### UI/UX Improvements
- Added icon to indicate globe rotation functionality
- Improved language bar input validation and error display
- Enhanced map navigation with drag functionality
- Fixed UI for various screen sizes with responsive design
- Added informative headline to the main page
- Changed color scheme with dark gray instead of black

### Code and Performance
- Added meta tags and Open Graph data for social sharing
- Improved map padding and visual elements
- Fixed issues with touch input on mobile devices
- Added session ID for anonymous analytics (currently not used at all due to Cloudflareworkers)
- Updated dependencies and build process for Cloudflare Pages