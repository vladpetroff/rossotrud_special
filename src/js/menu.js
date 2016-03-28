'use strict';

import Menu from './menuComponent';

//debugger;

let menu = new Menu({
	title: "Раскрывающееся меню",
	items: [{
		text: 'Яйца',
		href: '#eggs'
	}, {
		text: 'Мясо',
		href: '#meat'
	}, {
		text: '99% еды - бамбук!',
		href: '#bamboo'
	}]
});

document.body.appendChild(menu.elem);
