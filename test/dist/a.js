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
define("a", [ "./b" ], function(require, exports, module) {
    "use strict";
    require("css/a.css");
    var b = require("./b");
    console.log("Here is Module a.js");
});
define("b", [ "c" ], function(require, exports, module) {
    "use strict";
    require("css/b.css");
    var c = require("c");
    console.log("Here is Module b.js");
});
define("c/c", [ "./d/d" ], function(require, exports, module) {
    "use strict";
    var d = require("./d/d");
    console.log("Here is Module c.js");
});
define("c/d/d", [], function(require, exports, module) {
    "use strict";
    console.log("Here is Module d.js");
});
