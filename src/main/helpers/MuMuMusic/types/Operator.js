"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPERATOR_TYPES = void 0;
const AtomState_1 = require("./AtomState");
// ref to color palette: https://colorhunt.co/
exports.OPERATOR_TYPES = {
    STIR: {
        description: "vanilla & vanilla = hazelnut",
        symbol: "&",
        name: "Stir ",
        color: "#A7D2CB",
        input_atom_types: [AtomState_1.AtomType.VANILLA, AtomState_1.AtomType.VANILLA],
        output_atom_types: [AtomState_1.AtomType.HAZELNUT],
    },
    SHAKE: {
        description: "hazelnut % hazelnut = chocolate",
        symbol: "%",
        name: "Shake",
        color: "#F2D388",
        input_atom_types: [AtomState_1.AtomType.HAZELNUT, AtomState_1.AtomType.HAZELNUT],
        output_atom_types: [AtomState_1.AtomType.CHOCOLATE],
    },
    STEAM: {
        description: "hazelnut ~ chocolate ~ chocolate  = truffle, vanilla",
        symbol: "^",
        name: "Steam",
        color: "#C98474",
        input_atom_types: [
            AtomState_1.AtomType.HAZELNUT,
            AtomState_1.AtomType.CHOCOLATE,
            AtomState_1.AtomType.CHOCOLATE,
        ],
        output_atom_types: [AtomState_1.AtomType.TRUFFLE, AtomState_1.AtomType.VANILLA],
    },
    SMASH: {
        description: "truffle = vanilla, vanilla, vanilla, vanilla, saffron",
        symbol: "#",
        name: "Smash",
        color: "#874C62",
        input_atom_types: [AtomState_1.AtomType.TRUFFLE],
        output_atom_types: [
            AtomState_1.AtomType.VANILLA,
            AtomState_1.AtomType.VANILLA,
            AtomState_1.AtomType.VANILLA,
            AtomState_1.AtomType.VANILLA,
            AtomState_1.AtomType.SAFFRON,
        ],
    },
};
