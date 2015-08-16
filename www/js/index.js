/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        //console.log('initialize');
		this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		//console.log('bindEvents');
        document.addEventListener('deviceready', this.onDeviceReady, false);
		//for browser test
		$(document).ready(this.onDocumentReady);
		$(window).load(this.onWindowLoaded);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		//console.log('onDeviceReady');
        app.receivedEvent('deviceready');
    },
	onDocumentReady: function() {
		//console.log('onDocumentReady');
        app.receivedEvent('documentready');
		
		app.manipulateDom();
    },
	onWindowLoaded: function() {
		//console.log('onWindowLoaded');
        app.receivedEvent('windowloaded');
		
		//all elements (like images) loaded
		
		app.setClickEvents();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*
		var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
		*/
        console.log('Received Event: ' + id);
    },
	// DOM Elements are ready to manipulate by javascript and jQuery
	manipulateDom: function(){
		console.log('manipulateDom');
		
		//initialize tabs navigation
		$('#maintabs').tabs({ heightStyle: 'fill' });
		
		app.setContentHeight(function(){
			// canvas need content width and height
			app.drawCanvas('farmCanvas');
			
		});
	},
	// set Tab and content to full window height
	setContentHeight: function(callback){
		console.log('setContentHeight');
		
		var iWindowHeight = window.innerHeight;
		var iStatusHeight = $('#statusbar').height();
		var iMenuHeight = $('#mainnav').height();
		var iFooterHeight = $('.ui-footer').height();
		
		// maintabs: header + Border 1px subtract from window height
		var iMainHeight = iWindowHeight - iStatusHeight - 4;
		$('#maintabs').css('height',iMainHeight);
		console.log('iMainHeight ' + iMainHeight);
		
		// Content: menu and footer subtract from maintabs height
		var iContentHeight = iMainHeight - iMenuHeight - iFooterHeight;
		$('.ui-content').height(iContentHeight);
		console.log('iContentHeight ' + iContentHeight);
		
		// Popup width
		$('#dataContent .ui-content').width(window.innerWidth - 100);
		
		if(typeof callback == 'function')
			callback();
	},
	// draw Grid on Canvas
	drawCanvas: function(sId){
		console.log('drawCanvas');
		
		sId = sId || false;
		if(!sId)
			return;
		
		var canvas = document.getElementById(sId);
		if(canvas && canvas.getContext){
			
			canvas.width = $('.ui-content').width();
			canvas.height = $('.ui-content').height();
			//console.log(canvas.width,canvas.height);
			
			var iWidth = canvas.width/50;
			//console.log(iWidth);
			
			window.iBoxWidth = iWidth;
			
			var context = canvas.getContext('2d');
			if(context){
				context.strokeStyle = "white";
				context.lineWidth = 1;
				
				var x = 0;
				var y = 0;
				for(var i = 0; i < 50; i++){
					context.strokeRect(x,y,iWidth,iWidth);
					for(var j = 0; j < 50; j++){
						y = y + iWidth;
						context.strokeRect(x,y,iWidth,iWidth);
					}
					x = x + iWidth;
					y = 0;
				}
			}
		}
	},
	// onclick Building Nav toggle Swiper for chose Building Tools
	toggleBuildSwiper: function(){
		console.log('initBuildSwiper');
		
		if($('.swiper-container').hasClass('hidden')){
			console.log('Tools aktivieren');
			$('.swiper-container').removeClass('hidden');
			
			// initialize Swiper when not done
			if(!$('.swiper-container')[0].swiper){
				console.log('init Swiper');
				var mySwiper = new Swiper ('.swiper-container', {
					// Optional parameters
					slidesPerView: 5,
					direction: 'horizontal',
					
					// If we need pagination
					pagination: '.swiper-pagination',
					
					// Navigation arrows
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev',
					
					// And if we need scrollbar
					scrollbar: '.swiper-scrollbar',
					
					onClick: function(swiper,event){
						if(swiper.clickedSlide){
							var oItem = $(swiper.clickedSlide).find('.buildItem');
							var oNewItem = $(oItem).clone();
							$(oNewItem).css('position','absolute');
							
							//start position: half window boxes length - half item boxes length
							var xStart = window.iBoxWidth*25 - window.iBoxWidth*2;
							var yStart = window.iBoxWidth*25 - window.iBoxWidth*2;
							console.log(xStart,yStart);
							$(oNewItem).css('left',xStart);
							$(oNewItem).css('top',yStart);
							
							$(oNewItem).addClass('pep');
							$(oNewItem).appendTo('#farmContent');
							
							$('.pep').pep({
								grid: [window.iBoxWidth,window.iBoxWidth],
								shouldEase: false,
								useCSSTranslation: false,
								constrainTo: 'parent'
							});
							
							$('.swiper-container').addClass('hidden');
							
							var oButton = $('#confirmButton').removeClass('hidden');
							$(oNewItem).append(oButton);
							
							$(oButton).on('click',function(e){
								$.pep.unbind($(this).parent());
								$(this).parent().removeClass('pep');
								$(this).addClass('hidden');
							});
						}
					}
				});
			}
		}
		else{
			console.log('Tools deaktivieren');
			$('.swiper-container').addClass('hidden');
		}
	},
	// set Click Events after window is loaded
	setClickEvents: function(){
		console.log('setClickEvents');
		
		
		/*
		//Das Objekt, das gerade bewegt wird.
		var dragobjekt = null;

		// Position, an der das Objekt angeklickt wurde.
		var dragx = 0;
		var dragy = 0;

		// Mausposition
		var posx = 0;
		var posy = 0;

		function draginit() {
		 // Initialisierung der Überwachung der Events

		  document.onmousemove = drag;
		  document.onmouseup = dragstop;
		}

		function dragstart(element) {
		   //Wird aufgerufen, wenn ein Objekt bewegt werden soll.

		  dragobjekt = element;
		  dragx = posx - dragobjekt.offsetLeft;
		  dragy = posy - dragobjekt.offsetTop;
		}

		function dragstop() {
		  //Wird aufgerufen, wenn ein Objekt nicht mehr bewegt werden soll.

		  dragobjekt=null;
		}

		function drag(ereignis) {
		  //Wird aufgerufen, wenn die Maus bewegt wird und bewegt bei Bedarf das Objekt.

		  posx = document.all ? window.event.clientX : ereignis.pageX;
		  posy = document.all ? window.event.clientY : ereignis.pageY;
		  if(dragobjekt != null) {
			dragobjekt.style.left = (posx - dragx) + "px";
			dragobjekt.style.top = (posy - dragy) + "px";
		  }
		}
		*/
	}
	
};
