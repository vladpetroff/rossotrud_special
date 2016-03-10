;$(function(){
	"use strict";
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