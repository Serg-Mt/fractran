import { factorize, primeNumbersChain } from './primeNumbers';

const
  [initial, input, output, log, compButton, runButton] =
    `initial input output log compile run`
      .split(/\s/)
      .map(id => document.getElementById(id)) as
    [HTMLInputElement, HTMLTextAreaElement, HTMLTextAreaElement, HTMLTextAreaElement, HTMLButtonElement, HTMLButtonElement];


compButton.addEventListener('click', () => {
  console.debug('compButton click');
  output.value = compile(eval(initial.value), input.value);
});

runButton.addEventListener('click', () => {
  run(output.value);
});

function compile(initialNumber: number, text: string) {
  const
    fractions = text
      .split(/\s/)
      .map((f) =>
        Object.fromEntries(f.split("/").map((part, i) => ["ud"[i], Number(part)]))
      ),
    all = [initialNumber, ...fractions.map(o => Object.values(o)).flat()];
  all.forEach(factorize);
  const
    max = primeNumbersChain.length;


  console.debug({ all, primeNumbersChain });

  //let out = `\nlet\n\ta = ${initialNumber}, // $=2^${initialNumber}; \n`;
  let
    out = 'let\n\t';
  out += Object.assign(Array.from({ length: max }, () => 0), factorize(initialNumber)) // тут надо включить нули
    .map(x => x ?? 0)
    .map(formatStartInit)
    .join(`,\n\t`);
  // out +=
  //   Array.from({ length: max }, (_, i) => `\t${variableName(i + 1)}=0`)
  //     .join(`,\n`);
  out += ',\n\tcicles=0;\n\n';
  out += `while(true){\n\tcicles++;\n`;
  for (let fraction of fractions) {
    out +=
      "\tif (" +
      ((factorize(fraction.d)
        .map((num, i) => formatCondition(i, num))
        .filter(Boolean)
        .join(" && ")) || 'true') +
      "){ " +
      factorize(fraction.d)
        .map((num, i) => formatAssignment(i, num, "-"))
        .filter(Boolean)
        .join("; ") +
      "; " +
      factorize(fraction.u)
        .map((num, i) => formatAssignment(i, num, "+"))
        .filter(Boolean)
        .join("; ") +
      `; continue; } // (${fraction.u}/${fraction.d})\n`;
  }
  out += `\tbreak;\n};\n console.log('END',{\n` +
    Array.from({ length: max }, (_, i) => `${variableName(i)}`)
      .join(',')
    + ',cicles});\n';

  return out;
}




function run(textContent: string) {
  log.value = '';
  textContent = `console.log=(...p)=>log.value += (p.map(JSON.stringify)+'\\n');` +
    '(function(){' +
    textContent
    + '})();'
  const
    id = 'sid';
  document.getElementById(id)?.remove();
  const
    script = document.createElement('script');
  Object.assign(script, { id, textContent });
  document.body.append(script);
}


function getAlphaName(x: number) {
  switch (true) {
    case x < 26: // a-z           
      return (x + 10).toString(36);
    case x < 962: // a0-zz 26 * 36  = 936
      return (x + 360 - 26).toString(36);
    case x < 34658: // a00-zzz (26 * 36 * 36 = 34596)
      return (x + 11998).toString(36);
  }
  throw '>zzz';
}

function variableName(x: number) {
  return getAlphaName(x);// + '_' + primeNumbersChain[x];
  // return String.fromCharCode(97 + x) + '_' + x;
  // return String.fromCharCode(97 + x);
}

function formatStartInit(val: number, index: number) {
  return `${variableName(index)} = ${val}`
}

function formatCondition(x: number, val: number) {
  return `${variableName(x)} >= ${val}`;
}

function formatAssignment(x: number, val: number, sign: string) {
  return `${variableName(x)} = ${variableName(x)} ${sign} ${val}`;
}