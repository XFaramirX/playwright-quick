---
description: Generate an implementation plan for new features or refactoring existing code.
tools: ['edit/createFile', 'edit/createDirectory', 'search/fileSearch', 'search/textSearch', 'search/listDirectory', 'search/readFile', 'playwright-test/browser_click', 'playwright-test/browser_close', 'playwright-test/browser_console_messages', 'playwright-test/browser_drag', 'playwright-test/browser_evaluate', 'playwright-test/browser_file_upload', 'playwright-test/browser_handle_dialog', 'playwright-test/browser_hover', 'playwright-test/browser_navigate', 'playwright-test/browser_navigate_back', 'playwright-test/browser_network_requests', 'playwright-test/browser_press_key', 'playwright-test/browser_select_option', 'playwright-test/browser_snapshot', 'playwright-test/browser_take_screenshot', 'playwright-test/browser_type', 'playwright-test/browser_wait_for', 'playwright-test/planner_setup_page','context7/*'
---

# Planning mode instructions

Codebase Cleanup and Refactoring Plan

Overview

This plan outlines a comprehensive initiative to clean up and refactor the entire codebase with the primary goal of improving maintainability, readability, performance, and adherence to modern best practices. This project will systematically reduce technical debt, standardize code style, eliminate dead code, and ensure a robust foundation for future development.

Requirements

The cleanup and refactoring process must meet the following criteria:

    Code Consistency: Establish and enforce a consistent code style (naming conventions, formatting, indentation) across all files using automated tools (linter/formatter).

    Dead Code Elimination: Identify and safely remove all unused files, functions, variables, and dependencies.

    Dependency Modernization: Audit all external dependencies, updating them to the latest stable, secure versions or removing obsolete ones.

    Architectural Clarity: Refactor large, complex modules/classes into smaller, single-responsibility units (Single Responsibility Principle - SRP).

    Performance Preservation: Ensure that all refactoring efforts result in equivalent or improved application performance; performance regressions are unacceptable.

    Full Test Coverage: Maintain existing test coverage, and add new unit tests for any significantly refactored or previously uncovered critical logic.

    Documentation Update: Update or add docstrings/comments to clarify the purpose and usage of refactored public APIs (functions, classes).

Implementation Steps

The plan is divided into four distinct phases, prioritizing setup and foundational cleanup before undertaking deep structural changes.

Phase 1: Preparation and Standardization ⚙️

    Dedicated Branch: Create a long-lived feature branch (e.g., refactor/full-cleanup) for all changes.

    Tooling Setup: Integrate and configure a linter (e.g., ESLint, RuboCop) and a formatter (e.g., Prettier, Black) with a strict, agreed-upon configuration.

    Initial Formatting Pass: Run the automated formatter across the entire codebase to establish a consistent baseline style. Commit this as a large, separate change.

    Dependency Audit: Generate a dependency list, check for known vulnerabilities, and update all major and minor dependencies to their latest stable versions. Remove explicitly unused packages.

Phase 2: Cleanup and Dead Code Elimination 🗑️

    Unused Code Identification: Use static analysis tools and IDE features (usages tool can be helpful here) to find and remove all dead code (unused imports, variables, helper functions, and files).

    Comment & Documentation Review: Remove outdated, misleading, or excessively noisy comments. Update internal documentation to reflect the codebase's current state.

    Configuration Cleanup: Review and simplify configuration files (e.g., build scripts, environment variables, tool configurations) by removing redundant or commented-out settings.

Phase 3: Structural Refactoring and Modernization 🏗️

    Component/Module Decomposition: Identify "God Objects" (classes/modules with too many responsibilities). Break them down into smaller, focused modules, adhering to the SRP.

    Interface Simplification: Review and simplify complex public function signatures, reducing the number of arguments where possible by grouping related inputs into simple objects.

    Code Modernization: Refactor legacy language constructs to use modern equivalents (e.g., replacing old looping structures with map/filter/reduce, converting callback hell to async/await).

    Error Handling Review: Standardize and centralize error handling logic (e.g., consistent use of custom error classes, uniform logging of exceptions).

Phase 4: Verification and Finalization ✅

    Full Test Suite Execution: Run the entire existing unit, integration, and E2E test suite to check for regressions.

    New Test Coverage: Write new unit tests for any critical functions or modules whose logic was fundamentally changed or simplified and lacked sufficient coverage.

    Manual QA and Review: Perform targeted manual testing on core application flows. Conduct a final, thorough peer review of the refactored code.

    Merge: Merge the cleanup branch into the main branch once all tests pass and reviewers sign off.

Testing

A rigorous testing strategy is crucial to ensure the refactoring improves quality without introducing bugs.

    Unit Tests:

        Pre-requisite: All existing unit tests must pass on the refactor branch.

        New Tests: Implement targeted unit tests for every function or class that was significantly simplified or whose internal logic was restructured to ensure the input/output contract remains valid.

    Integration Tests:

        Focus: Verify that refactored modules interact correctly, particularly concerning data flow and state management. Special attention to areas involving external services (APIs, databases).

    End-to-End (E2E) Regression Tests:

        Requirement: Execute the full E2E suite to confirm that all critical user workflows (e.g., login, checkout, data submission) function identically to the pre-refactoring state.

    Performance and Memory Benchmarks:

        Validation: Run profiling tools on key application pages/API endpoints. Compare metrics (load time, response time, memory usage) against the main branch to validate that no performance regressions occurred.

    Automated Style/Lint Checks:

        Continuous Integration (CI): Integrate the linter and formatter into the CI pipeline to fail builds if any new code violates the established style standards.
