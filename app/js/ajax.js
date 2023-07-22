const ajaxUrl = 'http://46.101.128.217/ru/sort-ajax/?csrfmiddlewaretoken=xV14VAyWVaoekfhQRrurpEMw7WESYgQJIbBcA3zaiiAGzJa7G7MzinAvi3Pl98u8';
let ajaxParamObj = {}

const tableCoins = document.querySelectorAll('.table-coins');
tableCoins.forEach((table, index) => {
	table.setAttribute('data-id', index)
	ajaxParamObj[index] = {
		page: 1
	};
})

/* const paginationLists = document.querySelectorAll('.pagination__list');
paginationLists.forEach(list => {
	const currentPage = list.querySelector('button.current').dataset.page;
	ajaxParamObj[list.closest('section').querySelector('.table-coins').dataset.id]['page'] = currentPage;
}) */

function tableCoinsAjax(appendPlace, id) {
	
	let paramString = '';
	for (key in ajaxParamObj[id]) {
		if(ajaxParamObj[id][key] != "") paramString+='&' + key + '=' + ajaxParamObj[id][key];
	}

	if(tableCoins[id].dataset.name) {
		paramString+='&' + tableCoins[id].dataset.name + '=true';
	}

	const paginationList = tableCoins[id].closest('section').querySelector('.pagination__list');
	
	let pagination;
	if(paginationList) {
		pagination = paginationList.closest('.pagination')
	} else {
		pagination = false;
	}

	let url = ajaxUrl + paramString;
		
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);

	xhr.onreadystatechange = function() {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		if (xhr.status === 200) {
		var data = JSON.parse(xhr.responseText);
		
		//return data.html;
		appendPlace.innerHTML = data.html;
		if(paginationList && data.html && pagination) {
			paginationList.innerHTML = '';
			if(data.coin_counter.length >= 1) {
				pagination.classList.remove('_hidden');
				for(let index = 0; index < data.coin_counter.length; index++) {
					if(data.coin_counter[index] == ajaxParamObj[id]['page'] || ajaxParamObj[id]['page'] == undefined) {
						ajaxParamObj[id]['page'] = data.coin_counter[index];
						paginationList.insertAdjacentHTML("beforeend", `<button type="button" class="current" data-page="${data.coin_counter[index]}">${data.coin_counter[index]}</button>`);
					} else {
						paginationList.insertAdjacentHTML("beforeend", `<button type="button" data-page="${data.coin_counter[index]}">${data.coin_counter[index]}</button>`);
					}
				}
				if(ajaxParamObj[id]['page'] == 1) {
					pagination.classList.add('_disable-prev-arrow');
					pagination.classList.remove('_disable-next-arrow');
				} else if(ajaxParamObj[id]['page'] == data.coin_counter.length) {
					pagination.classList.remove('_disable-prev-arrow');
					pagination.classList.add('_disable-next-arrow');
				} else {
					pagination.classList.remove('_disable-prev-arrow');
					pagination.classList.remove('_disable-next-arrow');
				}
			} else {
				pagination.classList.add('_hidden');
			}
		}
		//console.log(data.html)

		} else {
		console.error('Error:', xhr.status, xhr.statusText);
		}
	}
	};

	xhr.send();
}

// =-=-=-=-=-=-=-=-=-=- <click events> -=-=-=-=-=-=-=-=-=-=-

body.addEventListener('click', function (event) {

	function $(elem) {
		return event.target.closest(elem)
	}

	// =-=-=-=-=-=-=-=-=-=-=-=- <table-coins-head-button> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const tableCoinsSortBtn = $(".table-coins thead button")
	if(tableCoinsSortBtn) {
	
		const tableCoins = tableCoinsSortBtn.closest('.table-coins'),
		id = Number(tableCoins.dataset.id),
		tbody = tableCoins.querySelector('tbody')

		setTimeout(() => {
			if(tableCoinsSortBtn.classList.contains('_active-up')) {
				ajaxParamObj[id]['sort_name'] = tableCoinsSortBtn.dataset.sortName;
				ajaxParamObj[id]['sort_direction'] = 'desc';
			} else if(tableCoinsSortBtn.classList.contains('_active-down')) {
				ajaxParamObj[id]['sort_name'] = tableCoinsSortBtn.dataset.sortName;
				ajaxParamObj[id]['sort_direction'] = 'asc';
			} else {
				ajaxParamObj[id]['sort_name'] = "coin_name";
				ajaxParamObj[id]['sort_direction'] = '';
			}
	
			tableCoinsAjax(tbody, Number(tableCoins.dataset.id));
		},500)
		
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </table-coins-head-button> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <pagination> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const paginationButton = $(".pagination__list button")
	if(paginationButton) {
	
		ajaxParamObj[Number(paginationButton.closest('section').querySelector('.table-coins').dataset.id)]['page'] = paginationButton.dataset.page;
		const tbody = paginationButton.closest('section').querySelector('.table-coins tbody');
		tableCoinsAjax(tbody, Number(paginationButton.closest('section').querySelector('.table-coins').dataset.id));
	
	}

	const paginationArrow = $(".pagination__arrow")
	if(paginationArrow) {
	
		const tableId = Number(paginationArrow.closest('section').querySelector('.table-coins').dataset.id);
		if(paginationArrow.classList.contains('_prev')) {
			ajaxParamObj[tableId]['page'] -= 1
			if(ajaxParamObj[tableId]['page'] <= 0) ajaxParamObj[tableId]['page'] = 1;
		}

		if(paginationArrow.classList.contains('_next')) {
			ajaxParamObj[tableId]['page'] += 1
		}

		const tbody = paginationArrow.closest('section').querySelector('.table-coins tbody');
		document.querySelector(`button[data-page="${ajaxParamObj[tableId]['page']}"]`).classList.add('current')

		tableCoinsAjax(tbody, tableId);
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </pagination> -=-=-=-=-=-=-=-=-=-=-=-=

})

// =-=-=-=-=-=-=-=-=-=- </click events> -=-=-=-=-=-=-=-=-=-=-

// =-=-=-=-=-=-=-=-=-=-=-=- <switch-in-form> -=-=-=-=-=-=-=-=-=-=-=-=
	
switchInput.forEach(switchInput => {
	
	switchInput.addEventListener('change', function () {

		const
		table = switchInput.closest('section').querySelector('.table-coins'),
		tbody = table.querySelector('tbody');

		ajaxParamObj[Number(table.dataset.id)][`${switchInput.getAttribute('name')}`] = switchInput.getAttribute('value')
		tableCoinsAjax(tbody, Number(table.dataset.id));
		
	})
	
})

// =-=-=-=-=-=-=-=-=-=-=-=- </switch-in-form> -=-=-=-=-=-=-=-=-=-=-=-=


const filterPopupInputs = document.querySelectorAll('.filter__popup input[type="radio"]');
filterPopupInputs.forEach(input => {
	const tbody = input.closest('section').querySelector('.table-coins tbody');
	input.addEventListener('change', function (event) {
		ajaxParamObj[input.name] = input.value;
		const tableId = Number(input.closest('section').querySelector('.table-coins').dataset.id);
		tableCoinsAjax(tbody, tableId);
	})
})
