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

test("full", (t) => {
  let commit =
    ":bug: fix(chat): broadcast $destroy event on scope destruction (by @sigma-technology-ds)";
  let parsed = parser.sync(commit, options);
  t.is(parsed.emoji, "bug");
  t.is(parsed.type, "fix");
  t.is(parsed.scope, "chat");
  t.is(
    parsed.subject,
    "broadcast $destroy event on scope destruction (by @sigma-technology-ds)"
  );
});

test("abbreve emoji", (t) => {
  let commit =
    "fix(chat): broadcast $destroy event on scope destruction (by @sigma-technology-ds)";
  let parsed = parser.sync(commit, options);
  t.falsy(parsed.emoji);
  t.is(parsed.type, "fix");
  t.is(parsed.scope, "chat");
  t.is(
    parsed.subject,
    "broadcast $destroy event on scope destruction (by @sigma-technology-ds)"
  );
});

test("abbreve type", (t) => {
  let commit =
    ":bug: broadcast $destroy event on scope destruction (by @sigma-technology-ds)";
  let parsed = parser.sync(commit, options);
  t.is(parsed.emoji, "bug");
  t.falsy(parsed.type);
  t.falsy(parsed.scope);
  t.is(
    parsed.subject,
    "broadcast $destroy event on scope destruction (by @sigma-technology-ds)"
  );
});

test("abbreve scope", (t) => {
  let commit =
    ":bug: fix: broadcast $destroy event on scope destruction (by @sigma-technology-ds)";
  let parsed = parser.sync(commit, options);
  t.is(parsed.emoji, "bug");
  t.is(parsed.type, "fix");
  t.falsy(parsed.scope);
  t.is(
    parsed.subject,
    "broadcast $destroy event on scope destruction (by @sigma-technology-ds)"
  );
});

test("subject only", (t) => {
  let commit =
    "broadcast $destroy event on scope destruction (by @sigma-technology-ds)";
  let parsed = parser.sync(commit, options);
  t.falsy(parsed.emoji);
  t.falsy(parsed.type);
  t.falsy(parsed.scope);
  t.is(
    parsed.subject,
    "broadcast $destroy event on scope destruction (by @sigma-technology-ds)"
  );
});
