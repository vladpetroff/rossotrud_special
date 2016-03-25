//import Menu from './menu';

;$(function(){
	"use strict";

	//new Menu({
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


	console.log("in main.JS!");

	/* Calendar */
	$('.datetimepicker').datetimepicker({locale: 'ru'});
	$('.datepicker').datetimepicker({locale: 'ru', format: 'DD.MM.YYYY'});

	/* Слайдеры-ползунки */
	$('#slider').slider({});

	/* bxSlider */
	$('.bxslider').bxSlider({
		slideWidth: 150,
	    minSlides: 1,
	    maxSlides: 6,
	    slideMargin: 10
	});

	/* fancybox */
	$(".fancybox").fancybox();
});