'use strict';

import Menu from './menuComponent';

//debugger;

//let menu = new Menu(options);

let menu = new Menu({
	title: "Раскрывающееся меню",
	items: [{
		text: 'Яйца',
		href: '#eggs'
	}, {
		text: 'Мясо',
		href: '#meat'
	}, {
		text: '90% еды - бамбук!',
		href: '#bamboo'
	}]
});

console.log( menu );

document.body.appendChild(menu.elem);
