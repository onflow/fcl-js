import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {oneDark, oneLight} from "react-syntax-highlighter/dist/esm/styles/prism"
import {useDarkMode} from "../flow-provider-wrapper"

interface InlineCodeProps {
  code: string
  language?: string
  className?: string
}

export function InlineCode({
  code,
  language = "bash",
  className = "",
}: InlineCodeProps) {
  const {darkMode} = useDarkMode()

  return (
    <div className={`rounded-lg ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={darkMode ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          background: darkMode ? "rgba(17, 24, 39, 0.5)" : "rgb(249, 250, 251)",
          border: darkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.05)",
        }}
        codeTagProps={{
          style: {
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
