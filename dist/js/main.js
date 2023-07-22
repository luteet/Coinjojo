
/* import { 
	OverlayScrollbars, 
	ScrollbarsHidingPlugin, 
	SizeObserverPlugin, 
	ClickScrollPlugin  
} from '../js/libs.min.js'; */

const 
	body = document.querySelector('body'),
	html = document.querySelector('html'),
	menu = document.querySelectorAll('.header__burger, .header__nav, body'),
	wrapper = document.querySelector('.wrapper'),
	header = document.querySelector('.header');


// =-=-=-=-=-=-=-=-=-=- <image-aspect-ratio> -=-=-=-=-=-=-=-=-=-=-

const imageBody = document.querySelectorAll('.image-body, figure');
imageBody.forEach(imageBody => {

	const img = imageBody.querySelector('img'), style = getComputedStyle(imageBody);
	if(img) {
		if(img.getAttribute('width') && img.getAttribute('height') && style.position == "relative")
		imageBody.style.paddingTop = Number(img.getAttribute('height')) / Number(img.getAttribute('width')) * 100 + '%';
	}
	
})

// =-=-=-=-=-=-=-=-=-=- </image-aspect-ratio> -=-=-=-=-=-=-=-=-=-=-


	
// =-=-=-=-=-=-=-=-=-=- <Get-device-type> -=-=-=-=-=-=-=-=-=-=-

const getDeviceType = () => {

	const ua = navigator.userAgent;
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return "tablet";
	}

	if (
		/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
		ua
		)
	) {
		return "mobile";
	}
	return "desktop";

};

// =-=-=-=-=-=-=-=-=-=- </Get-device-type> -=-=-=-=-=-=-=-=-=-=-



// =-=-=-=-=-=-=-=-=-=- <anim-slides> -=-=-=-=-=-=-=-=-=-=-

function slideUp (target, duration=300) {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.boxSizing = 'border-box';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout( () => {
	  target.style.display = 'none';
	  target.style.removeProperty('height');
	  target.style.removeProperty('padding-top');
	  target.style.removeProperty('padding-bottom');
	  target.style.removeProperty('margin-top');
	  target.style.removeProperty('margin-bottom');
	  target.style.removeProperty('overflow');
	  target.style.removeProperty('transition-duration');
	  target.style.removeProperty('transition-property');
	}, duration);
}

function slideDown (target, duration=300) {
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;

	if (display === 'none')
	  display = 'block';

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.boxSizing = 'border-box';
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout( () => {
	  target.style.removeProperty('height');
	  target.style.removeProperty('overflow');
	  target.style.removeProperty('transition-duration');
	  target.style.removeProperty('transition-property');
	}, duration);
}

// =-=-=-=-=-=-=-=-=-=- </anim-slides> -=-=-=-=-=-=-=-=-=-=-


// =-=-=-=-=-=-=-=-=-=- <popup> -=-=-=-=-=-=-=-=-=-=-

