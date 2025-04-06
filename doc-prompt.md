**Documentation Generation Prompt**

Create comprehensive documentation for [SUBJECT]. Each topic should have its own numbered markdown file.

**File Structure:**

- Place all files in: /docs/[subject-name]/ folder
- Name each file with its number and topic: `1.intro.md`, `2.installation.md`, etc.

**Formatting:**
Use a multi-level outline style with the following pattern:

- **Level 1:** Number (e.g., `1.`) matching the file number
- **Level 2:** Capital letter (e.g., `A.`)

Each section should follow this format:

```
1. A. [Section Title]

Content for this section...

1. B. [Subsection Title]

Content for this subsection...
```

**First Page Requirements:**

- Create a main introduction page (1.intro.md)
- Include today's date
- Provide a brief explanation of [SUBJECT]
- Include a table of contents with links to all other pages
- Format the TOC as a numbered list with proper links to the numbered files

**Content Guidelines:**

- Each page should focus on one specific aspect of [SUBJECT]
- Include relevant code examples using appropriate syntax highlighting (`jsx, `bash, etc.)
- Explain concepts thoroughly but concisely
- Use short paragraphs for readability
- Include practical examples where appropriate
- Format code with proper indentation and comments

**Required Pages:**

1. Introduction and TOC
2. Installation/Setup
3. Core Concepts
4. [Additional pages specific to the subject]
   [Last page should be a migration guide if applicable]

**Code Examples:**

- Ensure all code examples are complete and functional
- Include import statements when necessary
- Highlight key parts with meaningful comments
- Show both basic and advanced usage

**Naming Convention:**

- Use kebab-case for folder names: `/docs/subject-name/`
- Use numbered filenames with dots: `1.intro.md`, `2.setup.md`
- Keep filenames lowercase and concise

Please make the documentation comprehensive enough LLM agent users of [SUBJECT].
