"use strict";
const abcss = `h1=color(red) font-size(20px)
body=width&height(100%)
.box=width&height(100%) background(red) margin(10px)
`;

class Parser {
  constructor() {
    this.memory = [];
    this.expecting = "selector";
    this.cur = { line: 0, col: 0 };
    this.tokens = {
      selector: {
        value: /[^&=\(\)]/g,
        expecting: "assignment",
        multi: true,
      },
      assignment: {
        value: "=",
        expecting: "property",
      },
      property: {
        value: /([a-z]|[A-Z]|\-)/g,
        expecting: ["and", "separator", "valueBegin"],
        multi: true,
      },
      separator: {
        value: "&",
        expecting: "property",
      },
      valueBegin: {
        value: "(",
        expecting: "value",
      },
      value: {
        value: /[^\)]/g,
        expecting: "valueEnd",
        multi: true,
      },
      valueEnd: {
        value: ")",
        expecting: ["separator", "statementEnd"],
      },
      statementEnd: {
        value: /\n|;/g,
        expecting: "selector",
      },
    };
    return this;
  }

  parse(str) {
    let result = "";
    let curMulti = ''
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "\n") this.cur.line++;
      this.cur.col++;

      let expecting = this.tokens[this.expecting];
      if (!str[i].match(expecting.value))
        throw new Error(
          `Unexpected token "${str[i]}". Was expecting ${this.expecting}. (Line ${this.cur.line} Col ${this.cur.col})`
        );

      // Case study: Current char is "s". 
      // Expecting is "selector".
      // Memory is [].
      // S is a valid selector char, and selector is multi, so add 
      // char to multi and continue, expecting selector.

      if (expecting.multi === true) {
        curMulti += str[i];
        console.log('Continuing selector string at '+curMulti+'.')
        this.memory.unshift(expecting);
      } else if (str[i] !== expecting) {
          this.expecting = expecting.expecting;
      }
      console.log(this)
      continue;
    }
  }

  situations = {};
}

var parser = new Parser();
var properties = parser.parse(abcss);
console.log(properties);
