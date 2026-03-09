# Site Management Guide

Manage content directly through GitHub.

## Adding Content

### 1. Blog Posts

1. Navigate to your GitHub repository -> `content/writing/`.
2. Select **Add file** -> **Create new file**.
3. Name the file with a `.mdx` extension (e.g., `new-post.mdx`).
4. Include this required frontmatter at the top:

    ```markdown
    ---
    title: "Post Title"
    ---

    Markdown content goes here.
    ```

### 2. Research Papers

1. **Upload PDF:** Navigate to `public/papers/` and upload the raw PDF.
2. **Create Entry:** Navigate to `content/papers/`, create a new `.mdx` file, and add the metadata:

    ```markdown
    ---
    title: "Paper Title"
    fileName: "exact-pdf-filename.pdf"
    authors: "Author Names"
    journal: "Journal Name"
    year: 2025
    abstract: "Paper abstract."
    ---
    
    Optional markdown content goes here.
    ```

## Automated Deployment

Deployment to GitHub Pages is automated. Committing changes to the `main` branch triggers the build process. Changes reflect on the live site within two minutes.

## AI Paper Parsing Workflow

The repository supports AI-assisted paper parsing.

1. Upload the PDF to `public/papers/`.
2. Instruct your AI agent: "Parse [filename.pdf] and add it to the website."

The AI will extract metadata, write an executive summary, generate Mermaid flowcharts, and commit the `.mdx` file. 

*Reference `berkeley-cloud-computing.mdx` for the expected output structure.*
