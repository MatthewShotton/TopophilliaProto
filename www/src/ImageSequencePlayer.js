export default class ImageSequencePlayer{
	constructor(image_urls, vc){
		this.images = [];
		this.canvas = document.createElement("canvas");
		this.canvas.width = 960; 
		this.canvas.height = 540; 
		this.ctx = this.canvas.getContext("2d");
		this._progress = 0.0;
		this._previousIndex  = 0;
		this._blurAmount = 0.5;
		this._blurCounter = 0;
		
		for (let url of image_urls) {
			let img = new Image();
			img.src = url;
			this.images.push(img);
		}
		this._node = vc.createCanvasSourceNode(this.canvas);
		let _this = this;
		this.images[0].onload= function(){
			_this.ctx.drawImage(_this.images[0],0,0);
		}
	}


	set progress(progress){
		this._progress = progress;
		let index = Math.abs(Math.round((progress * this.images.length)%(this.images.length-1)));
		

		/*if (this._blurCounter < 1.0){
			this._blurCounter += this._blurAmount;
		}

		if (this._previousIndex !== index){
			this._blurCounter =0.0;
		}
		if (this._blurCounter > 1.0){
			this._blurCounter = 0.0;
		}else{
			this.ctx.globalAlpha = this._blurAmount;
			this.ctx.drawImage(this.images[index],0,0);
		}*/

		if(this._previousIndex !== index){
			this.ctx.globalAlpha = 1.0;
			//this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
			this.ctx.drawImage(this.images[index],0,0);
		}
		this._previousIndex = index;


	}

	get progress(){
		return this._progress;
	}

	get node(){
		return this._node;
	}

}