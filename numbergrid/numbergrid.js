function NumberGrid(params){
	const {width, height, start} = params;
	const $ = x => document.createElement(x);

	const $table = $('div');
	$table.classList.add('table');

	for(let i=0; i<height; i++){
		const $tr = $('div');
		$tr.classList.add('tr');

		for(let j=0; j<width; j++){
			const $td = $('div');
			$td.classList.add('td');

			$td.innerText = start + j + i * 10;
			$tr.appendChild($td);
		}
		$table.appendChild($tr);
	}

	return $table;
}
