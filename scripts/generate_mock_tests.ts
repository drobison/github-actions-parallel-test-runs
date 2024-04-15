import { writeFileSync } from "fs";
import { Test } from "./interfaces/Test";

// Helper class that generates a json file to mock the test selection service
// Output tests.json

let tests: Test[] = [];

for (let i = 1; i <= 100; i++) {
  let test: Test = {
    test: `e2e_test${i}.test.ts`,
    duration: Math.floor(Math.random() * 10) + 1, // Random number between 1 and 10
  };

  tests.push(test);
}

let json = JSON.stringify(tests, null, 2);

try {
  writeFileSync("tests.json", json, "utf8");
  console.log("JSON file has been saved.");
} catch (err) {
  console.log("An error occurred while writing JSON Object to File.");
  console.error(err);
}
