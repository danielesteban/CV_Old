/* AppCache handler */
window.applicationCache && window.applicationCache.addEventListener('updateready', function(e) {
	if(window.applicationCache.status !== window.applicationCache.UPDATEREADY) return;
	try {
		window.applicationCache.swapCache();
	} catch(e) {}
	window.location.reload();
}, false);

/* requestAnimationFrame polyfill */
(function(window) {
	var lastTime = 0,
		vendors = ['webkit', 'moz'],
		requestAnimationFrame = window.requestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame,
		i = vendors.length;

	while(--i >= 0 && !requestAnimationFrame) {
		requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
		cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
	}
	if(!requestAnimationFrame || !cancelAnimationFrame) {
		requestAnimationFrame = function(callback) {
			var now = Date.now(), nextTime = Math.max(lastTime + 16, now);
			return setTimeout(function() {
				callback(lastTime = nextTime);
			}, nextTime - now);
		};
		cancelAnimationFrame = clearTimeout;
	}
	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;
}(window));

LIB = {
	cancelHandler : function(e) {
		e.stopPropagation();
		e.preventDefault();
	},
	escapeHTML : function(text) {
		return $('<div/>').text(text).html();
	},
	escapeURL : function(url) {
		return url.replace(/ /g, '_').replace(/\//g, '_').replace(/\./g, '');
	},
	handleLink : function(e) {
		var t = e.target;
		t.tagName.toLowerCase() !== 'a' && (t = $(t).parents('a')[0]);
		if(t.href) {
			var fullHost = document.location.protocol + '//' + document.location.host,
				p = t.href.indexOf(fullHost);

			LIB.cancelHandler(e);
			ROUTER.update(t.href.substr(p === 0 ? (p + fullHost.length) : 0));
		}
	},
	getTag : function(title, arr) {
		var tag = false;
		(arr || L.TAGS).forEach(function(t) {
			!tag && t.title === title && (tag = t);
		});
		return tag;
	},
	setLang : function(lang) {
		var reset = !!window.L;
		L = LANG[lang];
		L.lang = lang;
		L.PROJECTS = [];
		L.TAGS = [];
		window.localStorage && localStorage.setItem('lang', lang);
		PROJECTS.forEach(function(p, i) {
			p = JSON.parse(JSON.stringify(p));
			p.id = PROJECTS.length - i;
			p.title = p['title' + lang.toUpperCase()] || p.titleEN;
			p.link = '/project/' + p.id + '/' + LIB.escapeURL(p.titleEN);
			p.desc = p['desc' + lang.toUpperCase()] || p.descEN;
			p.role = p['role' + lang.toUpperCase()] || p.roleEN;
			p.tags.forEach(function(t, i) {
				typeof t === 'string' && (p.tags[i] = t = {en : t});
				t.title = t[lang] || t.en;
				t.link = '/projects/' + LIB.escapeURL(t.title);
				var tag = LIB.getTag(t.title);
				if(tag) tag.count++;
				else L.TAGS.push({
					title : t.title,
					link : t.link,
					count : 1
				});
			});
			p.links && p.links.forEach(function(l) {
				l.title = l['title' + lang.toUpperCase()] || l.titleEN;
			});
			p.media.forEach(function(m) {
				m.video && m.video.indexOf('www.youtube.com/embed/') === 0 && (m.video += '?controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0&hd=1&html5=1');
			});
			L.PROJECTS.push(p);
		});
		L.TAGS.sort(function(a, b) {
			return ((a.count > b.count) ? -1 : ((a.count < b.count) ? 1 : 0));
		});
		L.TAGS.unshift({
			title : L.all,
			link : '/projects'
		});
		if(!reset) return;
		LIB.renderSkin();
		ROUTER.update(document.location.pathname, true);
		$('body').fadeIn('fast');
	},
	renderSkin : function() {
		$('body').hide().empty().append(Handlebars.templates.skin({
			lang : L.lang,
			year: (new Date()).getFullYear()
		}));
		L.TAGS.forEach(function(t, i) {
			if(i > 4) return;
			var li = $('<li>'),
				a = $('<a>');

			a.text(t.title);
			a.attr('href', t.link);
			a.click(LIB.handleLink);
			li.attr('class', LIB.escapeURL(t.title));
			li.append(a);
			$('header nav').append(li);	
		});
		$('footer a.lang').each(function(i, e) {
			$(e).click(function() {
				LIB.setLang($(e).attr('rel'));
			});
		});
		COGS.onResize();
	},
	blueTriangle : function() {
		var canvas = $('<canvas>')[0],
			ctx = canvas.getContext ? canvas.getContext('2d') : null;

		if(!ctx) return;
		canvas.width = 40;
		canvas.height = 20;
		ctx.fillStyle = '#00bff3';
		ctx.beginPath();
		ctx.moveTo(0, 20);
		ctx.lineTo(20, 0);
		ctx.lineTo(40, 20);
		ctx.lineTo(0, 20);
		ctx.fill();
		ctx.closePath();
		var triangle = canvas.toDataURL();
		LIB.blueTriangle = function() { return triangle; };
		return triangle;
	}
};

COGS = {
	graphics : [],
	objects : [
		/* Upper Section */
		{
			s : 'L',
			x : -840,
			y : -330,
			d : -1
		},
		{
			s : 'S',
			x : -560,
			y : -343
		},
		{
			s : 'M',
			x : -506,
			y : -299,
			d : -1
		},
		{
			s : 'M',
			x : -271,
			y : -346
		},
		{
			s : 'S',
			x : -135,
			y : -391,
			d : -1
		},
		{
			s : 'L',
			x : -80,
			y : -400
		},
		{
			s : 'M',
			x : 242,
			y : -282,
			d : -1
		},
		{
			s : 'S',
			x : 283,
			y : -367
		},
		{
			s : 'M',
			x : 398,
			y : -347
		},
		{
			s : 'S',
			x : 560,
			y : -267,
			d : -1
		},
		/* Bottom Section */
		{
			s : 'L',
			x : -871,
			y : 98
		},
		{
			s : 'M',
			x : -551,
			y : 241,
			d : -1
		},
		{
			s : 'S',
			x : -390,
			y : 243
		},
		{
			s : 'L',
			x : -305,
			y : 110,
			d : -1
		},
		{
			s : 'S',
			x : 20,
			y : 217
		},
		{
			s : 'M',
			x : 97,
			y : 215,
			d : -1
		},
		{
			s : 'S',
			x : 264,
			y : 243
		},
		{
			s : 'L',
			x : 339,
			y : 60,
			d : -1
		}
	],
	init : function() {
		var preloaded = function() {
				var all = true;
				['S', 'M', 'L'].forEach(function(s) {
					!COGS.graphics[s] && (all = false);
				});
				all && COGS.draw();
			};

		if(!COGS.ctx) return;
		COGS.objects.forEach(function(o) {
			o.r = 0;
			o.d = o.d || 1;
		});
		$(window).resize(COGS.onResize);
		['S', 'M', 'L'].forEach(function(s) {
			var img = $('<img src="/img/cog' + s + '.png">');
			img.load(function() {
				COGS.graphics[s] = img[0];
				preloaded();
			});
		});
	},
	onResize : function() {
		var canvas = $('canvas.bg')[0],
			ctx = canvas.getContext ? canvas.getContext('2d') : null;

		if(!ctx) return;
		canvas.width = $(window).width();
		canvas.height = $(window).height();
		COGS.canvas = canvas;
		COGS.ctx = ctx;
		if(COGS.noise && (COGS.noise.width < canvas.width || COGS.noise.height < canvas.height)) delete COGS.noise;
		COGS.draw();
	},
	animate : function() {
		var duration = 400 + Math.floor(Math.random() * 600),
			time = 0,
			lastFrame,
			timeout,
			loop = function(t) {
				!lastFrame && (lastFrame = t);
				if(!COGS.ctx || t - lastFrame < 33) return (COGS.timeout = requestAnimationFrame(loop));
				time += t - lastFrame;
				lastFrame = t;
				if(time >= duration) {
					delete COGS.timeout;
					return;
				}
				COGS.draw();
				COGS.move();
				COGS.timeout = requestAnimationFrame(loop);
			};

		COGS.timeout && cancelAnimationFrame(COGS.timeout);
		COGS.timeout = requestAnimationFrame(loop);
	},
	draw : function() {
		var ctx = COGS.ctx;
		COGS.canvas.width = COGS.canvas.width;
		ctx.save();
		ctx.translate(COGS.canvas.width / 2, COGS.canvas.height / 2);		
		COGS.objects.forEach(function(o) {
			var g = COGS.graphics[o.s];
			if(!g) return;
			
			var hw = (g.width / 2),
				hh = (g.height / 2);

			ctx.save();
			ctx.translate(o.x + hw, o.y + hh);
			ctx.rotate(o.r * Math.PI / 180);
			ctx.drawImage(g, -hw, -hh);
			ctx.restore();
		});
		COGS.ctx.restore();
		COGS.ctx.drawImage(COGS.getNoise(), 0, 0);
	},
	move : function() {
		var speed = 2;
		COGS.objects.forEach(function(o) {
			o.r += speed * (o.s === 'S' ? 4 : o.s === 'M' ? 2 : 1) * o.d;
			o.r >= 360 && (o.r = 0);
		});
	},
	getNoise : function() {
		if(COGS.noise) return COGS.noise;
		var canvas = $('<canvas>')[0],
			ctx = canvas.getContext ? canvas.getContext('2d') : null;

		if(!ctx) return;
		canvas.width = COGS.canvas.width;
		canvas.height = COGS.canvas.height;
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'rgba(187, 187, 187, 0.15)';
		ctx.fill();
		var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const noiseRange = 50;
		for(var i=0; i<data.data.length; i+=4) {
			var c = 187 + (noiseRange - (Math.floor(Math.random() * (noiseRange * 2))));
			data.data[i] = data.data[i + 1] = data.data[i + 2] = c > 255 || c < 0 ? 187 : c;
		}
		ctx.putImageData(data, 0, 0);
		return (COGS.noise = canvas);
	}
};

ROUTER = {
	init : function() {
		$(window).bind('popstate', function(e) {
			ROUTER.update(e.originalEvent.state !== null ? e.originalEvent.state : document.location.pathname, true);
		});
		ROUTER.update(document.location.pathname, true);
		$('body').fadeIn('fast');
	},
	update : function(url, fromPopEvent) {
		url = url.substr(1);
		var p = url.indexOf('/'),
			panel = p != -1 ? url.substr(0, p) : url,
			params = p != -1 ? url.substr(p + 1).split('/') : [],
			validPanels = [
				'hiring',
				'home',
				'project',
				'projects'
			];

		if(ROUTER.onUnload) {
			ROUTER.onUnload();
			delete ROUTER.onUnload;
		}
		panel === '' && (panel = 'home');
		params.forEach(function(p, i) { params[i] = decodeURIComponent(p); });
		if(validPanels.indexOf(panel) === -1) return ROUTER.update('/');
		var data = TEMPLATE[panel] && TEMPLATE[panel].data ? TEMPLATE[panel].data(params) : {},
			animation = TEMPLATE[panel] && TEMPLATE[panel].animation ? TEMPLATE[panel].animation : {pre: 'top:-100%', post: {'top' : 61}};
		
		data.lang = L.lang;
		var section = $('<section id="' + panel + '" style="' + animation.pre + '">' + Handlebars.templates[panel](data) + '</section>');
		$('section').fadeOut().after(section);
		TEMPLATE[panel] && TEMPLATE[panel].render && TEMPLATE[panel].render(data);
		section.animate(animation.post, 'fast', function() {
			while($('section').length > 1) $('section').first().remove();
			['project', 'projects'].indexOf(panel) !== -1 && $('header nav:hidden').fadeIn('fast');
			TEMPLATE[panel] && TEMPLATE[panel].callback && TEMPLATE[panel].callback(data);
		});
		$('a.cog, header a').removeClass('active');
		$('a.cog.' + panel + ', header a.' + panel).addClass('active');
		$('header nav li').removeClass('active');
		['project', 'projects'].indexOf(panel) === -1 && $('header nav:visible').fadeOut('fast');
		COGS.animate();
		!fromPopEvent && window.history.state !== '/' + url && window.history.pushState('/' + url, '', '/' + url); 
	}
};

TEMPLATE = {
	home : {
		animation : {
			pre: 'left:-100%',
			post: {
				'left' : 0
			}
		},
		callback : function() {
			$('section .btn.projects').mouseover(function() {
				$('section .over.hiring').hide();
				$('section .arrow.hiring b').hide();
				$('section .over.projects').fadeIn('fast');
				$('section .arrow.projects b').fadeIn('fast');
			});
			$('section .btn.hiring').mouseover(function() {
				$('section .over.projects').hide();
				$('section .arrow.projects b').hide();
				$('section .over.hiring').fadeIn('fast');
				$('section .arrow.hiring b').fadeIn('fast');
			});
		}
	},
	projects : {
		data : function(params) {
			var projects = [],
				tag = LIB.getTag(params[0]);

			L.PROJECTS.forEach(function(p) {
				(!tag || LIB.getTag(tag.title, p.tags)) && projects.push(p);
			});
			return {
				projects : projects,
				projectsW : projects.length * 241,
				tag : tag
			};
		},
		cachedCanvas : {},
		render : function(data) {
			$('div.thumb img').each(function(i, e) {
				e = $(e);
				if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return e.show();

				var cached = TEMPLATE.projects.cachedCanvas[e.attr('rel')];
				if(cached) return e.attr('class', 'over').show().before(cached);

				var canvas = $('<canvas>')[0],
					ctx = canvas.getContext ? canvas.getContext('2d') : null;

				if(!ctx) return e.show();
				canvas.width = 240
				canvas.height = 240;
				e.before(canvas);
				e.load(function() {
					setTimeout(function() {
						e.css('width', 'auto').css('height', 'auto');
						ctx.drawImage(e[0], 0, 0, e.width(), e.height(), 0, 0, canvas.width, canvas.height);
						e.css('width', '').css('height', '');
						var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
						
						/* sharpen */
						var weights = [
								0, -1, 0,
								-1, 5, -1,
								0, -1, 0
							],
							side = Math.round(Math.sqrt(weights.length)),
							halfSide = Math.floor(side / 2),
							sharpened = ctx.createImageData(canvas.width, canvas.height);

						for(var y=0; y<canvas.height; y++) {
							for(var x=0; x<canvas.width; x++) {
								var dstOff = (y * canvas.width + x) * 4,
									r = 0,
									g = 0,
									b = 0,
									a = 0;

							    for(var cy=0; cy<side; cy++) {
							    	for(var cx=0; cx<side; cx++) {
										var scy = y + cy - halfSide,
											scx = x + cx - halfSide;

										if(scy >= 0 && scy < canvas.height && scx >= 0 && scx < canvas.width) {
											var srcOff = (scy * canvas.width + scx) * 4,
												wt = weights[cy * side + cx];

											r += data.data[srcOff] * wt;
											g += data.data[srcOff + 1] * wt;
											b += data.data[srcOff + 2] * wt;
											a += data.data[srcOff + 3] * wt;
										}
									}
								}
								sharpened.data[dstOff] = r;
								sharpened.data[dstOff + 1] = g;
								sharpened.data[dstOff + 2] = b;
								sharpened.data[dstOff + 3] = a;
							}
						}
						
						/* grayscale */
						for(var i=0; i<sharpened.data.length; i+=4) {
							var alpha = (0.2126 * sharpened.data[i]) + (0.7152 * sharpened.data[i + 1]) + (0.0722 * sharpened.data[i + 2]);
							sharpened.data[i] = sharpened.data[i + 1] = sharpened.data[i + 2] = alpha * 0.8;
						}
						ctx.putImageData(sharpened, 0, 0);
						TEMPLATE.projects.cachedCanvas[e.attr('rel')] = canvas;
					}, 80 * i);
				});
				e.attr('class', 'over').show();				
			});

			var onResize = function() {
					$('div.pagination.next')[$(window).width() >= data.projectsW ? 'hide' : 'show']();
				};
			
			onResize();
			$(window).bind('resize', onResize);
			ROUTER.onUnload = function() {
				$(window).unbind('resize', onResize);
			};
		},
		callback : function(data) {
			$('header nav li.' + (data.tag ? LIB.escapeURL(data.tag.title) : L.all)).addClass('active');
			var projects = $('section div.projects'),
				paginate = function(direction) {
					return function(e) {
						e.preventDefault();
						if($("section div.projects:animated").length) return;
						var l = parseInt(projects.css('left'), 10);
						l = l - (l % 241);
						projects.animate({
							left : l - (241 * direction)
						});
						COGS.animate();
						switch(direction) {
							case -1:
								$('div.pagination.next:hidden').fadeIn('fast');
								l + 241 >= 0 && $(this).fadeOut('fast');
							break;
							case 1:
								$('div.pagination.prev:hidden').fadeIn('fast');
								l - 241 - $(window).width() <= -projects.width() && $(this).fadeOut('fast');
							break;
						}
					};
				};

			$('div.pagination.prev').mousedown(paginate(-1));
			$('div.pagination.next').mousedown(paginate(1));
		}
	},
	project : {
		animation : {
			pre: 'left:200%',
			post: {
				'left' : 0
			}
		},
		data : function(params) {
			var id = parseInt(params[0], 10),
				project;

			L.PROJECTS.forEach(function(p) {
				if(!project && p.id === id) project = p;
			});
			if(!project) return ROUTER.update('/projects');
			return project;
		},
		render : function() {
			var media = $('section div.media');
			media.children().length > 1 && media.children().hide().first().show();
		},
		callback : function() {
			var media = $('section div.media'),
				current = 1,
				delay = 3000,
				timeout,
				carrousel = function() {
					$(':nth-child(' + current + ')', media).first().css('zIndex', 0).fadeOut();
					current++;
					current > media.children().length && (current = 1);
					$(':nth-child(' + current + ')', media).first().css('zIndex', 1).fadeIn();
					start();
				},
				start = function() {
					clearTimeout(timeout);
					timeout = setTimeout(carrousel, delay);
				},
				stop = function() {
					clearTimeout(timeout);
				};

			if(media.children().length < 2) return;
			if($('iframe', media).length) {
				media.mouseover(stop);
				media.mouseout(start);
			}
			start();
			ROUTER.onUnload = function() {
				stop();
				media.children().stop();
			};
		}
	},
	hiring : {
		animation : {
			pre: 'top:200%',
			post: {
				'top' : 61
			}
		},
		callback : function() {
			$('section input').first().focus();
		},
		submit : function(e) {
			var button = $('section div.submit button'),
				values = {},
				err;

			LIB.cancelHandler(e);
			['name', 'email', 'subject', 'message'].forEach(function(name) {
				if(err) return;
				values[name] = $(e.target[name]).val();
				if(values[name] === '' && (err = true)) return alert('Error: ' + L[name]);
			});
			if(err) return;
			button.attr('disabled', true).text(L.sending + '...');
			//Send data to email proxy...
			$.post('http://mailproxy-hellaserver.rhcloud.com', values, function() {
				e.target.reset();
				button.attr('disabled', false).text(L.send);
				alert(L.messageSent);
			}, 'json');
		}
	}
};

$(window).load(function() {
	/* Handlebars helpers */
	Handlebars.registerHelper('L', function(id) {
		return L[id] || id;
	});

	Handlebars.registerHelper('empty', function(data, options) {
		if(!data || !data.length) return options.fn(this);
		else return options.inverse(this);
	});

	Handlebars.registerHelper('equals', function(val1, val2, options) {
		if(val1 === val2) return options.fn(this);
		else return options.inverse(this);
	});

	Handlebars.registerHelper('a', function(title, href, className) {
		title = L[title] || LIB.escapeHTML(title);
		return new Handlebars.SafeString('<a' + (typeof href === 'string' ? ' href="' + href + '" onclick="LIB.handleLink(event)"' : '') + (typeof className === 'string' ? ' class="' + className + '"' : '') + '>' + title + '</a>');
	});

	Handlebars.registerHelper('line', function(width) {
		var c = '';
		for(var x=0; x<width; x++) c += '<span></span>';
		return new Handlebars.SafeString('<div class="line">' + c + '</div>');	
	});

	Handlebars.registerHelper('blueTriangle', function() {
		return LIB.blueTriangle();
	});

	/* Lang detection/setup */
	var browser_lang = navigator.language ? navigator.language.split('-') : [navigator.browserLanguage],
		cookie_lang = window.localStorage ? localStorage.getItem('lang') : false,
		available_langs = ['en', 'es'],
		lang = 'en'; //the default

	if(available_langs.indexOf(cookie_lang) !== -1) lang = cookie_lang;    
	else if(available_langs.indexOf(browser_lang[0].toLowerCase()) !== -1) lang = browser_lang[0].toLowerCase();
	else if(browser_lang[1] && available_langs.indexOf(browser_lang[1].toLowerCase()) !== -1) lang = browser_lang[1].toLowerCase();
	LIB.setLang(lang);
	
	/* Wait fonts to load */
	var fonts = ['Open Sans Condensed:300', 'Open Sans Condensed:700'],
		loaded = [],
		defWidth = [],
		waitTime = 0,
		checkFonts = function() {
			var timeout = 50;
			fonts.forEach(function(f, i) {
				f = f.split(':');
				var family = f[0],
					weight = f[1],
					p = $('<p style="position: fixed; top: -100%">AaMm.</p>');

				p.css('fontFamily', (defWidth[i] ? family + ', ' : '') + 'sans-serif');
				p.css('fontWeight', weight);
				$('body').append(p);
				if(!defWidth[i]) {
					defWidth[i] = p.width();
					timeout = 0;
				} else if(defWidth[i] !== p.width()) loaded.push(i);
				p.remove();
			});
			waitTime += timeout;
			if(waitTime < 1000 && loaded.length !== fonts.length) return setTimeout(checkFonts, timeout);
			
			/* Render the skin */
			LIB.renderSkin();
			
			/* Init cogs */
			COGS.init();

			/* Start the app */
			ROUTER.init();
		};

	checkFonts();
});
