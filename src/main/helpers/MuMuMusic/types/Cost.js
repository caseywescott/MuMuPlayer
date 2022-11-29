"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DYNAMIC_COSTS = exports.STATIC_COSTS = void 0;
exports.STATIC_COSTS = {
    STIR: 250,
    SHAKE: 500,
    STEAM: 750,
    SMASH: 1000,
    SINGLETON: 150
};
exports.DYNAMIC_COSTS = {
    SINGLETON_MOVE_EMPTY: 10,
    SINGLETON_MOVE_CARRY: 20,
    SINGLETON_GET: 25,
    SINGLETON_PUT: 25,
    SINGLETON_BLOCKED: 3,
};
