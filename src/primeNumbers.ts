export const
  primeNumbersChain = [2, 3, 5, 7, 11],
  factorizeCache = new Map<number, SparseArray>;


type SparseArray = Record<number, number> & { length: number, map: typeof Array.prototype.map }

/**
 * 
 * @param n Длина необходимого массива
 */
function addPrimeNumbers(n: number) {
  let
    next = primeNumbersChain.at(-1) as number;

  while (primeNumbersChain.length < n) {
    next += 2;
    if (isPrime(next))
      primeNumbersChain.push(next);
  }
  // return primeNumbersChain;
}



export function factorize(x: number) {
  const
    argument = x,
    result = factorizeCache.get(argument);
  if (result) return result;

  let
    res = [] as SparseArray,
    i = 0;
  while (x > 1) {
    if (!primeNumbersChain[i])
      addPrimeNumbers(1 + primeNumbersChain.length);
    if (0 === x % primeNumbersChain[i]) {
      res[i] = 1 + (res[i] ?? 0);
      x /= primeNumbersChain[i];
    } else {
      i++
    };
  }

  factorizeCache.set(argument, res);
  return res;
}

function isPrime(p: number) {
  for (let prime of primeNumbersChain)
    if (0 == p % prime) return false;
  return true;
}