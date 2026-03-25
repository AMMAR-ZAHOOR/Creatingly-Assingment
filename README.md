Draw.IO

Overview

This repository contains a Cypress-based automation framework for validating canvas and SVG interactions on diagrams.net.
The framework is designed to handle complex UI behaviors such as drag-and-drop, resizing, connections, keyboard actions, and toolbar interactions using real user-like events.

# Application URL:
https://app.diagrams.net/

# Automation Scope

- Canvas-based UI automation
- SVG and mxGraph element handling
- Keyboard shortcuts and toolbar actions
- State validation using DOM and coordinate assertions
- Reusable and maintainable test architecture

# Tech Stack
- Framework: Cypress
- Language: JavaScript
- UI Type: SVG / Canvas (mxGraph)
- Testing Type: End-to-End Automation

# Pattern Used:
- Custom Cypress Commands
- Centralized Locator Management

# Project Structure

cypress/
├── e2e/
│   └── shape.cy.js
│
├── support/
│   ├── sections/
│   │   └── diagrams.js
│   │
│   ├── locators/
│   │   └── diagramLocators.js
│   │
│   └── commands.js
│
└── fixtures/

# Key Features

- Supports SVG drag, resize, and connect actions
- Keyboard shortcut automation (Ctrl + Z, Ctrl + Y, Ctrl + A, Backspace)
- Context menu and toolbar interaction support
- Modular and reusable command structure
- Easy locator updates via centralized files

# Setup & Installation

# Install Dependencies
- npm install

# Open Cypress Test Runner
- npx cypress open

# Run Tests Headlessly
- npx cypress run
