import { Extension } from "@tiptap/react"
import { Plugin, PluginKey } from "@tiptap/pm/state"

/**
 * Simple heuristic to check if text looks like Markdown.
 * Based on the official tiptap documentation.
 */
function looksLikeMarkdown(text: string): boolean {
  return (
    /^#{1,6}\s/.test(text) || // Headings
    /\*\*[^*]+\*\*/.test(text) || // Bold
    /\*[^*]+\*/.test(text) || // Italic
    /\[.+\]\(.+\)/.test(text) || // Links
    /^[-*+]\s/.test(text) || // Unordered lists
    /^\d+\.\s/.test(text) || // Ordered lists
    /^>\s/.test(text) || // Blockquotes
    /`[^`]+`/.test(text) || // Inline code
    /^```/.test(text) // Code blocks
  )
}

/**
 * Extension that handles pasting markdown content.
 * When pasted plain text looks like Markdown, it is parsed and inserted as rich content.
 */
export const MarkdownPaste = Extension.create({
  name: "markdownPaste",

  addProseMirrorPlugins() {
    const { editor } = this

    return [
      new Plugin({
        key: new PluginKey("markdownPaste"),
        props: {
          handlePaste: (_view, event) => {

            const clipboardData = event.clipboardData
            if (!clipboardData) return false

            // If there's HTML content, let the default handler deal with it
            const html = clipboardData.getData("text/html")
            if (html) {
              return false
            }

            // Get plain text content
            const text = clipboardData.getData("text/plain")
            if (!text) return false

            // Check if the editor has markdown support
            if (!editor.markdown) {
              return false
            }

            // Check if text looks like Markdown
            if (!looksLikeMarkdown(text)) {
              return false
            }

            try {
              // Use insertContent with contentType: 'markdown' to let tiptap handle parsing and schema validation
              editor.commands.insertContent(text, { contentType: 'markdown' })

              // Only prevent default if insertion succeeded
              event.preventDefault()
              return true
            } catch (err) {
              // Fall back to default paste behavior
              return false
            }
          },
        },
      }),
    ]
  },
})

export default MarkdownPaste

