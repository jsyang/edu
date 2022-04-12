function getTableFromNumberChart(chartRows) {
    let tRows = '';
    for (let row of chartRows) {
        tRows += '<tr>' + row.split('').map(c => `<td>${c}</td>`).join('') + '</tr>';
    }

    return `<table id=chart>${tRows}</table>`;
}

const digitMap = [null, X_DIGITS, XX_DIGITS, XXX_DIGITS, XXXX_DIGITS];

function updateChartDisplay() {
    const chartRows = generateType1Chart(digitMap[chartSettings.digits], chartSettings.colSize);
    document.getElementById('chartContainer').innerHTML = getTableFromNumberChart(chartRows);;
}

function updateChartFont() {
    const sheet = Array.from(document.styleSheets)
        .find(ss => {
            if(!ss || !ss.href) return;

            return ss.href.indexOf('index') >= 0
        });

    const rules = sheet.cssRules || sheet.rules;
    rules[0].style.fontSize = chartSettings.fontSize + 'em';
}

window.onload = () => {
    updateChartDisplay();
    updateChartFont();
};