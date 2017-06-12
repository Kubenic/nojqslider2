function NoJQSlider(container,options){
	this.container = document.querySelector(container);
	this.prepareDomItems();
	this.timespeed = options.timespeed || 5000;
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
	makeThemResponsive : function(){
			this.sliderDom.imageContainer.style.fontSize = "0";
			for(var i = 0; i < this.sliderDom.imageContainer.children.length; i++) {
				this.sliderDom.imageContainer.children[i].children[0].style.width = "100%";
				this.sliderDom.imageContainer.children[i].children[0].style.height = "auto";
				this.sliderDom.imageContainer.children[i].style.display = "inline-block";
				this.sliderDom.imageContainer.children[i].style.verticalAlign = "top";
				this.sliderDom.imageContainer.children[i].style.width = this.sliderDom.imageContainer.children[i].children[0].clientWidth + "px";
			}
			this.sliderDom.imageContainer.style.width = this.sliderDom.imageContainer.children[0].clientWidth * this.sliderDom.imageContainer.children.length + "px";
			this.container.style.width = this.sliderDom.imageContainer.children[0].children[0].clientWidth + "px";
			this.container.style.height = this.sliderDom.imageContainer.children[0].children[0].clientHeight + "px";
			this.container.style.overflow = "hidden";
	},
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
		this.sliderDom.imageContainer.classList.add("nojqimgcontainer");
		this.sliderDom.titleDescContainer.classList.add("nojqtitledesccontainer");
		this.sliderDom.titleContainer.classList.add("nojqtitlecontainer");
		this.sliderDom.navContainer.classList.add("nojqnavcontainer");
		this.sliderDom.dotsContainer.classList.add("nojsdotscontainer");
		this.sliderDom.controlsContainer.classList.add("nojscontrolscontainer");
		this.sliderDom.descriptionItem.classList.add("nojqdescriptionitem");
		this.sliderDom.nextItem.classList.add("nojqnextitem");
		this.sliderDom.prevItem.classList.add("nojqnprevitem");

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
			let image = this.sliderDom.imageDOM.cloneNode(true),
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
		this.makeThemResponsive();
		//on lance la méthode de binding et d'animation
		this.startBinding();
	},
	startBinding : function(){
		//this.siderDom.imageItem
		   this.sliderDom.imageContainer.style.transitionDuration = (this.timespeed / 1000) + "s";
		   this.sliderDom.imageContainer.style.transitionProperty = "all";
			setInterval(function () {
				this.sliderDom.imageContainer.style.transitionProperty = "all";
				this.sliderDom.imageContainer.style.MozTransform = 'translate(-'+this.container.clientWidth+'px, 0)';
			
			setTimeout(function(){
				this.sliderDom.imageContainer.style.transitionProperty = "inherit";
				this.sliderDom.imageContainer.appendChild(this.sliderDom.imageContainer.firstChild);
				this.sliderDom.imageContainer.style.MozTransform = 'translate(0px, 0)'; 
			}.bind(this),this.timespeed);   

		
                
            }.bind(this), this.timespeed*2);

	}
};
