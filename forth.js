#!/usr/bin/env node
// LICENSE:
// Short Version: MIT-STYLE - free to use/modify/distribute
// Long Version: See LICENSE file for details

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var stack = [];
var words = {};
var COMPILING=0;
var newword = "";
var code = "";

rl.on('line', parse);

rl.on('close', function() {
  process.exit(0);
});

function parse(line) {
  var wordline = line.split(/\s/);
  var word;
  var w;
  var rop;
  var lop;
  var op1;
  var op2

  for (w = 0; w < wordline.length; w++) {
    word = wordline[w]; 

    if (COMPILING) {
      if (/\;/.test(word)) {
        words[newword] = code;
        COMPILING=0;
        code = "";
        newword = "";
      } else if (newword) {
        code = code + " " + word;
      } else {
        newword = word;
      }
    } else if (words[word]) {
      parse(words[word]);
    } else if (/\d+/.test(word)) {
      stack.push(parseInt(word));
    } else if (/\+/.test(word)) {
      op1 = stack.pop();
      op2 = stack.pop();
      stack.push(op1 + op2);
    } else if (/-/.test(word)) {
      op1 = stack.pop();
      op2 = stack.pop();
      stack.push(op2 - op1);
    } else if (/\*/.test(word)) {
      op1 = stack.pop();
      op2 = stack.pop();
      stack.push(op1 * op2);
    } else if (/\//.test(word)) {
      op1 = stack.pop();
      op2 = stack.pop();
      stack.push(op2 / op1);
    } else if (/\./.test(word)) {
      console.log(stack.pop());
    } else if (/\$/.test(word)) {
      console.log(stack);
    } else if (/DROP/i.test(word)) {
      stack.pop();
    } else if (/DUP/i.test(word)) {
      op1 = stack[stack.length - 1];
      stack.push(op1);
    } else if (/SWAP/i.test(word)) {
      op1 = stack.pop();
      op2 = stack.pop(); 
      stack.push(op1);
      stack.push(op2);
    } else if (/SEE/i.test(word)) {
      if (w < (wordline.length - 1)) {
        w++;
        if (wordline[w] in words) {
          console.log(": " + wordline[w], words[wordline[w]], " ;");
        } else {
          console.log("undefined word");
        }
      } else {
        console.log("unspecified word");
      }
    } else if (/\:/.test(word)) {
      COMPILING=1;
    } else if (/BYE/i.test(word)) {
      process.exit(0);
    }

  }  
}