function Popup(arg) {

	let body = document.querySelector('body'),
		html = document.querySelector('html'),
		saveHref = (typeof arg == 'object') ? (arg['saveHref']) ? true : false : false,
		popupCheck = true,
		popupCheckClose = true;

	const removeHash = function () {
		let uri = window.location.toString();
		if (uri.indexOf("#") > 0) {
			let clean_uri = uri.substring(0, uri.indexOf("#"));
			window.history.replaceState({}, document.title, clean_uri);
		}
	}

	const open = function (id, initStart) {

		if (popupCheck) {
			popupCheck = false;

			let popup = document.querySelector(id);

			if (popup) {

				body.classList.remove('_popup-active');
				html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
				body.classList.add('_popup-active');

				if (saveHref) history.pushState('', "", id);

				setTimeout(() => {
					if (!initStart) {
						popup.classList.add('_active');
						popup.classList.remove('fade-out');
						popup.classList.add('fade-in');
						function openFunc() {
							popupCheck = true;
							popup.removeEventListener('transitionend', openFunc);
						}
						setTimeout(() => {
							openFunc()
						},400)
						//popup.addEventListener('transitionend', openFunc)
					} else {
						popup.classList.add('_transition-none');
						popup.classList.add('_active');
						popupCheck = true;
					}

				}, 0)

			} else {
				return new Error(`Not found "${id}"`)
			}
		}
	}

	const close = function (popupClose) {
		if (popupCheckClose) {
			popupCheckClose = false;

			let popup
			if (typeof popupClose === 'string') {
				popup = document.querySelector(popupClose)
			} else {
				popup = popupClose.closest('.popup');
			}

			if (popup.classList.contains('_transition-none')) popup.classList.remove('_transition-none')

			setTimeout(() => {
				popup.classList.remove('_active');
				popup.classList.remove('fade-in');
				popup.classList.add('fade-out');
				
				function closeFunc() {
					const activePopups = document.querySelectorAll('.popup._active');

					if (activePopups.length < 1) {
						body.classList.remove('_popup-active');
						html.style.setProperty('--popup-padding', '0px');
					}

					if (saveHref) {
						removeHash();
						if (activePopups[activePopups.length - 1]) {
							history.pushState('', "", "#" + activePopups[activePopups.length - 1].getAttribute('id'));
						}
					}

					popupCheckClose = true;
					popup.removeEventListener('transitionend', closeFunc)
				}

				setTimeout(() => {
					closeFunc()
				},400)

			}, 0)

		}
	}

	return {

		open: function (id) {
			open(id);
		},

		close: function (popupClose) {
			close(popupClose)
		},

		init: function () {

			let thisTarget
			body.addEventListener('click', function (event) {

				thisTarget = event.target;

				let popupOpen = thisTarget.closest('.open-popup');
				if (popupOpen) {
					event.preventDefault();
					open(popupOpen.getAttribute('href'))
				}

				let popupClose = thisTarget.closest('.popup-close');
				if (popupClose) {
					close(popupClose)
				}

			});

			if (saveHref) {
				let url = new URL(window.location);
				if (url.hash) {
					open(url.hash, true);
				}
			}
		},

	}
}

const popup = new Popup();

popup.init();

// =-=-=-=-=-=-=-=-=-=- </popup> -=-=-=-=-=-=-=-=-=-=-



// =-=-=-=-=-=-=-=-=-=- <drop-down> -=-=-=-=-=-=-=-=-=-=-

