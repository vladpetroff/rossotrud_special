$(function(){
	console.log("in main.js!");

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

	/* lightbox */
	$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
	    event.preventDefault();
	    $(this).ekkoLightbox();
	});
});