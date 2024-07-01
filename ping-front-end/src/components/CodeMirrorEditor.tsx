import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { EditorState, Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, lineNumbers } from "@codemirror/view";
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

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const languageExtension: Extension =
        language === "java"
          ? java()
          : language === "python"
          ? python()
          : java();

      const startState = EditorState.create({
        doc: initialValue,
        extensions: [
          languageExtension,
          oneDark,
          lineNumbers(),
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
  }, [language, onChange, zoomPercentage, initialValue]);

  useEffect(() => {
    if (viewRef.current) {
      const state = viewRef.current.state;
      const currentValue = state.doc.toString();

      if (currentValue !== initialValue) {
        const transaction = state.update({
          changes: { from: 0, to: currentValue.length, insert: initialValue },
        });
        viewRef.current.dispatch(transaction);
      }
    }
  }, [initialValue]);

  // Apply font family changes
  useEffect(() => {
    if (viewRef.current) {
      const contentElement = viewRef.current.dom.querySelector('.cm-content') as HTMLElement;
      if (contentElement) {
        contentElement.style.fontFamily = fontFamily;
      }
    }
  }, [fontFamily]);

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
