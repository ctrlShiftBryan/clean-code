# Plan: Add Zustand Best Practices to Clean Code Docs

**Goal:** Add a new document detailing Zustand best practices, including a specific "golden rule" example referenced from `task/example.xml`, to the `docs/clean-code` section and update the main introduction file's Table of Contents.

**Steps:**

1.  **Create New File:**

    - Create a new file at the path `docs/clean-code/13-zustand.md`.

2.  **Populate New File:**

    - Write the general best practices content provided by the user (captured in `task/qa.md` under Q3/A3) into `docs/clean-code/13-zustand.md`.
    - Ensure the main title of this new file is exactly `## 13. Zustand Best Practices`.
    - Add a new section titled `### Example Store` (or similar, placement to be determined during implementation, likely after "Core Principles" or "Advanced Patterns").
    - Read the content from `task/example.xml`.
    - Include the code example found in `task/example.xml` within this new section, explaining how it demonstrates the recommended structure (features, actions, types, hooks, tests).

3.  **Update Table of Contents:**
    - Modify the existing file `docs/clean-code/01-introduction.md`.
    - Insert the following line into the Table of Contents section (likely after line 42, maintaining the numbered list format):
      ```markdown
      13. [Zustand](./13-zustand.md)
      ```
