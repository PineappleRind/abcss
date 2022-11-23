"use strict";
const abcss = `h1=color(red) font-size(20px)
body=width&height(100%)
.box=width&height(100%) background(red) margin(10px)
`;

class Parser {
  constructor() {
    this.memory = [];
    this.current = "";
    this.expecting = new Set(["selector"]);
    this.cur = { line: 0, col: 0 };
    this.tokens = {
      selector: {
        value: /[^&=\(\)]/g,
        expecting: ["selector", "assignment"],
      },
      assignment: {
        value: "=",
        expecting: "property",
      },
      property: {
        value: /([a-z]|[A-Z]|\-)/g,
        expecting: ["property", "and", "separator", "valueBegin"],
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
    let curMulti = "";
    for (let i = 0; i < str.length; i++) {
      if (this.cur.col > 10) return;
      if (str[i] === "\n") this.cur.line++;
      this.cur.col++;
      console.log(str[i]);

      this.expecting.forEach((o,val) => {
        if (str[i].match(this.tokens[val].value)) {
          // if the current char matches with the current value in set
          this.expecting.clear();
          if (this.memory[0] === val) curMulti += str[i];
          // now expect what the current token expects
          this.expecting.add(...this.tokens[val].expecting);
          this.memory.unshift(val);
        }
        console.log(val);
      });

      throw new Error(
        `Unexpected token "${str[i]}". Was expecting ${Array.from(
          this.expecting.keys()
        ).join(", ")}. (Line ${this.cur.line} Col ${this.cur.col})`
      );
    }
  }

  situations = {};
}

var parser = new Parser();

console.log(parser.parse(abcss));
