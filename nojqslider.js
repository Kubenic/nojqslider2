// Thanks Christophe Porteneuve  -- bit.ly/jsyoulove
// Fonction Throttle : stop l'appel à la fonction selon un délai
var throttle = function (fx, minInterval) { 
  var latestCall;

  return function throttled() {
    var now = Date.now();
    if (latestCall + minInterval > now) {
      return;
    }
    latestCall = now;
    var result = fx.apply(this, arguments);
    // Pour un debounce, on mettrait à jour latestCall ici plutôt.
    return result;
  	}

}

/* Fonction Debounce : reset un appel de fonction après un délai  */
var debounce = function (fx, delay, immediate){
	var that = this,
		timeout;

	 return function debounced(){
	 	var context = this, arg = arguments;

	 	var later = function(){
	 		timeout = null;
	 		if (!immediate) fx.apply(context, arg);
	 	};

	 	var callNow = immediate &&  !timeout;
	 	clearTimeout(timeout);
	 	timeout = setTimeout(later, delay);
	 	if (callNow) fx.apply(context, arg);
	 };

}

/* Fonction Debounce : reset un appel de fonction après un délai  */
var debounce = function (fx, delay, immediate){
	var that = this,
		timeout;

	 return function debounced(){
	 	var context = this, arg = arguments;

	 	var later = function(){
	 		timeout = null;
	 		if (!immediate) fx.apply(context, arg);
	 	};

	 	var callNow = immediate &&  !timeout;
	 	clearTimeout(timeout);
	 	timeout = setTimeout(later, delay);
	 	if (callNow) fx.apply(context, arg);
	 };

}

function NoJQSlider(container,options){
	this.container = document.querySelector(container);
	this.prepareDomItems();
	this.size = options.size;
	this.animationStarted = false;
	this.bindingStarted = false;
	this.timespeed = options.timespeed || 5000;
	this.positionNumber = 0;
	if (options.isAjax){
		if(options.ajaxUrl){

			this.ajaxCall.send(options.ajaxUrl,function(e){
				this.prepareDOMForAjax(e);
			}.bind(this));
		}
	}
	this.options = options;
	return this.prototype;
}


