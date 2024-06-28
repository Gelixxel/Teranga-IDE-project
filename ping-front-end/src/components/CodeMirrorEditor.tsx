import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { EditorState, Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, lineNumbers } from "@codemirror/view";
import React, { useEffect, useRef } from "react";
import "./CodeMirrorEditor.css";

interface CodeMirrorEditorProps {
  initialValue: string;
  language: "python" | "java";
  onChange: (value: string) => void;
}

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({
  initialValue,
  language,
  onChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

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
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
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
  }, [language, onChange]);

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

  return <div ref={editorRef} />;
};

export default CodeMirrorEditor;
