/** The type_of module tests. */
import { assertEquals } from "./test_deps.ts";
import { duck_tape } from "../mod.ts";

/** Set some terminal color. */
const BG_BLUE = "\x1b[44m";
const FG_WHITE = "\x1b[37m";
const TITLE = BG_BLUE + FG_WHITE;
const RESET = "\x1b[0m";

/** Start the tests ----------------------------------------------------------- */

Deno.test(`\n${TITLE} Testing duck_tape param ${RESET}`, () => {

  const func = function(name: string) {

    const name_type = duck_tape(1, name, ['string'], func, ['NOT-STRING-EMPTY']);

  };

  try {

    func('');

  } catch (err) {

    assertEquals(err.name, 'DuckTapeRuleError');
    assertEquals(err.rule, 'NOT-STRING-EMPTY');
    //console.log(err);

  }

  //var x;
  //console.log(`type_of( undefined ) === "${type_of(undefined)}"`);
  //assertEquals(name, "undefined");

});

