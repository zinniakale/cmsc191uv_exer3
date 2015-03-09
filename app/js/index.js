/*
	TADA! Here's our new 'hindi-pang-grade-5' UI - JS component!
	Hope you guys like it.
	
	P.S. don't forget to remove this part before submission. Thanks.

	Hindi pa rin pala ito optimized.
*/

$(document).ready(function() {
	var searchOpen = false, // determines if the search panel is already open
		shrink = false, // determines if the search bar will be minimized
		newlyOpened = true, // determines if the search panel was newly opened and no search query has been input yet
		shrinkTimeout, // timeout for minimizing the search bar
		// request, // handles request
		algo1 = {}, // object for algo1 data
		algo2 = {}, // object for algo2 data
		resultCount = 0, // total number of rows returned

		// initializes app
		// hides results wrapper
		initApp = function() {
			$('#resultswrapper .algowrapper').hide();
			newlyOpened = true;
		},

		// initializes all actions and events in the app
		initActions = function() {
			// when the form is in focus, timeout for minimizing search bar is cleared
			// when the form is out of focus, timeout for minimizing the search bar starts
			$('#main #searchwrapper form').on('focusin', function() {
				var self = this;
				clearTimeout(shrinkTimeout);
				if(shrink) {
					$(self).stop().removeClass('shrink');
					shrink = false;
				}
			}).on('focusout', function() {
				var self = this;
				shrink = true;
				shrinkTimeout = setTimeout(function() {
					if(searchOpen && shrink) {
						$(self).addClass('shrink');
					}
				}, 3000);
			});

			// action when the search bar is still closed and focus has been given to the input bar
			$('#main #searchwrapper form #input').on('focus', function() {
				if(!searchOpen) {
					$('#main').addClass('open');
					searchOpen = true;
				}
			});

			// when the submit button has been clicked, timeout for minimizing the search bar is set
			$('#main #searchwrapper form #submit').on('click', function() {
				clearTimeout(shrinkTimeout);
				shrink = true;
				shrinkTimeout = setTimeout(function() {
					if(searchOpen && shrink) {
						$('#main #searchwrapper form').addClass('shrink');
					}
				}, 3000);
			});

			// closes the search panel
			// resets newlyOpened variable to clear the panel
			$('#main #searchwrapper #closebutton').on('click', function() {
				$(this).css('-webkit-transition-delay', '0s');
				$('#main').removeClass('open');
				searchOpen = false;

				var self = this;
				$('#main #searchwrapper').one('webkitTransitionEnd', function() {
					$(self).css('-webkit-transition-delay', '0.3s');
					$("#main #searchwrapper form #input").val('');
					$("#resultswrapper .algowrapper").hide();
					newlyOpened = true;
				});
			});

			// binds an event to the scroll bar whenever the scroll bar of the algo1 panel reaches the bottom
			// when this happens, new batch of results are inserted
			// solution was from http://webdeveloperplus.com/jquery/create-a-dynamic-scrolling-content-box-using-ajax/
			$('#main #searchwrapper #resultswrapper #algo1scroller').on('scroll', function(event) {
				var algo1Results = $('#algo1results'),
					algo1CurrentDisplayCount = algo1.displayCount,
					algo1scrolltop = event.currentTarget.scrollTop,
					algo1scrollheight = event.currentTarget.scrollHeight,
					algo1clientheight = event.currentTarget.clientHeight,

					scrolloffset = 20,
					// trims score value to just 4 decimal places
					trimScore = function(score) {
						var whole = score.slice(0, score.indexOf(".")),
							floating = score.slice(score.indexOf("."), score.indexOf(".")+5);

						return whole+floating;
					};

					if(algo1scrolltop >= (algo1scrollheight - (algo1clientheight + scrolloffset)) && algo1CurrentDisplayCount < resultCount) {
						var i;

						$('#algo1count').html("Fetching more items...");

						for(i = 0; algo1CurrentDisplayCount + i < resultCount && i < 10; i++) {
							var row = algo1.rankedResult[i+algo1CurrentDisplayCount],
								insert = "<li class='result insert'><div class='resultheader'><span class='coursecode'>"+ row[0] +"</span><span class='coursename'>"+ row[1] +"</span><span class='coursecredit'>"+row[3]+".0</span></div><div class='coursedesc'>"+row[2]+"</div><div class='score'>"+trimScore(row[4])+"</div></li>";
								
							insertItem(insert, algo1Results, i);
						}

						algo1.displayCount += i;
						if(algo1.displayCount == resultCount) $('#algo1count').html("We found "+resultCount+" items. Here's all of them.");
						else $('#algo1count').html("We found "+resultCount+" items. Here's "+algo1.displayCount+" of them.");
					}
			});

			// binds an event to the scroll bar whenever the scroll bar of the algo1 panel reaches the bottom
			// when this happens, new batch of results are inserted
			// solution was from http://webdeveloperplus.com/jquery/create-a-dynamic-scrolling-content-box-using-ajax/
			$('#main #searchwrapper #resultswrapper #algo2scroller').on('scroll', function(event) {
				var algo2Results = $('#algo2results'),
					algo2CurrentDisplayCount = algo2.displayCount,
					algo2scrolltop = event.currentTarget.scrollTop,
					algo2scrollheight = event.currentTarget.scrollHeight,
					algo2clientheight = event.currentTarget.clientHeight,
					
					scrolloffset = 20,
					// trims score value to just 4 decimal places
					trimScore = function(score) {
						var whole = score.slice(0, score.indexOf(".")),
							floating = score.slice(score.indexOf("."), score.indexOf(".")+5);

						return whole+floating;
					};

					if(algo2scrolltop >= (algo2scrollheight - (algo2clientheight + scrolloffset)) && algo2CurrentDisplayCount < resultCount) {
						var i;

						$('#algo2count').html("Fetching more items...");

						for(i = 0; algo2CurrentDisplayCount + i < resultCount && i < 10; i++) {
							var row = algo2.rankedResult[i + algo2CurrentDisplayCount],
								insert = "<li class='result insert'><div class='resultheader'><span class='coursecode'>"+ row[0] +"</span><span class='coursename'>"+ row[1] +"</span><span class='coursecredit'>"+row[3]+".0</span></div><div class='coursedesc'>"+row[2]+"</div><div class='score'>"+trimScore(row[4])+"</div></li>";
								
							insertItem(insert, algo2Results, i);
						}

						algo2.displayCount += i;
						if(algo2.displayCount == resultCount) $('#algo2count').html("We found "+resultCount+" items. Here's all of them.");
						else $('#algo2count').html("We found "+resultCount+" items. Here's "+algo2.displayCount+" of them.");
					}
			});
		},

		// initializes submit event
		initSubmit = function() {
			$('#search_form').on('submit', function(event) {
				event.preventDefault();

				// if(request) request.abort();

				var $form = $(this),
					serializedData = $form.serialize(); // the query from user


				// accessing the database server
				$.post('http://localhost/cmsc191/server/search.php', serializedData, function(result) {
					var data = JSON.parse(result),
						trimScore = function(score) {
							var whole = score.slice(0, score.indexOf(".")),
								floating = score.slice(score.indexOf("."), score.indexOf(".")+5);

							return whole+floating;
						};

					algo1 = {};
					algo2 = {};	

					resultCount = data.length;
					algo1.displayCount = 10;
					algo2.displayCount = 10;
					algo1.rankedResult = rankUsingAlgo1(data); // ranks the results using algo1
					algo2.rankedResult = rankUsingAlgo2(data); // ranks the results using algo2

					var algo1Results = $('#algo1results'),
						algo2Results = $('#algo2results');

					algo1Results.empty();
					algo2Results.empty();
					$('#algo1count').empty();
					$('#algo2count').empty();

					if(newlyOpened) {
						$("#resultswrapper .algowrapper").fadeIn(200);
						newlyOpened = false;
					}
					
					if(data.length > 0) {
						for(var i = 0; i < 10; i++) {
							var row = algo1.rankedResult[i],
								insert = "<li class='result insert'><div class='resultheader'><span class='coursecode'>"+ row[0] +"</span><span class='coursename'>"+ row[1] +"</span><span class='coursecredit'>"+row[3]+".0</span></div><div class='coursedesc'>"+row[2]+"</div><div class='score'>"+trimScore(row[4])+"</div></li>";
								
							insertItem(insert, algo1Results, i);
						}

						
						for(i = 0; i < 10; i++) {
							var row = algo2.rankedResult[i],
								insert = "<li class='result insert'><div class='resultheader'><span class='coursecode'>"+ row[0] +"</span><span class='coursename'>"+ row[1] +"</span><span class='coursecredit'>"+row[3]+".0</span></div><div class='coursedesc'>"+row[2]+"</div><div class='score'>"+trimScore(row[4])+"</div></li>";

							insertItem(insert, algo2Results, i+3);
						}

						$('#algo1count').html("We found "+resultCount+" items. Here's "+algo1.displayCount+" of them.");
						$('#algo2count').html("We found "+resultCount+" items. Here's "+algo2.displayCount+" of them.");
					}
					else {
						var insert = "<li class='result insert'><div class='resultheader'><span class='coursecode'></span><span class='coursename'>T_T</span><span class='coursecredit'></span></div><div class='coursedesc'>Aww. Sadly, we don't have that. Try a different one.</div><div class='score'></div></li>";
					
						insertItem(insert, algo1Results, 0);
						insertItem(insert, algo2Results, 1);

						$('#algo1count').html("We found nothing like that. Sorry.");
						$('#algo2count').html("We found nothing like that. Sorry.");
					}
				});
				
			});
		},

		// this is where tha algorithm 1 for sorting and ranking the results will be put
		rankUsingAlgo1 = function(array) {
			var result = array;


			return result;
		},

		// this is where the algorithm 2 for sorting and ranking the results will be put
		rankUsingAlgo2 = function(array) {
			var result = array;

			
			return result;
		},

		// inserts the new item to the pane with anumations
		insertItem = function(item, target, delay) {
			target.append(item);
			var child = target.find('.insert');
			$(child).css({
				top : '15px',
				opacity : 0
			}).delay(delay*200).animate({
				top : '0px',
				opacity : 1
			}, 400, function() {
				$(this).removeClass('insert');
			});
		};

	initApp();
	initActions();
	initSubmit();
});
