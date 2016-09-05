"use strict";

;$(function(){

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
		console.log( objCookies );
		for(var key in cookies) {
			styles.filter(function(style) {
				if (style === key) {
					objCookies[key] = cookies[key];
				}
			})
		}
		console.log( objCookies );
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
				console.log( currentPageSize );
				currentPageSize += 2;
				console.log( currentPageSize );
				Cookies.set('fontSize', 'font'+ currentPageSize);
				resizeBlock.style.fontSize = currentPageSize + 'px';
				objCookies['fontSize'] = 'font'+ currentPageSize;
				applyCookieClass();
			}
		}
		if(target.classList.contains('a-fontsize-small')) {
			if (currentPageSize > 14) {
				currentPageSize -= 2;
				console.log( currentPageSize );
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