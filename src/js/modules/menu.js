'use strict';

//var menu = new Menu({
//	title: "Раскрывающееся меню",
//	template: _.template(document.getElementById('menu-template').innerHTML),
//	listTemplate: _.template(document.getElementById('menu-list-template').innerHTML),
//	items: {
//		"donut": "Пончик",
//		"cake": "Пирожное",
//		"chocolate": "Шоколадка"
//	}
//});
//
//document.body.appendChild(menu.getElem());

function Menu(options) {
	let elem;

	function getElem() {
		if(!elem) render();
		return elem;
	}

	/* отрисовываем виджет */
	function render() {
		var html = options.template({
			title: options.title
		});

		elem = document.createElement('div');
		elem.innerHTML = html;
		elem = elem.firstElementChild;

		/* отмена выделения текста */
		elem.onmousedown = function() {
			return false;
		};

		elem.onclick = function(event) {
			if (event.target.closest('.title')) {
				toggle();
			}

			if (event.target.closest('a')) {
				event.preventDefault();
				select(event.target.closest('a'));
			}
		}
	}

	/* отрисовываем элементы меню */
	function renderItems() {
		if (elem.querySelector('ul')) return;
		var listHTML = options.listTemplate({
			items: options.items
		});
		elem.insertAdjacentHTML("beforeEnd", listHTML);
	};

	function open() {
		renderItems();
		elem.classList.add('open');
	}

	function close() {
		elem.classList.remove('open');
	}

	function toggle() {
		if (elem.classList.contains('open')) close();
		else open();
	}

	function select(link) {
		alert(link.getAttribute('href').slice(1));
	}

	/* публичные методы для использования извне */
	this.getElem = getElem;
	this.toggle = toggle;
	this.close = close;
	this.open = open;
}