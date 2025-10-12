import {useState, useRef, useEffect} from "react"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {oneDark, oneLight} from "react-syntax-highlighter/dist/esm/styles/prism"
import {useDarkMode} from "../flow-provider-wrapper"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  placeholder?: string
  className?: string
  minHeight?: string
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript", // Use javascript as fallback for Cadence since it's similar
  placeholder = "Enter your code here...",
  className = "",
  minHeight = "150px",
}: CodeEditorProps) {
  const {darkMode} = useDarkMode()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.max(150, textarea.scrollHeight) + "px"
    }
  }, [value])

  return (
    <div
      className={`relative rounded-lg overflow-hidden border ${
        isFocused
          ? "border-flow-primary"
          : darkMode
            ? "border-white/10"
            : "border-black/10"
        } ${className}`}
    >
      {/* Syntax highlighted background */}
      <div className="absolute inset-0 pointer-events-none">
        <SyntaxHighlighter
          language={language}
          style={darkMode ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            background: "transparent",
            overflow: "hidden",
            minHeight,
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            },
          }}
        >
          {value || " "}
        </SyntaxHighlighter>
      </div>

      {/* Editable textarea overlay */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`relative z-10 w-full px-4 py-3 font-mono text-sm bg-transparent border-none
          outline-none resize-none transition-all duration-200 ${
          darkMode
              ? "text-transparent caret-white placeholder-gray-600"
              : "text-transparent caret-black placeholder-gray-400"
          }`}
        style={{
          minHeight,
          caretColor: darkMode ? "white" : "black",
        }}
      />

      {/* Background for better contrast */}
      <div
        className={`absolute inset-0 -z-10 ${darkMode ? "bg-gray-900/50" : "bg-gray-50"}`}
      />
    </div>
  )
}
