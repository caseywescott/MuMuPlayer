"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitText = exports.BorderStatus = exports.BgStatus = void 0;
var BgStatus;
(function (BgStatus) {
    BgStatus["EMPTY"] = "empty";
    BgStatus["ATOM_VANILLA_FREE"] = "vanilla_free";
    BgStatus["ATOM_VANILLA_POSSESSED"] = "vanilla_possessed";
    BgStatus["ATOM_HAZELNUT_FREE"] = "hazelnut_free";
    BgStatus["ATOM_HAZELNUT_POSSESSED"] = "hazelnut_possessed";
    BgStatus["ATOM_CHOCOLATE_FREE"] = "chocolate_free";
    BgStatus["ATOM_CHOCOLATE_POSSESSED"] = "chocolate_possessed";
    BgStatus["ATOM_TRUFFLE_FREE"] = "truffle_free";
    BgStatus["ATOM_TRUFFLE_POSSESSED"] = "truffle_possessed";
    BgStatus["ATOM_SAFFRON_FREE"] = "saffron_free";
    BgStatus["ATOM_SAFFRON_POSSESSED"] = "saffron_possessed";
})(BgStatus = exports.BgStatus || (exports.BgStatus = {}));
var BorderStatus;
(function (BorderStatus) {
    BorderStatus["EMPTY"] = "empty";
    BorderStatus["SINGLETON_OPEN"] = "singleton_open";
    BorderStatus["SINGLETON_CLOSE"] = "singleton_close";
})(BorderStatus = exports.BorderStatus || (exports.BorderStatus = {}));
var UnitText;
(function (UnitText) {
    UnitText["EMPTY"] = "";
    UnitText["GRID"] = "\u00B7";
    UnitText["FAUCET"] = "F";
    UnitText["SINK"] = "S";
    UnitText["OPERAND_STIR"] = "&";
    UnitText["OPERAND_SHAKE"] = "%";
    UnitText["OUTPUT"] = "=";
})(UnitText = exports.UnitText || (exports.UnitText = {}));
