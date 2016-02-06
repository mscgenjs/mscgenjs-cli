"use strict";

module.exports = (
    () => ({
        cloneDeep : pObject => JSON.parse(JSON.stringify(pObject))
    })
)();
