import { expect, test, describe } from "bun:test";
import { factorize } from "./primeNumbers";

const
  cases: [number, (number | undefined)[]][] = [
    [2, [1]],          // 2^1
    [4, [2]],          // 2^2
    [6, [1, 1]],       // 2^1 * 3^1
    [8, [3]],          // 2^3
    [12, [2, 1]],      // 2^2 * 3^1
    [30, [1, 1, 1]],    // 2^1 * 3^1 * 5^1
    [100, [2, , 2]],   // 2^2 * 3^0 * 5^2
  ] as const;

describe("factorize()", () => {
  test.each(cases)("factorize(%d) should return %j", (input, expected) => {
    expect(factorize(input)).toEqual(expected as number[]);
  });
});

// describe("primeNumbersChain state", () => {
//   test("should expand chain after factorizing large numbers", () => {
//     const initialLength = primeNumbersChain.length;
//     factorize(49); // требует наличия 7 в цепочке
//     expect(primeNumbersChain.length).toBeGreaterThanOrEqual(initialLength);
//     expect(primeNumbersChain).toContain(7);
//   });
// });