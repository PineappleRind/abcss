npx rollup index.js -f iife -o editor.bundle.js -p @rollup/plugin-node-resolve
echo "minifying..."
uglifyjs -c -m -o codemirror.bundle.min.js -- ./editor.bundle.js