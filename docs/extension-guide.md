# Extension Guide

This guide defines the Phase 1 extension posture for OCRS.

## 1. Core rule

The generic OCRS core must remain stable and implementation-neutral. Official ICxA profile extensions must preserve the authority model and may add profile-specific semantics that are versioned and explicitly linked to the governing ICxA source.

## 2. Extension namespaces

Future extensions may use explicit namespaces such as:

- ocrs:core
- ocrs:profile:icxa
- ocrs:extension:<project-or-organization>

The exact URI architecture shall be documented in a future versioned profile definition. This Phase 1 repository does not hard-code a specific URI implementation because that would prematurely constrain future extension design.

## 3. Temporary rule for v0.1

Project-specific extensions may be represented conceptually but not materially defined as normative schema features in Phase 1.

## 4. Compatibility guardrail

Any extension that changes the meaning of an official ICxA-aligned field or changes the authority boundary must be treated as a profile change, not a core extension, and must be issued under a new profile version.
