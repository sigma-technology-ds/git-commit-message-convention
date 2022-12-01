import test from "ava";
import parser from "conventional-commits-parser";
import {
  REGEX_HEADER_PATTERN,
  REGEX_HEADER_CORRESPONDENCE,
  REGEX_NOTE_KEYWORDS,
} from "../src/index.js";

const options = {
  headerPattern: REGEX_HEADER_PATTERN,
  headerCorrespondence: REGEX_HEADER_CORRESPONDENCE,
  noteKeywords: REGEX_NOTE_KEYWORDS,
};

test("basic", (t) => {
  let commit =
    ":bug: fix(chat): broadcast $destroy event on scope destruction (by @sigma-technology-ds)\n" +
    "\n" +
    "this is the body\n" +
    "\n" +
    "NOTE:\n" +
    "this is the note\n" +
    "\n" +
    "Closes #1";
  let parsed = parser.sync(commit, options);
  t.is(parsed.footer, "NOTE:\nthis is the note\n\nCloses #1");
});

test("notes: note", (t) => {
  let commit =
    ":bug: fix(chat): broadcast $destroy event on scope destruction (by @sigma-technology-ds)\n" +
    "\n" +
    "NOTE:\n" +
    "this is note ...";
  let parsed = parser.sync(commit, options);
  t.deepEqual(parsed.notes, [{ title: "NOTE", text: "this is note ..." }]);
});

test("notes: undefined note", (t) => {
  let commit =
    ":bug: fix(chat): broadcast $destroy event on scope destruction (by @sigma-technology-ds)\n" +
    "\n" +
    "TODO:\n" +
    "this is note ...";
  let parsed = parser.sync(commit, options);
  t.deepEqual(parsed.notes, []);
});
