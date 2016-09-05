/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	;$(function () {

		var popped = document.querySelector('.popped');
		var poppedTrigger = document.querySelector('.a-settings a');

		poppedTrigger.onclick = function () {
			popped.classList.toggle('hidden');
		};
		document.querySelector('.closepopped').onclick = function () {
			popped.classList.add('hidden');
		};

		// cookies https://github.com/js-cookie/js-cookie
		var settings = document.getElementById('settings');
		var objCookies = {
			'chooseColor': 'color1',
			'letter-spacing': 'spacing-small',
			'font-family': 'sans-serif',
			'fontSize': 'font14'
		};
		var styles = ['chooseColor', 'letter-spacing', 'font-family', 'fontSize'];
		var initialBodyClasses = 'sans-serif spacing-small color1 font14';
		var resizeBlock = document.querySelector('.page');
		var currentPageSize;

		//Cookies.remove('chooseColor');

		initCookies();

		// reading current font-size
		if (Cookies.get('fontSize')) {
			currentPageSize = +Cookies.get('fontSize').slice(4, 6);
		} else {
			currentPageSize = 14;
		}

		// reading current cookies and creating objCookies{}
		function initCookies() {
			var cookies = Cookies.get();
			console.log(objCookies);
			for (var key in cookies) {
				styles.filter(function (style) {
					if (style === key) {
						objCookies[key] = cookies[key];
					}
				});
			}
			console.log(objCookies);
			applyCookieClass();
		}

		// applying saved cookies to body
		function applyCookieClass() {
			document.body.className = '';
			for (var key in objCookies) {
				document.body.classList.add(objCookies[key]);
			}
		}

		// clicking on settings
		settings.onclick = function (e) {
			var target = e.target;
			if (target.nodeName === 'A' && target.hasAttribute('rel')) {
				setCookies(target);
			}
			if (target.classList.contains('a-fontsize-big')) {
				if (currentPageSize < 18) {
					console.log(currentPageSize);
					currentPageSize += 2;
					console.log(currentPageSize);
					Cookies.set('fontSize', 'font' + currentPageSize);
					resizeBlock.style.fontSize = currentPageSize + 'px';
					objCookies['fontSize'] = 'font' + currentPageSize;
					applyCookieClass();
				}
			}
			if (target.classList.contains('a-fontsize-small')) {
				if (currentPageSize > 14) {
					currentPageSize -= 2;
					console.log(currentPageSize);
					Cookies.set('fontSize', 'font' + currentPageSize);
					resizeBlock.style.fontSize = currentPageSize + 'px';
					objCookies['fontSize'] = 'font' + currentPageSize;
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
			var attributeForCookie = target.getAttribute('rel');
			var classNameForCookie = target.className;

			objCookies[classNameForCookie] = attributeForCookie;
			Cookies.set(classNameForCookie, attributeForCookie);
			applyCookieClass();
		}
	});

/***/ }
/******/ ]);