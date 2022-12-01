import test from "ava";
import parser from "conventional-commits-parser";
import {
  REGEX_HEADER_PATTERN,
  REGEX_HEADER_CORRESPONDENCE,
} from "../src/index.js";

const options = {
  headerPattern: REGEX_HEADER_PATTERN,
  headerCorrespondence: REGEX_HEADER_CORRESPONDENCE,
};

test("basic", (t) => {
  let commit =
    ":bug: fix(chat): broadcast $destroy event on scope destruction (by @sigma-technology-ds)\n" +
    "\n" +
    "this is the body";
  let parsed = parser.sync(commit, options);
  t.is(parsed.body, "this is the body");
});

test("nothing", (t) => {
  let commit =
    ":bug: fix(chat): broadcast $destroy event on scope destruction (by @sigma-technology-ds)";
  let parsed = parser.sync(commit, options);
  t.falsy(parsed.body);
});

test("with footer", (t) => {
  let commit =
    ":bug: fix(chat): broadcast $destroy event on scope destruction (by @sigma-technology-ds)\n" +
    "\n" +
    "this is the body" +
    "\n" +
    "BREAKING CHANGE:" +
    "this is breaking change";
  let parsed = parser.sync(commit, options);
  t.is(parsed.body, "this is the body");
});
