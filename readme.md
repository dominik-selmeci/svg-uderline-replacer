# Simple SVG underline replacer

This library replaces SVG text underline to rectangle underline. 

**It's useful when you try to convert SVG to PDF texts with underline by programs like Inkscape, CairoSVG and so on.** 

It replaces only simple <text> without any transformation and with no multiple <tspan>.

## Usage

Include in header:
<script src="svgUnderline.js"></script>

### svgUnderline.replaceAll(elements)
var texts = document.querySelectorAll('svg text');
svgUnderline.replaceAll(texts);

### svgUnderline.replace(element)
var texts = document.querySelector('svg text');
svgUnderline.replace(text);