import { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

export function zoomExtension(fontSize: number): Extension {
  return EditorView.theme({
    ".cm-content": {
      fontSize: `${fontSize}px`
    }
  });
}
