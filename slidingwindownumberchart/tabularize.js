function getTableFromNumberChart(chartRows) {
    let tRows = '';
    for (let row of chartRows) {
        tRows += '<tr>' + row.split('').map(c => `<td>${c}</td>`).join('') + '</tr>';
    }

    return `<table id=chart>${tRows}</table>`;
}

const digitMap = [null, X_DIGITS, XX_DIGITS, XXX_DIGITS, XXXX_DIGITS];
const digitLegend = '万千百十一';

function updateChartDisplay() {
    const chartRows = generateType1Chart(digitMap[chartSettings.digits], chartSettings.colSize);
    document.getElementById('chartContainer').innerHTML = getTableFromNumberChart(chartRows);;
    document.getElementById('windowContainer').innerHTML =
        '<table id=window>' +
        `<tr>${'<td class=slot>0</td>'.repeat(chartSettings.digits)}</tr>` +
        `<tr>${Array.from(digitLegend).reverse().slice(0, chartSettings.digits).reverse()
            .map(c => `<td class=legend>${c}</td>`)
            .join('')
        }</tr>` +
        '</table>';

}

function updateChartFont() {
    const sheet = Array.from(document.styleSheets)
        .find(ss => {
            if (!ss || !ss.href) return;

            return ss.href.indexOf('index') >= 0
        });

    const rules = sheet.cssRules || sheet.rules;
    rules[0].style.fontSize = chartSettings.fontSize + 'em';
}

window.onload = () => {
    updateChartDisplay();
    updateChartFont();
};

window.onmousemove = e => {
    const wStyle= document.getElementById('window').style;
    wStyle.left = e.clientX + 'px';
    wStyle.top = e.clientY + 'px';
    wStyle.position = 'absolute';
};