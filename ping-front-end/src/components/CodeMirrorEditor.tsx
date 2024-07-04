import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { EditorState, Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, lineNumbers, keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete"; // Import autocompletion
import React, { useEffect, useRef, useState } from "react";
import "./CodeMirrorEditor.css";
import { zoomExtension } from "./zoomExtension"; // Import the zoom extension

interface CodeMirrorEditorProps {
  initialValue: string;
  language: "python" | "java";
  onChange: (value: string) => void;
  fontFamily: string;
}

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({
  initialValue,
  language,
  onChange,
  fontFamily,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [zoomPercentage, setZoomPercentage] = useState(100);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Initialize the EditorView once
  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const languageExtension: Extension = language === "java" ? java() : python();

      const startState = EditorState.create({
        doc: initialValue,
        extensions: [
          languageExtension,
          oneDark,
          lineNumbers(),
          keymap.of([
            ...defaultKeymap,
            indentWithTab, // Enable tab for indentation
            {
              key: "Tab",
              run: (view) => {
                const transaction = view.state.update({
                  changes: {
                    from: view.state.selection.main.from,
                    insert: "\t",
                  },
                  selection: {
                    anchor: view.state.selection.main.from + 1,
                  },
                });
                view.dispatch(transaction);
                return true;
              },
            },
          ]), // Add default keymap
          autocompletion(), // Enable autocompletion
          zoomExtension(24 * (zoomPercentage / 100)), // Apply the zoom extension
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
            }
            if (update.selectionSet) {
              const { main } = update.state.selection;
              const line = update.state.doc.lineAt(main.head).number;
              const column = main.head - update.state.doc.lineAt(main.head).from + 1;
              setCursorPosition({ line, column });
            }
          }),
          EditorView.theme({
            ".cm-content": {
              fontFamily: fontFamily,
            },
          }, { dark: true }),
        ],
      });

      viewRef.current = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      // Cleanup on unmount
      return () => {
        viewRef.current?.destroy();
        viewRef.current = null;
      };
    }
  }, [language, onChange, zoomPercentage, fontFamily]); // Initialize EditorView

  // Update the doc content without losing focus
  useEffect(() => {
    if (viewRef.current && initialValue !== viewRef.current.state.doc.toString()) {
      const transaction = viewRef.current.state.update({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: initialValue },
      });
      viewRef.current.dispatch(transaction);
    }
  }, [initialValue]); // Update document content when initialValue changes

  // Handle font family changes
  useEffect(() => {
    if (viewRef.current) {
      const contentElement = viewRef.current.dom.querySelector('.cm-content') as HTMLElement;
      if (contentElement) {
        contentElement.style.fontFamily = fontFamily;
      }
    }
  }, [fontFamily]); // Update font family when fontFamily prop changes

  // Handle zoom changes
  useEffect(() => {
    if (viewRef.current) {
      const zoomFactor = 24 * (zoomPercentage / 100);
      viewRef.current.dom.style.fontSize = `${zoomFactor}px`;
    }
  }, [zoomPercentage]); // Update font size when zoomPercentage changes

  return (
    <div className="editor-wrapper">
      <div className="zoom-controls">
        <label htmlFor="zoom-percentage">Zoom: </label>
        <input
          type="number"
          id="zoom-percentage"
          value={zoomPercentage}
          onChange={(e) => setZoomPercentage(Number(e.target.value))}
          min="100"
          max="6000"
          step="10"
          className="zoom-input"
        />
        <span>%</span>
      </div>
      <div ref={editorRef} className="editor-container" />
      <div className="status-bar">
        Line: {cursorPosition.line}, Column: {cursorPosition.column}
      </div>
    </div>
  );
};

export default CodeMirrorEditor;
