import { CodeBlockLowlight as TiptapCodeBlockLowlight } from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"

export const CodeBlockLowlight = TiptapCodeBlockLowlight.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      lowlight: createLowlight(common),
      defaultLanguage: null,
      HTMLAttributes: {
        class: "block-node",
      },
      languageClassPrefix: 'language-',
      exitOnTripleEnter: true,
      exitOnArrowDown: true,
      enableTabIndentation: false,
      tabSize: 4,
    }
  },
})

export default CodeBlockLowlight
