import {EditorView, basicSetup} from "codemirror"
import Parser from "../src/index.js";

const $ = document.querySelector.bind(document);

let editor = new EditorView({
  extensions: [basicSetup],
  parent: $("#editor")
})

$('.get-output').onclick = () => {
  let doc = editor.state.doc.toString();
  let css = new Parser().parse(doc);
  $('#output').innerHTML = css;
}