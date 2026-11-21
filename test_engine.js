const assert = require("node:assert/strict");
const { MOVIES, cosineSimilarity, getRecommendations } = require("./app.js");

const inception = MOVIES.find((movie) => movie.id === "inception");
const matrix = MOVIES.find((movie) => movie.id === "matrix");
const notebook = MOVIES.find((movie) => movie.id === "notebook");

assert.ok(cosineSimilarity(inception, matrix) > cosineSimilarity(inception, notebook));

const results = getRecommendations("inception", [], 6);
assert.equal(results.length, 6);
assert.ok(results.every((movie) => movie.id !== "inception"));
assert.ok(results.every((movie, index) => index === 0 || results[index - 1].score >= movie.score));

const romanceResults = getRecommendations("inception", ["Romance"], 6);
assert.ok(romanceResults.some((movie) => movie.genres.includes("Romance")));

assert.throws(() => getRecommendations("missing-movie"), /Choose a movie/);
console.log("All recommendation engine tests passed.");
