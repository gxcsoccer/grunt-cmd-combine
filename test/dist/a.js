seajs.config({
    base: ".",
    alias: {
        c: "c/c"
    },
    paths: {
        d: "c/d"
    },
    charset: "utf-8"
})
define("test/src/a", [ "./b" ], function(require, exports, module) {
    "use strict";
    var b = require("./b");
    console.log("Here is Module a.js");
});
define("test/src/b", [], function(require, exports, module) {
    "use strict";
    console.log("Here is Module b.js");
});
