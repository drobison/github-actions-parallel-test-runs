import fs from "fs";
import { Test } from "./interfaces/Test";
import { Bin } from "./interfaces/Bin";

/**
 * Returns a random number between 1 and 20.
 *
 * @returns A random number.
 */
function getRandomNumber(): number {
  return Math.floor(Math.random() * 20) + 1;
}

/**
 * Mock call to test selection service.
 * Returns a random subset of tests from the `tests.json` file.
 *
 * @returns An array of tests.
 */
function mockGetTestsSelection(): Test[] {
  const tests = JSON.parse(fs.readFileSync("tests.json", "utf-8"));
  const subsetSize = getRandomNumber();
  const subset: Test[] = [];

  while (subset.length < subsetSize) {
    const randomIndex = Math.floor(Math.random() * tests.length);
    const randomTest = tests[randomIndex];

    if (!subset.includes(randomTest)) {
      subset.push(randomTest);
    }
  }

  return subset;
}

/**
 * Distributes tests into bins for optimal test running.
 * The algorithm used is the First Fit Decreasing (FFD) algorithm.
 *
 * @param tests - An array of tests to be distributed.
 * @param maxDuration - The maximum duration allowed for each bin.
 * @returns An array of bins containing the distributed tests.
 */
function binPackTests(tests: Test[], maxDuration: number): Bin[] {
  // Sort tests in decreasing order of duration
  tests.sort((a, b) => b.duration - a.duration);

  let bins: Bin[] = [];

  // Place tests one by one
  for (let i = 0; i < tests.length; i++) {
    // Find first bin that can accommodate tests[i]
    let j;
    for (j = 0; j < bins.length; j++) {
      if (bins[j].remaining >= tests[i].duration) {
        bins[j].tests.push(tests[i]);
        bins[j].remaining -= tests[i].duration;
        break;
      }
    }

    // If no bin could accommodate tests[i], create a new bin
    if (j == bins.length) {
      let bin: Bin = {
        remaining: maxDuration - tests[i].duration,
        tests: [tests[i]],
      };
      bins.push(bin);
    }
  }

  return bins;
}

const maximumDuration = process.argv[2] ? parseInt(process.argv[2]) : 20;

// Get a random subset of tests
// Replace with call to test selection api
const randomSubset = mockGetTestsSelection();

// Distribute tests into bins for optimal test running
const bins = binPackTests(randomSubset, maximumDuration);

// Convert bins to array of tests which is expected downstream
const testsFromBins: Test[][] = [];
for (const bin of bins) {
  testsFromBins.push(bin.tests);
}
let json = JSON.stringify(testsFromBins, null, 2);

// Write JSON data to a file
try {
  fs.writeFileSync("tests_distribution.json", json);
} catch (err) {
  console.log("An error occurred while writing JSON Object to File.");
  console.error(err);
}

console.log(json);
