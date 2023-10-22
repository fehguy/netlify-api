"use strict";
const { respondTo } = require("swambda/src/utils");

var pets = [
    {
        id: 1,
        name: "lemur",
        tag: "wild"
    },
    {
        id: 2,
        name: "bison",
        tag: "wild"
    },
    {
        id: 3,
        name: "sloth",
        tag: "wild"
    }
];

exports.findAll = async (args) => {
    return respondTo(200, pets);
}

exports.addPet = async (args) => {
    console.log(args);
    const body = args.body;

    if(typeof body !== "undefined") {
        pets.push(body);

        return respondTo(201);
    }
    return respondTo(400, {
        code: 400,
        message: "invalid pet supplied"
    });
}