function dropDown() {
	const dropDown = document.querySelectorAll('.drop-down');

	let dropDownArray = [];

	dropDown.forEach(dropDown => {
		const target = dropDown.querySelector('.drop-down__target'),
			  list = dropDown.querySelector('.drop-down__list');

		dropDownArray.push({block: dropDown, target: target, list: list});
		if(list) body.append(list);
	})

	Array.from(dropDownArray).forEach(dropDownElement => {
		const target = dropDownElement["target"],
			  list = dropDownElement["list"],
			  block = dropDownElement["block"];
		if(list) {

		
			target.addEventListener('click', function () {
				if(!target.classList.contains('_animating')) {
					target.classList.add('_animating');
				
					list.style.maxWidth = (target.offsetWidth * 2) + "px";
					let heightDropDownList = list.offsetHeight, widthDropDownList = list.offsetWidth, dropDownCoords = {y: block.getBoundingClientRect().y + window.pageYOffset, x: block.getBoundingClientRect().x + window.pageXOffset};
		
					if(!block.classList.contains('_active') && !target.closest('.drop-down._active')) {
		
						Array.from(dropDownArray).forEach(dropDownElement => {
							const target = dropDownElement["target"],
								  list = dropDownElement["list"],
								  block = dropDownElement["block"];
					
							if(block.classList.contains('_active')) {
								list.classList.remove("fade-in");
								list.classList.add("fade-out");
								block.classList.remove("_active");
					
								setTimeout(() => {
									list.style.removeProperty("left");
									list.style.removeProperty("top");
									list.style.removeProperty("transform");
									list.classList.remove("fade-out");
									target.classList.remove('_animating');
								},300)
							}
					
						})
		
						list.style.display = "none";
		
						if(dropDownCoords.x >= widthDropDownList && dropDownCoords.x < (window.innerWidth - widthDropDownList)) {
		
							list.style.left = (dropDownCoords.x + target.offsetWidth / 2) + "px";
							list.style.transform = "translate3d(-50%,0,0)";
		
						} else if(dropDownCoords.x + 15 > window.innerWidth - widthDropDownList) {
							
							list.style.left = (dropDownCoords.x - widthDropDownList + target.offsetWidth) + "px";
							list.style.transform = "translate3d(0,0,0)";
		
							
						} else if(dropDownCoords.x <= widthDropDownList) {
		
							list.style.left = dropDownCoords.x + "px";
							list.style.transform = "translate3d(0,0,0)";
		
						}
						
						if(target.getBoundingClientRect().bottom + heightDropDownList >= window.innerHeight) {
							
							list.style.top = (dropDownCoords.y - heightDropDownList - 9) + "px";
							
						} else if(target.getBoundingClientRect().bottom + heightDropDownList < wrapper.offsetHeight) {
							
							list.style.top = (dropDownCoords.y + target.offsetHeight + 9) + "px";
		
						}
		
						list.style.removeProperty("display");
		
						block.classList.add("_active");
						list.classList.add("fade-in");
		
						target.classList.remove('_animating');
		
					} else {
						
						list.classList.remove("fade-in");
						list.classList.add("fade-out");
						block.classList.remove("_active");
		
						setTimeout(() => {
							list.style.removeProperty("left");
							list.style.removeProperty("top");
							list.style.removeProperty("transform");
							list.classList.remove("fade-out");
							target.classList.remove('_animating');
						},300)
		
					}
		
				}
			})

		}

	})

	window.addEventListener('resize', function () {

		Array.from(dropDownArray).forEach(dropDownElement => {
			const target = dropDownElement["target"],
				  list = dropDownElement["list"],
				  block = dropDownElement["block"];

			if(block.classList.contains('_active') && list) {

				let heightDropDownList = list.offsetHeight, 
					widthDropDownList = list.offsetWidth, 
					dropDownCoords = {y: block.getBoundingClientRect().y + window.pageYOffset, x: block.getBoundingClientRect().x + window.pageXOffset};

				if(dropDownCoords.x >= widthDropDownList && dropDownCoords.x < (window.innerWidth - widthDropDownList)) {
	
					list.style.left = (dropDownCoords.x + target.offsetWidth / 2) + "px";
					list.style.transform = "translate3d(-50%,0,0)";

				} else if(dropDownCoords.x + 15 > window.innerWidth - widthDropDownList) {
					
					list.style.left = (dropDownCoords.x - widthDropDownList + target.offsetWidth) + "px";
					list.style.transform = "translate3d(0,0,0)";

					
				} else if(dropDownCoords.x <= widthDropDownList) {

					list.style.left = dropDownCoords.x + "px";
					list.style.transform = "translate3d(0,0,0)";

				}
				
				if(target.getBoundingClientRect().bottom + heightDropDownList >= window.innerHeight) {
					
					list.style.top = (dropDownCoords.y - heightDropDownList - 9) + "px";
					
				} else if(target.getBoundingClientRect().bottom + heightDropDownList < wrapper.offsetHeight) {
					
					list.style.top = (dropDownCoords.y + target.offsetHeight + 9) + "px";

				}
			}
	
		})
		
	})

	body.addEventListener('click', function(event) {
		if(!event.target.closest('.drop-down')) {

			Array.from(dropDownArray).forEach(dropDownElement => {
				const target = dropDownElement["target"],
					  list = dropDownElement["list"],
					  block = dropDownElement["block"];
		
				if(block.classList.contains('_active') && list) {
					list.classList.remove("fade-in");
					list.classList.add("fade-out");
					block.classList.remove("_active");
		
					setTimeout(() => {
						list.style.removeProperty("left");
						list.style.removeProperty("top");
						list.style.removeProperty("transform");
						list.classList.remove("fade-out");
						target.classList.remove('_animating');
					},300)
				}
			
		
			})

		}
	})

}

dropDown();

// =-=-=-=-=-=-=-=-=-=- </drop-down> -=-=-=-=-=-=-=-=-=-=-





// =-=-=-=-=-=-=-=-=-=- <click events> -=-=-=-=-=-=-=-=-=-=-