NoJQSlider.prototype = {
	constructor : NoJQSlider,
	ajaxCall : {
		xhr : new XMLHttpRequest(),
		send : function(url, callback){
			this.xhr.open("GET", url);
			this.xhr.addEventListener("load", callback);
			this.xhr.send(null);
		}
	},
	checkIfImageLoaded : function(){
		if(!this.totalImagesCount){
			this.totalImagesCount = this.sliderDom.imageContainer.children.length;
		}	
		if(!this.imagesLoadedCount){
			this.imagesLoadedCount = 0;
		}

		this.imagesLoadedCount++;
		if(this.imagesLoadedCount == this.totalImagesCount){

			this.makeThemResponsive();
			
		}
	},
	resetActivePosition : function(){
		this.sliderDom.imageContainer.style.transform = "translate3d("+((this.container.clientWidth * this.positionNumber) * -1)+"px,"+0+","+0+")"
		this.sliderDom.imageContainer.style.transitionProperty = "transform";
		this.sliderDom.imageContainer.style.transitionDuration = (this.timespeed/1000)+"s";
	},
	makeThemResponsive : throttle(function(e){
			/*if(typeof(e) !== "undefined"){
				if(e.target){
					this.container.style.width = "100%";	
				}
			}*/
			if(this.animationStarted){
				this.stopAnimation();
				
			}
			//this.container.style.width = ( this.size.width || this.container.clientWidth ) +"px";
			this.container.style.width = this.container.parentElement.clientWidth +"px";
			this.sliderDom.imageContainer.style.width = this.container.clientWidth * this.sliderDom.imageContainer.children.length +"px";
			this.container.style.height = (this.size.height || this.container.parentElement.clientHeight)+"px";
			this.container.style.overflow = "hidden";
			
			for(var i = 0; i < this.sliderDom.imageContainer.children.length; i++){
				this.sliderDom.imageContainer.children[i].style.width = this.container.clientWidth + "px";
				this.sliderDom.imageContainer.children[i].style.height = this.container.clientHeight + "px";
				this.sliderDom.imageContainer.children[i].style.overflow = "hidden";
				this.sliderDom.imageContainer.children[i].style.position = "relative";
				this.sliderDom.imageContainer.children[i].style.display = "inline-block";
				this.sliderDom.imageContainer.children[i].style.verticalAlign = "top";
				
				this.sliderDom.imageContainer.children[i].firstElementChild.style.width = this.container.clientWidth + "px";
				this.sliderDom.imageContainer.children[i].firstElementChild.style.height = "auto";
				
				//si image ne prend pas toute la hauteur du bloc : on change de méthode
				if(this.sliderDom.imageContainer.children[i].firstElementChild.clientHeight < this.sliderDom.imageContainer.children[i].clientHeight){
					this.sliderDom.imageContainer.children[i].firstElementChild.style.minHeight = this.container.clientHeight + "px";
					this.sliderDom.imageContainer.children[i].firstElementChild.style.minWidth = "100%";
				}
				
				//centre l'image dans son parent
				
				this.sliderDom.imageContainer.children[i].firstElementChild.style.position = "absolute";
				this.sliderDom.imageContainer.children[i].firstElementChild.style.top = (((this.sliderDom.imageContainer.children[i].firstElementChild.clientHeight - this.sliderDom.imageContainer.children[i].clientHeight) /2 ) *-1 ) + "px";
				this.sliderDom.imageContainer.children[i].firstElementChild.style.left = (((this.sliderDom.imageContainer.children[i].firstElementChild.clientWidth - this.sliderDom.imageContainer.children[i].clientWidth) /2)  *-1) + "px";
			}
			this.resetActivePosition();
			if(!this.animationStarted){
				this.startAnimation();
			}
			if(!this.bindingStarted){
				this.startBinding();
			}
	},50),
	prepareDomItems: function(){
		// méthode pour préparer tout les éléments du DOM que l'ont aurais besoins
		// pour organiser le dom
		this.sliderDom = {};

		//Préparation des containers
		this.sliderDom.imageContainer = document.createElement("div");
		this.sliderDom.titleDescContainer = document.createElement("div");
		this.sliderDom.titleContainer = document.createElement("div");
		this.sliderDom.navContainer = document.createElement("div");
		this.sliderDom.dotsContainer = document.createElement("div");
		this.sliderDom.controlsContainer = document.createElement("div");

		//Préparation des modèles d'items pour les containers
		this.sliderDom.imageItem = document.createElement("div");
		this.sliderDom.imageDOM = document.createElement("img");
		this.sliderDom.titleItem = document.createElement("p");
		this.sliderDom.descriptionItem = document.createElement("p");
		this.sliderDom.dotItem = document.createElement("div");
		this.sliderDom.nextItem = document.createElement("div");
		this.sliderDom.prevItem = document.createElement("div");

		//ajout des classes pour les triggers
		this.container.classList.add("nojqcontainer")
		this.sliderDom.imageContainer.classList.add("nojqimgcontainer");
		this.sliderDom.titleDescContainer.classList.add("nojqtitledesccontainer");
		this.sliderDom.titleContainer.classList.add("nojqtitlecontainer");
		this.sliderDom.navContainer.classList.add("nojqnavcontainer");
		this.sliderDom.dotsContainer.classList.add("nojqdotscontainer");
		this.sliderDom.controlsContainer.classList.add("nojqcontrolscontainer");
		this.sliderDom.descriptionItem.classList.add("nojqdescriptionitem");
		this.sliderDom.nextItem.classList.add("nojqnextitem");
		this.sliderDom.prevItem.classList.add("nojqprevitem");

		this.sliderDom.imageItem.classList.add("nojqimageitem");
		this.sliderDom.titleItem.classList.add("nojqtitleitem");
		this.sliderDom.titleItem.classList.add("nojqdescriptionitem");
		this.sliderDom.dotItem.classList.add("nojqdotItem");

	},


	prepareDOMForAjax : function(e){
		//méthode qui organise le DOM du slider en fonction des éléments dans le DOM.
		//on parse réupéré de l'AJAX
		this.JSONResponse = JSON.parse(e.target.response);
		
		//on vérifie le modèle de donée 
		//s'il n'existe pas, on utilise le modèle par défault
		//il servira pour l'organisation du DOM
		if(options.ajaxDataModel){
			this.JSONDataModel = options.ajaxDataModel;
		}else{
			this.JSONDataModel = {
				image : "image",
				title : "title",
				description : "description"
			};
		}

		// Pour chaque éléments on crée la fiche correspondante
		this.JSONResponse.forEach(function(element){
			//Clone les éléments du DOM pour créer la structure de chaque fiche
			var image = this.sliderDom.imageDOM.cloneNode(true),
			imageItem = this.sliderDom.imageItem.cloneNode(true),
			titleItem = this.sliderDom.titleItem.cloneNode(true),
			descriptionItem = this.sliderDom.descriptionItem.cloneNode(true),
			titleContainer = this.sliderDom.titleContainer.cloneNode(true),
			dot = this.sliderDom.dotItem.cloneNode(true);
			
			//on assigne les données au éléments
			image.src = element[this.JSONDataModel.image];
			titleItem.innerHTML = element[this.JSONDataModel.title];
			descriptionItem.innerHTML = element[this.JSONDataModel.description];
			
			//on range dans les parents respectifs
			imageItem.appendChild(image);
			this.sliderDom.imageContainer.appendChild(imageItem);
			titleContainer.appendChild(titleItem);
			titleContainer.appendChild(descriptionItem);
			this.sliderDom.titleDescContainer.appendChild(titleContainer);
			this.sliderDom.dotsContainer.appendChild(dot);

		}.bind(this));

		//on envoie au container
		this.sliderDom.controlsContainer.appendChild(this.sliderDom.prevItem);
		this.sliderDom.controlsContainer.appendChild(this.sliderDom.nextItem);
		this.sliderDom.controlsContainer.appendChild(this.sliderDom.dotsContainer);
		this.container.appendChild(this.sliderDom.imageContainer);
		this.container.appendChild(this.sliderDom.titleDescContainer);
		this.container.appendChild(this.sliderDom.controlsContainer);
		
		//on lance le responsive des éléments
		for(var i = 0; i < this.sliderDom.imageContainer.children.length; i++){
			this.sliderDom.imageContainer.children[i].dataset.selected = "";
			this.sliderDom.imageContainer.children[i].children[0].addEventListener('load',function(){
				this.checkIfImageLoaded();
			}.bind(this));
		}
		
		//this.sliderDom.imageContainer.children[0].children[0].addEventListener('load',function(){this.makeThemResponsive()}.bind(this));
		//this.makeThemResponsive();
		//on lance la méthode de binding et d'animation
		//this.startBinding();
	},
	nextAnimation: function(event) {
		this.stopAnimation();
		if(!this.sliderDom.imageContainer.children[this.positionNumber].nextElementSibling){
			this.sliderDom.imageContainer.style.transitionProperty = "inherit";
			this.sliderDom.imageContainer.style.transitionDuration = "0s";
			this.positionNumber = this.positionNumber - 1;
			this.sliderDom.imageContainer.style.transform = "translate3d("+((this.container.clientWidth * this.positionNumber) * -1)+"px,"+0+","+0+")";
			this.sliderDom.imageContainer.appendChild(this.sliderDom.imageContainer.firstChild);
		}
		this.positionNumber++;
		this.sliderDom.imageContainer.style.transform = "translate3d("+((this.container.clientWidth * this.positionNumber) * -1)+"px,"+0+","+0+")"
		this.sliderDom.imageContainer.style.transitionProperty = "transform";
		this.sliderDom.imageContainer.style.transitionDuration = (this.timespeed/1000)+"s";
		if(!this.animationStarted){
			this.startAnimation();	
		}
		

	},
	prevAnimation: function(event) {
		this.stopAnimation();
		if(!this.sliderDom.imageContainer.children[this.positionNumber].nextElementSibling){
			this.sliderDom.imageContainer.style.transitionProperty = "inherit";
			this.sliderDom.imageContainer.style.transitionDuration = "0s";
			this.sliderDom.imageContainer.style.transform = "translate3d("+((this.container.clientWidth) * 1)+"px,"+0+","+0+")";
			this.sliderDom.imageContainer.insertBefore(this.sliderDom.imageContainer.firstChild);
		}
		this.sliderDom.imageContainer.style.transform = "translate3d("+((this.container.clientWidth) * 1)+"px,"+0+","+0+")"
		this.sliderDom.imageContainer.style.transitionProperty = "transform";
		this.sliderDom.imageContainer.style.transitionDuration = (this.timespeed/1000)+"s";
		this.sliderDom.imageContainer.insertBefore(this.sliderDom.imageContainer.lastChild, this.sliderDom.imageContainer.firstChild);
		if(!this.animationStarted){
			this.startAnimation();	
		}
	},
	startAnimation: function() {
		this.interval = window.setInterval(
			function(){
				this.sliderDom.imageContainer.children[this.positionNumber].dataset.selected = "";
				this.positionNumber++;
				this.sliderDom.imageContainer.style.transform = "translate3d("+((this.container.clientWidth * this.positionNumber) * -1)+"px,"+0+","+0+")"
				this.sliderDom.imageContainer.style.transitionProperty = "transform";
				this.sliderDom.imageContainer.style.transitionDuration = (this.timespeed/1000)+"s";
				this.sliderDom.imageContainer.children[this.positionNumber].dataset.selected = "true";
				if(!this.sliderDom.imageContainer.children[this.positionNumber].nextElementSibling){
					window.setTimeout(function(){
						this.sliderDom.imageContainer.style.transitionProperty = "inherit";
						this.sliderDom.imageContainer.style.transitionDuration = "0s";
						this.positionNumber = this.positionNumber - 1;
						this.sliderDom.imageContainer.style.transform = "translate3d("+((this.container.clientWidth * this.positionNumber) * -1)+"px,"+0+","+0+")";
						this.sliderDom.imageContainer.appendChild(this.sliderDom.imageContainer.firstChild);
					}.bind(this),this.timespeed);
				}
			}.bind(this),
			this.timespeed*2);
			this.animationStarted = true;
	},
	
	stopAnimation : function(){
		window.clearInterval(this.interval);
		this.animationStarted = false;
	},
	
	startBinding : function(){
		this.sliderDom.nextItem.addEventListener('click', function(event){
			this.nextAnimation(event);
		}.bind(this));
		this.sliderDom.prevItem.addEventListener('click', function(event){
			this.prevAnimation(event);
		}.bind(this));
		window.addEventListener('resize',function(e){
			this.makeThemResponsive();
		}.bind(this));
	}
};
