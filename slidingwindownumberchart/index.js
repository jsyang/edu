/*

Inputs:
- # of columns (of digit slots, not of characters)
    - e.g. 3 columns of XXX = 3 x 3 digits = 9 digits total
- % of # range to cover in possible window (XX, XXX, XXXX, etc.)

Output: Simple plaintext numbers in rows, by column size
For use with monospace typeface

*/

const X_DIGITS = '0123456789'.split('');
const XX_DIGITS = X_DIGITS
    .map(x =>
        X_DIGITS
            .map(y => `${x}${y}`)
    )
    .flat();

const XXX_DIGITS = X_DIGITS
    .map(x =>
        XX_DIGITS
            .map(y => `${x}${y}`)
    )
    .flat();

const XXXX_DIGITS = X_DIGITS
    .map(x =>
        XXX_DIGITS
            .map(y => `${x}${y}`)
    )
    .flat();

// WIP: Maybe not needed
function getRangeCoverageInString(r = XX_DIGITS, s) {
    r.map(x => s.indexOf(x) > -1);
}

function generateFiller(l) {
    let fillerNumbers = '';

    while (fillerNumbers < l) {
        fillerNumbers += Math.random().toString(10).split('.')[1];
    }

    return fillerNumbers.substring(0, l);
}

// Type 1 = just take all the literal numbers in the range and randomize them without digit overlap
function generateType1Chart(r, colSize) {
    let rNew = [...r].sort(() => Math.random() - 0.5);

    const chart = [];

    while (rNew.length > 0) {
        const rowArray = rNew.splice(0, colSize);
        let row = rowArray.join('');
        if (rowArray.length < colSize) {
            const fillerLength = (colSize - rowArray.length) * r[0].length;
            row += generateFiller(fillerLength);
        }

        chart.push(row);
    }

    return chart;
}

// console.log(generateType1Chart(XX_DIGITS,10).join('\n'));