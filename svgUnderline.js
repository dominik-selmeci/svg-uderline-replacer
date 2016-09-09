(function(global, document) {
	'use strict';

	var svgUnderline = {
		strokeWidth: null,
	};


	svgUnderline.baselineRatio = function(fontFamily) {
		// The container is a little defenseive.
		var container = document.createElement('div');
		container.style.display = "block";
		container.style.position = "absolute";
		container.style.bottom = "0";
		container.style.right = "0";
		container.style.width = "0px";
		container.style.height = "0px";
		container.style.margin = "0";
		container.style.padding = "0";
		container.style.visibility = "hidden";
		container.style.overflow = "hidden";
		container.style.fontFamily = fontFamily;

		// Intentionally unprotected style definition.
		var small = document.createElement('span');
		var large = document.createElement('span');

		// Large numbers help improve accuracy.
		small.style.fontSize = "0px";
		large.style.fontSize = "2000px";

		small.innerHTML = "X";
		large.innerHTML = "X";

		container.appendChild(small);
		container.appendChild(large);

		// Put the element in the DOM for a split second.
		document.body.appendChild(container);
		var smalldims = small.getBoundingClientRect();
		var largedims = large.getBoundingClientRect();

		document.body.removeChild(container);

		// Calculate where the baseline was, percentage-wise.
		var baselineposition = smalldims.top - largedims.top;
		var height = largedims.height;

		return 1 - (baselineposition / height);
	};


	svgUnderline.optimalStrokeWidthPos = function(strokeWidth, posY) {
	    if ( strokeWidth < 1) {
	        posY = Math.round(posY - 0.5) + 0.5;
	    } else if ( strokeWidth >= 1 ) {
	        strokeWidth = Math.round( strokeWidth );
	        if ( strokeWidth % 2 ){
	            // odd, posY -> 0.5
	            posY = Math.round(posY - 0.5) + 0.5;
	        } else {
	            // even, posY -> 1
	            posY = Math.round(posY);
	        }
	    }

	    return {
	        strokeWidth: strokeWidth,
	        posY: posY
	    };
	};


	svgUnderline.underlinePositionRatio = function(element) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext('2d');

		var elStyles = getComputedStyle(element);
		var fontSize = parseFloat(elStyles.fontSize);
		var elBBox = element.getBBox();

		var ratio = 1; //window.devicePixelRatio

	    ctx.font = elStyles.fontStyle + ' ' + fontSize + 'pt ' + elStyles.fontFamily;

	    // determine the text-underline-width / strokeWidth
	    var dotWidth = ctx.measureText('.').width;

	    // calculate the optimized width based on font
	    this.strokeWidth = dotWidth/12;

	    // calculate the optimized width based on font
	    var underlinePosition = elBBox.height * ratio *
	            ( 1 - this.baselineRatio(elStyles.fontFamily) + 
	            this.baselineRatio(elStyles.fontFamily) * 0.4) +
	            this.strokeWidth/2;

	    var optimalStrWidPos = this.optimalStrokeWidthPos(this.strokeWidth, underlinePosition);
	    this.strokeWidth = optimalStrWidPos.strokeWidth;
	    underlinePosition = optimalStrWidPos.posY;

	    return (1 - underlinePosition / elBBox.height);
	};


	svgUnderline.replace = function(elem) {
		var elStyles = getComputedStyle(elem);
		var underlineRatio = this.underlinePositionRatio(elem);
		var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		
		if (elem.style.textDecoration !== 'underline') {
			return false;
		}

		var elBBox = elem.getBBox();
		rect.setAttribute('x', elBBox.x);
		rect.setAttribute('y', elBBox.y + elBBox.height - elBBox.height * underlineRatio - this.strokeWidth);
		rect.setAttribute('width', elBBox.width);
		rect.setAttribute('height', this.strokeWidth);
		
		rect.style.fill = elStyles.color;

		var parent = elem.parentNode;
		
		elem.style.textDecoration = 'none';
		parent.appendChild(rect);
	};

	svgUnderline.replaceAll = function(elements) {
		var n = elements.length;

		for (var i=0; i<n; i++) {
			this.replace(elements[i]);
		}
	};

	global.svgUnderline = svgUnderline;

}(window, document));