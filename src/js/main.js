"use strict";

;$(function(){

	/* autocomplete */

	// Ajax lookup:
	//$('.searchField input').autocomplete({
	//	serviceUrl: 'http://rossot.vmb.co:14180/api/suggestions/search?'
	//});

	// Local lookup (no ajax):
	var searchQuery = [
		{ value: 'образование в россии' },
		{ value: 'обратная связь' },
		{ value: 'обращение в россотрудничество' },
		{ value: 'образ' }
	];
	$('.searchField input').autocomplete({
		autoSelectFirst: true,
		lookup: searchQuery
	});




	let popped = document.querySelector('.popped');
	let poppedTrigger = document.querySelector('.a-settings a');

	poppedTrigger.onclick = function() {
		popped.classList.toggle('hidden');
	};
	document.querySelector('.closepopped').onclick = function() {
		popped.classList.add('hidden');
	};




	// cookies https://github.com/js-cookie/js-cookie
	let settings = document.getElementById('settings');
	var objCookies = {
		'chooseColor' : 'color1',
		'letter-spacing' : 'spacing-small',
		'font-family' : 'sans-serif',
		'fontSize' : 'font14'
	};
	var styles = ['chooseColor', 'letter-spacing', 'font-family', 'fontSize'];
	var initialBodyClasses = 'sans-serif spacing-small color1 font14';
	var resizeBlock = document.querySelector('.page');
	var currentPageSize;

	//Cookies.remove('chooseColor');
	//Cookies.remove('letter-spacing');
	//Cookies.remove('font-family');
	//Cookies.remove('fontSize');

	initCookies();

	// reading current font-size
	if (Cookies.get('fontSize')) {
		currentPageSize = +Cookies.get('fontSize').slice(4,6);
	} else {
		currentPageSize = 14;
	}

	// reading current cookies and creating objCookies{}
	function initCookies() {
		var cookies = Cookies.get();

		for(var key in cookies) {
			styles.filter(function(style) {
				if (style === key) {
					objCookies[key] = cookies[key];
				}
			})
		}

		applyCookieClass();
	}

	// applying saved cookies to body
	function applyCookieClass() {
		document.body.className = '' ;
		for(var key in objCookies) {
			document.body.classList.add(objCookies[key]);
		}
	}

	// clicking on settings
	settings.onclick = function(e) {
		let target = e.target;
		if (target.nodeName === 'A' && target.hasAttribute('rel')) {
			setCookies(target);
		}
		if(target.classList.contains('a-fontsize-big')) {
			if (currentPageSize < 18) {
				currentPageSize += 2;
				Cookies.set('fontSize', 'font'+ currentPageSize);
				resizeBlock.style.fontSize = currentPageSize + 'px';
				objCookies['fontSize'] = 'font'+ currentPageSize;
				applyCookieClass();
			}
		}
		if(target.classList.contains('a-fontsize-small')) {
			if (currentPageSize > 14) {
				currentPageSize -= 2;
				Cookies.set('fontSize', 'font'+ currentPageSize);
				resizeBlock.style.fontSize = currentPageSize + 'px';
				objCookies['fontSize'] = 'font'+ currentPageSize;
				applyCookieClass();
			}
		}
		if (target.classList.contains('default')) {
			document.body.className = initialBodyClasses;
			Cookies.set('chooseColor', 'color1');
			Cookies.set('letter-spacing', 'spacing-small');
			Cookies.set('font-family', 'sans-serif');
			Cookies.set('fontSize', 'font14');
		}
	};

	// changing cookie from clicking
	function setCookies(target) {
		let attributeForCookie = target.getAttribute('rel');
		let classNameForCookie = target.className;

		objCookies[classNameForCookie] = attributeForCookie;
		Cookies.set(classNameForCookie, attributeForCookie);
		applyCookieClass();
	}




});