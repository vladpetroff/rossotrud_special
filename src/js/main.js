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
	var objCookies = {};
	var objProp = ['chooseColor', 'letter-spacing', 'font-family', 'fontSize'];
	var initialBodyClasses = 'sans-serif spacing-small color1 font14';
	var resizeBlock = document.querySelector('.page');

	initCookies();

	var currentPageSize = +Cookies.get('fontSize').slice(4,6);

	function initCookies() {
		var cookies = Cookies.get();
		for(var key in cookies) {
			objProp.filter(function(item) {
				if (item === key) {
					objCookies[key] = cookies[key];
				}
			})
		}
		applyCookieClass();
	}

	function setCookies(target) {
		let attributeForCookie = target.getAttribute('rel');
		let classNameForCookie = target.className;

		objCookies[classNameForCookie] = attributeForCookie;
		Cookies.set(classNameForCookie, attributeForCookie);
		applyCookieClass();
	}

	function applyCookieClass() {
		document.body.className = '' ;
		for(var key in objCookies) {
			document.body.classList.add(objCookies[key]);
		}
	}

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




});