body.addEventListener('click', function (event) {

	function $(elem) {
		return event.target.closest(elem)
	}

	// =-=-=-=-=-=-=-=-=-=- <open menu in header> -=-=-=-=-=-=-=-=-=-=-

	if ($('.header__burger')) {
		menu.forEach(element => {
			element.classList.toggle('_mob-menu-active')
		})
	}

	if ($('.header__nav-bg')) {
		menu.forEach(element => {
			element.classList.remove('_mob-menu-active')
		})
	}

	// =-=-=-=-=-=-=-=-=-=- </open menu in header> -=-=-=-=-=-=-=-=-=-=-



	// =-=-=-=-=-=-=-=-=-=-=-=- <header-drop-down-open-on-mobile> -=-=-=-=-=-=-=-=-=-=-=-=

	const headerNavLink = $('.header__nav--list a');
	if(headerNavLink && windowSize < 992) {
		menu.forEach(element => {
			element.classList.remove('_mob-menu-active')
		})	
	}
	
	const headerNavItem = $(".header__nav--list > li");
	if(headerNavItem && getDeviceType() != "desktop" && windowSize >= 992) {
		if(headerNavItem.classList.contains('has-list')) {

			if(!headerNavItem.classList.contains('active')) {
				event.preventDefault();
				headerNavItem.classList.toggle('active');
				header.classList.add('_bg-active');
			} else {
				headerNavItem.classList.remove('active');
				header.classList.remove('_bg-active');
			}

		}
			
	} else if(document.querySelector('.header__nav--list li.active')) {

		document.querySelector('.header__nav--list li.active').classList.remove('active');
		header.classList.remove('_bg-active');
		

	}

	
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </header-drop-down-open-on-mobile> -=-=-=-=-=-=-=-=-=-=-=-=

	
	
	// =-=-=-=-=-=-=-=-=-=-=-=- <check-input-focus> -=-=-=-=-=-=-=-=-=-=-=-=
	
	if(!$('.check-input-focus-wrapper') || $('.check-input-focus-bg')) {
	
		const checkInputFocus = document.querySelectorAll('.check-input-focus');
		checkInputFocus.forEach(input => {
			const label = input.closest('label');
			label.classList.remove('focus')
			header.classList.remove('_search-active')
		})
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </check-input-focus> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <header-search-hide> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const headerSearchHide = $(".header__search--hide");
	if(headerSearchHide) {

		if(!headerSearchHide.classList.contains('_animating')) {

			const headerSearch = headerSearchHide.closest('.header__search'),
				  headerSearchList = headerSearch.querySelector('.header__search--list');

			if(!headerSearchHide.classList.contains('_active')) {
				headerSearchHide.classList.add('_active');
				headerSearchHide.classList.add('_animating');

				slideUp(headerSearchList);
				setTimeout(() => {
					headerSearchHide.classList.remove('_animating');
				}, 300)
			} else if(headerSearchHide.classList.contains('_active')) {
				headerSearchHide.classList.remove('_active');
				headerSearchHide.classList.add('_animating');

				slideDown(headerSearchList);
				setTimeout(() => {
					headerSearchHide.classList.remove('_animating');
				}, 300)
			}

		}
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </header-search-hide> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <header-search-open-on-mob> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const headerSearchToggle = $(".header__search--toggle")
	if(headerSearchToggle) {

		menu.forEach(element => {
			element.classList.remove('_mob-menu-active')
		})
	
		const headerSearch = $('.header__search');
		if(!headerSearch.classList.contains('_active')) {
			headerSearch.classList.add('_active');
			header.classList.add('_search-active')
		} else {
			headerSearch.classList.remove('_active');	
			header.classList.remove('_search-active')
		}
	
	} else if((!$('.header__search') && document.querySelector('.header__search')) || $('.header__search--bg')) {
		document.querySelector('.header__search').classList.remove('_active');
		header.classList.remove('_search-active')
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </header-search-open-on-mob> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <favorite> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const favoriteBtn = $(".favorite-btn")
	if(favoriteBtn) {
	
		favoriteBtn.classList.toggle('_active');
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </favorite> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <filter-open> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const filterBtn = $(".filter__btn")
	if(filterBtn) {
	
		const popup = $('.filter').querySelector('.filter__popup');
		if(!filterBtn.classList.contains('_active')) {
			filterBtn.classList.add('_active');
			popup.classList.remove('fade-out');
			popup.classList.add('fade-in');
			popup.closest('section').style.minHeight = `${popup.offsetHeight + 150}px`;
		} else {
			filterBtn.classList.remove('_active');
			popup.classList.remove('fade-in');
			popup.classList.add('fade-out');
			popup.closest('section').style.minHeight = `${0}px`;
		}
	
	} else if(!$('.filter__btn') && !$('.filter__popup') || $('.filter__popup--close')) {
		document.querySelectorAll('.filter__popup.fade-in').forEach(filterPopup => {
			filterPopup.classList.remove('fade-in');
			filterPopup.classList.add('fade-out');

			const btn = filterPopup.closest('.filter').querySelector('.filter__btn');
			btn.classList.remove('_active')
		})
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </filter-open> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <scroll on click to section> -=-=-=-=-=-=-=-=-=-=-=-=
	
	let btnToScroll = $('.btn-to-scroll');
	if(btnToScroll) {
		event.preventDefault();
		let section;
	
		section = document.querySelector(btnToScroll.getAttribute('href'))
	
		menu.forEach(elem => {
			elem.classList.remove('_mob-menu-active')
		})
	
		if(section) {
			window.scrollTo({
				top: section.offsetTop,
				left: 0,
				behavior: "smooth"
			})
		} else {
			body.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		}
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </scroll on click to section> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <promote-block-open-or-hide> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const promoteBlockTarget = $(".promote__block--target")
	if(promoteBlockTarget) {
	
		const promoteBlock = promoteBlockTarget.closest('.promote__block'),
			  promoteBlockContent = promoteBlock.querySelector('.promote__block--content');

		if(promoteBlock.classList.contains('_active') && !promoteBlock.classList.contains('_animating')) {

			promoteBlock.classList.add('_animating')
			promoteBlock.classList.remove('_active')
			promoteBlockContent.style.display = "block";
			slideUp(promoteBlockContent)
			setTimeout(() => {
				promoteBlock.classList.remove('_animating');
			},300)

		} else if(!promoteBlock.classList.contains('_active') && !promoteBlock.classList.contains('_animating')) {

			promoteBlock.classList.add('_animating')
			slideDown(promoteBlockContent)
			promoteBlock.classList.add('_active')
			setTimeout(() => {
				promoteBlock.classList.remove('_animating');
			},300)

		}
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </promote-block-open-or-hide> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <calendar-link> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const calendarLink = $(".calendar tbody td a")
	if(calendarLink) {

		event.preventDefault();
		const calendar = calendarLink.closest('.calendar');

		if(calendar) {
			
			const selectId = calendar.dataset.coinId;
			
			if(selectId) {
				
				const select = document.querySelector(`#${selectId}`);

				if(select) {
					
					if(select.value || !select.required) {
						if(select.required) {
							calendarLink.setAttribute('href', `${calendarLink.getAttribute('href')}?${select.name}=${select.value}`);
						} else {
							calendarLink.setAttribute('href', `${calendarLink.getAttribute('href')}?${select.name}=none`);
						}
						
						window.location.href = calendarLink.getAttribute('href');

					} else {
						if(select.closest('form')) {
							const form = select.closest('form');
							form.classList.add('error');
							window.scrollTo({top: form.offsetTop, left: 0, behavior: "smooth"});
							select.oninput = function () {
								form.classList.remove('error');
							}
						}
					}
				}
				

			}
		}
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </calendar-link> -=-=-=-=-=-=-=-=-=-=-=-=




	// =-=-=-=-=-=-=-=-=-=-=-=- <table-coins-head-button> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const tableCoinsSortBtn = $(".table-coins thead button")
	if(tableCoinsSortBtn) {
	
		const tableCoins = tableCoinsSortBtn.closest('.table-coins'),
		icon = tableCoinsSortBtn.querySelector('svg').querySelector('use');



		document.querySelectorAll('._active-up').forEach(button => {
			const icon = button.querySelector('svg').querySelector('use');
			if(button != tableCoinsSortBtn) {
				button.classList.remove('_active-up');
				icon.setAttribute('xlink:href', icon.getAttribute('xlink:href').split('#')[0] + '#arrows-up-down');
			}
			
		})

		document.querySelectorAll('._active-down').forEach(button => {
			const icon = button.querySelector('svg').querySelector('use');
			if(button != tableCoinsSortBtn) {
				button.classList.remove('_active-down');
				icon.setAttribute('xlink:href', icon.getAttribute('xlink:href').split('#')[0] + '#arrows-up-down');
			}
			
		})

		if(!tableCoinsSortBtn.classList.contains('_active-up') && !tableCoinsSortBtn.classList.contains('_active-down')) {
			tableCoinsSortBtn.classList.add('_active-up');
			icon.setAttribute('xlink:href', icon.getAttribute('xlink:href').split('#')[0] + '#arrow-up-active');
		} else if(tableCoinsSortBtn.classList.contains('_active-up') && !tableCoinsSortBtn.classList.contains('_active-down')) {
			tableCoinsSortBtn.classList.remove('_active-up');
			tableCoinsSortBtn.classList.add('_active-down');
			icon.setAttribute('xlink:href', icon.getAttribute('xlink:href').split('#')[0] + '#arrow-down-active');
		} else {
			tableCoinsSortBtn.classList.remove('_active-up');
			tableCoinsSortBtn.classList.remove('_active-down');
			icon.setAttribute('xlink:href', icon.getAttribute('xlink:href').split('#')[0] + '#arrows-up-down');
		}
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </table-coins-head-button> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <pagination> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const paginationButton = $(".pagination__list button")
	if(paginationButton) {
	
		const tbody = paginationButton.closest('section').querySelector('.table-coins tbody'),
		list = paginationButton.closest('.pagination__list'),
		currentButton = paginationButton.parentElement.querySelector('.pagination__list button.current');

		currentButton.classList.remove('current');
		paginationButton.classList.add('current');
	
	}

	const paginationArrow = $(".pagination__arrow")
	if(paginationArrow) {

		const currentButton = paginationArrow.parentElement.querySelector('.pagination__list button.current');
		currentButton.classList.remove('current');
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </pagination> -=-=-=-=-=-=-=-=-=-=-=-=

	
	

})

// =-=-=-=-=-=-=-=-=-=- </click events> -=-=-=-=-=-=-=-=-=-=-







// =-=-=-=-=-=-=-=-=-=-=-=- <header-drop-down-on-hover> -=-=-=-=-=-=-=-=-=-=-=-=

const headerNavLink = document.querySelectorAll(".header__nav--list > li");
headerNavLink.forEach(headerNavLink => {

	if(headerNavLink.querySelector('ul')) {
		headerNavLink.addEventListener('pointerenter', function() {
			if(getDeviceType() == "desktop") {
				header.classList.add('_bg-active');
			}
		})
	
		headerNavLink.addEventListener('pointerleave', function() {
			header.classList.remove('_bg-active');
		})
	}
	

})

// =-=-=-=-=-=-=-=-=-=-=-=- </header-drop-down-on-hover> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <resize> -=-=-=-=-=-=-=-=-=-=-=-=

let resizeCheck = {}, windowSize;

const appendToOnTablet = document.querySelectorAll("[data-append-to-on-tablet]"),
	  appendToOnTabletArray = [];

appendToOnTablet.forEach(appendToOnTablet => {
	appendToOnTablet.style.display = "none";
	appendToOnTabletArray.push({
		element: appendToOnTablet,
		parent: appendToOnTablet.parentElement,
		appendAddress: document.querySelector(appendToOnTablet.dataset.appendToOnTablet),
	})
})

function resizeCheckFunc(size, minWidth, maxWidth) {
	if (windowSize <= size && (resizeCheck[String(size)] == true || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != false) {
		resizeCheck[String(size)] = false;
		maxWidth(); // < size
	}

	if (windowSize >= size && (resizeCheck[String(size)] == false || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != true) {
		resizeCheck[String(size)] = true;
		minWidth(); // > size
	}
}

function resize() {

	windowSize = window.innerWidth;

	html.style.setProperty("--height-screen", window.innerHeight + "px");
	html.style.setProperty("--height-header", header.offsetHeight + "px");
	html.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
	
	document.querySelectorAll('.switch__input:checked').forEach(switchInput => {
		const switchBlock = switchInput.closest('.switch'),
			  switchPseudoEl = switchBlock.querySelector('.switch__pseudo-btn'),
			  switchBtn = switchInput.closest('.switch__btn');

		switchPseudoEl.style.width = switchBtn.offsetWidth + "px";
	})

	resizeCheckFunc(992,
		function () {  // screen > 992px

			Array.from(appendToOnTabletArray).forEach(appendElement => {
				appendElement["element"].style.display = "none";
				appendElement["parent"].append(appendElement["element"]);
				appendElement["element"].style.removeProperty('display');
			})

		},
		function () {  // screen < 992px

			Array.from(appendToOnTabletArray).forEach(appendElement => {
				appendElement["element"].style.display = "none";
				appendElement["appendAddress"].append(appendElement["element"]);
				appendElement["element"].style.removeProperty('display');
			})

		}
	);

}

resize();

window.onresize = resize;

// =-=-=-=-=-=-=-=-=-=-=-=- </resize> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <switch-in-form> -=-=-=-=-=-=-=-=-=-=-=-=
	
const switchInput = document.querySelectorAll('.switch__input');
switchInput.forEach(switchInput => {
	const switchBlock = switchInput.closest('.switch'),
	title = (switchInput.dataset.titleId) ? document.querySelector(switchInput.dataset.titleId) : false,
	switchPseudoEl = switchBlock.querySelector('.switch__pseudo-btn');

	if(switchInput.checked) {
		window.onload = function () {
			setTimeout(() => {
				const btn = switchInput.closest('.switch__btn');
				switchPseudoEl.style.transition = 'all 0s linear';
				switchPseudoEl.style.width = btn.offsetWidth + "px";
				setTimeout(() => {
					switchPseudoEl.style.removeProperty('transition')
				},200)
			},0)
		}
		const btn = switchInput.closest('.switch__btn');
		switchPseudoEl.style.transitionDuration = '0s';
		if(btn == switchBlock.querySelectorAll('.switch__btn')[0]) {
			switchPseudoEl.style.transform = "translate3d(0%,0,0)";
			switchPseudoEl.style.left = "0%";
			switchPseudoEl.style.width = btn.offsetWidth + "px";
		} else {
			switchPseudoEl.style.transform = "translate3d(-100%,0,0)";
			switchPseudoEl.style.left = "100%";
			switchPseudoEl.style.width = btn.offsetWidth + "px";
		}
		switchPseudoEl.style.removeProperty('transition-duration')

		if(title && switchInput.dataset.titleClass) {
			title.classList.remove('_mode-1');
			title.classList.remove('_mode-2');

			title.classList.add(switchInput.dataset.titleClass);
		}
	}
	
	switchInput.addEventListener('change', function () {
		const btn = switchInput.closest('.switch__btn');

		table = switchInput.closest('section').querySelector('.table-coins tbody');
		
		if(btn == switchBlock.querySelectorAll('.switch__btn')[0]) {
			switchPseudoEl.style.transform = "translate3d(0%,0,0)";
			switchPseudoEl.style.left = "0%";
			switchPseudoEl.style.width = btn.offsetWidth + "px";
		} else {
			switchPseudoEl.style.transform = "translate3d(-100%,0,0)";
			switchPseudoEl.style.left = "100%";
			switchPseudoEl.style.width = btn.offsetWidth + "px";
		}

		if(title && switchInput.dataset.titleClass) {
			title.classList.remove('_mode-1');
			title.classList.remove('_mode-2');

			title.classList.add(switchInput.dataset.titleClass);
		}
	})
	
})

// =-=-=-=-=-=-=-=-=-=-=-=- </switch-in-form> -=-=-=-=-=-=-=-=-=-=-=-=





// =-=-=-=-=-=-=-=-=-=-=-=- <show-result-search-on-focus> -=-=-=-=-=-=-=-=-=-=-=-=

const checkInputFocus = document.querySelectorAll('.check-input-focus');
checkInputFocus.forEach(input => {
	const label = input.closest('label');

	input.addEventListener("focus", function () {
		if(label) label.classList.add('focus');
		header.classList.add('_search-active')
	})

})

// =-=-=-=-=-=-=-=-=-=-=-=- </show-result-search-on-focus> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <calendar> -=-=-=-=-=-=-=-=-=-=-=-=

const calendar = document.querySelectorAll(".calendar");
calendar.forEach(calendar => {
	const 
	calendarBase = calendar.dataset.base,
	calendarWrapper = calendar.closest('.calendar-wrapper'),
	calendarName = calendarWrapper.querySelector('.calendar-current'),
	calendarPrev = calendarWrapper.querySelector('.calendar-arrow._prev'),
	calendarNext = calendarWrapper.querySelector('.calendar-arrow._next');

	const calendarElement = jsCalendar.new(calendar, new Date(), {
		monthFormat : "month YYYY",
	});

	calendarElement.onDateRender(function(date, element, info) {
		const dateArray = [date.getDate(),(date.getMonth()+1 < 9) ? '0' + (date.getMonth()+1) : (date.getMonth()+1), date.getFullYear()]
		if(calendarBase) {
			let text = element.textContent;
			element.textContent = '';
			if(info.isSelected) {
				element.insertAdjacentHTML('beforeend', `<input class="visually-hidden" checked type="checkbox" name="date" value="${dateArray[0]}-${dateArray[1]}-${dateArray[2]}"/>${text}`)
			} else {
				element.insertAdjacentHTML('beforeend', `<input class="visually-hidden" type="checkbox" name="date" value="${dateArray[0]}-${dateArray[1]}-${dateArray[2]}"/>${text}`)
			}
			
		}
		

		nowDate = new Date();
		let nextDate = new Date();
		nextDate.setMonth(nowDate.getMonth() + 1)
		delta=nowDate.getTime()-date.getTime();
		
		if(Math.floor(delta/1000/60/60/24) > 0 && !element.querySelector('input[type="checkbox"]').disabled && !element.classList.contains('disabled')) {
			
			element.querySelector('input[type="checkbox"]').disabled = true;
			element.classList.add('disabled')
			
		}

		if(Math.floor((date - nextDate) / (1000 * 60 * 60 * 24)) > 0) {
			element.querySelector('input[type="checkbox"]').disabled = true;
			element.classList.add('disabled')
		}
		
		
	});
	//console.log(calendar.dataset.calendarDates)
	if(calendar.dataset.calendarDates != undefined) calendarElement.select(calendar.dataset.calendarDates.split(', '));
	calendarElement.refresh()

	setTimeout(() => {
		if(calendarName) calendarName.textContent = calendarWrapper.querySelector('.jsCalendar-title-name').textContent;
	},0)

	calendarPrev.addEventListener('click', function () {
		calendarElement.previous();
		if(calendarName) calendarName.textContent = calendarWrapper.querySelector('.jsCalendar-title-name').textContent;
	})

	calendarNext.addEventListener('click', function () {
		calendarElement.next();
		if(calendarName) calendarName.textContent = calendarWrapper.querySelector('.jsCalendar-title-name').textContent;
	})

	

	calendarElement.onDateClick(function(event, date){
		if(!event.target.classList.contains('jsCalendar-next') && !event.target.classList.contains('jsCalendar-previous')) {
			if(event.target.classList.contains('jsCalendar-selected')) {
				calendarElement.unselect(date)
			} else {
				calendarElement.select(date)
			}
		}
		
    });
})

// =-=-=-=-=-=-=-=-=-=-=-=- </calendar> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <clipboard> -=-=-=-=-=-=-=-=-=-=-=-=

document.querySelectorAll('[data-clipboard-target]').forEach(btn => {
	new ClipboardJS(btn);
})

// =-=-=-=-=-=-=-=-=-=-=-=- </clipboard> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <scroll-to-order> -=-=-=-=-=-=-=-=-=-=-=-=

const toOrderBtn = document.querySelector('.to-order-btn');

if(toOrderBtn) {
	const toOrderTarget = document.querySelector(toOrderBtn.getAttribute('href'));
	
	window.addEventListener('scroll', function () {
	
		if(toOrderTarget.getBoundingClientRect().y - toOrderTarget.offsetHeight >= 0 && !toOrderBtn.classList.contains('_hidden')) {
	
			toOrderBtn.classList.add('_hidden');
			toOrderBtn.classList.remove('fade-out');
			toOrderBtn.classList.add('fade-in');
	
		} else if(toOrderTarget.getBoundingClientRect().y - toOrderTarget.offsetHeight < 0 && toOrderBtn.classList.contains('_hidden')) {
	
			toOrderBtn.classList.remove('_hidden');
			toOrderBtn.classList.remove('fade-out');
			toOrderBtn.classList.add('fade-out');
	
		}
	})
}

// =-=-=-=-=-=-=-=-=-=-=-=- </scroll-to-order> -=-=-=-=-=-=-=-=-=-=-=-=


const headerNavList = document.querySelectorAll('.header__nav--list');
headerNavList.forEach(list => {
	const li = list.querySelectorAll('li');
	li.forEach(li => {
		if(li.querySelector('ul')) {
			li.classList.add('has-list');
		}
	})
	
})


// =-=-=-=-=-=-=-=-=-=-=-=- <lozyload> -=-=-=-=-=-=-=-=-=-=-=-=

new LazyLoad();

// =-=-=-=-=-=-=-=-=-=-=-=- </lozyload> -=-=-=-=-=-=-=-=-=-=-=-=
