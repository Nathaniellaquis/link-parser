# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2024-06-25

### Added
- Embed data functionality for supported platforms
  - YouTube, Instagram, Twitter, TikTok, Spotify, SoundCloud
  - Returns `embedData` field with platform, type, contentId, and embedUrl
  - Detects already embedded URLs
- Comprehensive test coverage for embed functionality
- Documentation for embed feature in README

### Changed
- Parser now automatically extracts embed information when available
- Enhanced parser logic to populate embedData field

## [0.1.0] - 2024-06-25

### Added
- Initial release with support for 97 platforms
- Core parsing functionality with `parse()` function
- Platform detection and URL normalization
- Username/handle validation for each platform
- URL building utilities
- TypeScript support with full type definitions
- Comprehensive test suite with 80%+ coverage
- Support for the following platform categories:
  - Social Media (26 platforms)
  - Video & Streaming (10 platforms)
  - Music & Audio (11 platforms)
  - E-commerce & Marketplace (12 platforms)
  - Developer & Tech (3 platforms)
  - Creative & Portfolio (4 platforms)
  - Payment & Support (8 platforms)
  - Crypto & NFT (5 platforms)
  - Entertainment & Events (6 platforms)
  - Professional & Productivity (4 platforms)
  - Other (4 platforms)

[0.1.0]: https://github.com/Nathaniellaquis/link-parser/releases/tag/v0.1.0 