"use strict";

export default class Parser {
  constructor() {
    this.expecting = new Set(["selector", "assignment"]);
    this.cur = {
      line: 0,
      col: 0,
    };
    this.tokens = {
      statementEnd: {
        value: /\n|;/g,
        expecting: "selector",
        translation: "} ",
      },
      selector: {
        value: /[^&=\(\)]/g,
        expecting: ["selector", "assignment"],
        multi: true,
      },
      assignment: {
        value: "=",
        expecting: "property",
        translation: " { ",
      },
      property: {
        value: /([a-z]|[A-Z]|\-)/g,
        expecting: ["property", "separator", "valueBegin"],
        multi: true,
      },
      separator: {
        value: "&",
        expecting: "property",
        translation: this.separatorHandler,
      },
      valueBegin: {
        value: "\\(",
        expecting: "value",
        translation: ": ",
      },
      value: {
        value: /[^\(\)\n]/g,
        expecting: ["valueEnd", "value"],
        multi: true,
      },
      valueEnd: {
        value: "\\)",
        expecting: ["property", "value", "statementEnd"],
        translation: "; ",
      },
    };
    return this;
  }
  parse(str) {
    str = str.replaceAll(" ", "");
    let result = "";
    let curMulti = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "\n") this.cur.line++;
      this.cur.col++;
      let foundMatch = false;
      Array.from(this.expecting).every(val => {
        let candidate = this.tokens[val];
        // if the current char doens't match with the current value in set
        if (!str[i].match(candidate.value)) return true;

        // if it does
        this.expecting.clear();
        // if it's a multi-string (e.g. property, value, selector)
        if (candidate.multi) curMulti += str[i];
        else {
          result += curMulti + (candidate.translation || "");
          curMulti = "";
        }
        // now expect what the current token expects
        if (candidate.expecting instanceof Array)
          candidate.expecting.forEach((item) => this.expecting.add(item));
        else this.expecting.add(candidate.expecting);
        return !(foundMatch = true);
      });

      if (!foundMatch)
        throw new SyntaxError(
          `Unexpected token "${str[i]}". Was expecting ${Array.from(
            this.expecting.keys()
          ).join(", ")}. (Line ${this.cur.line} Col ${this.cur.col})`
        );
    }
    return result;
  }
}
