function refreshSwatch() {

    //-- Trigger change -- Another Watch needed
   
    var scope = angular.element($('#equity_value').get(0)).scope()
    scope.keyfacts.income = $("#equity").slider("value");
    scope.$apply();
    
    var scope2 = angular.element($('#monthly_value').get(0)).scope()
    scope2.keyfacts.rent = $("#monthly").slider("value");
    scope2.$apply();
    
    var scope3 = angular.element($('#occupancy_value').get(0)).scope()
    scope3.keyfacts.occupancy = $("#occupancy").slider("value");
    scope3.$apply();
    
    var scope4 = angular.element($('#property_value').get(0)).scope()
    scope4.keyfacts.property = $("#property").slider("value");
    scope4.$apply();
    
    var scope5 = angular.element($('#bills_value').get(0)).scope()
    scope5.keyfacts.bills = $("#bills").slider("value");
    scope5.$apply();
    
    var scope6 = angular.element($('#investment_value').get(0)).scope()
    scope6.keyfacts.investment = $("#investment").slider("value");
    scope6.$apply();
    
    var equity = $("#equity").slider("value")*100,
        monthly = $("#monthly").slider("value"),
		occupancy = $("#occupancy").slider("value"),
		bills = $("#bills").slider("value"),
		highlight = occupancy + bills,
		lowlight = occupancy - bills,
		superLowlight = occupancy - bills * 1.5,
		gradientTop = "hsl("+equity+", "+monthly+"%, "+highlight+"%)",
		gradientBottom = "hsl("+equity+", "+monthly+"%, "+lowlight+"%)",
		borderBottom = "hsl("+equity+", "+monthly+"%, "+superLowlight+"%)",
		hsl = "hsl("+70+", "+70+"%, "+70+"%)",
		highhex = hsl2Hex(equity, monthly, highlight),
		lowhex = hsl2Hex(equity, monthly, lowlight),
		text = getTextColor(occupancy, bills),
		css = generateHSLGradient(hsl, gradientTop, gradientBottom, borderBottom, text, highhex, lowhex),
		embeddedCss = ".btn-custom {\n"+css+"}";
	//	$("button.custom").not('.sample').attr('style', css);
		$(".ui-slider-range").css("background", hsl);
	
    //	$('#embedded_css').html(embeddedCss);
	
        $('.ui-slider-handle').each(function(){
			var v = $(this).parents('div').slider("value");
			var i = $(this).parents('div').attr('id');
			$("#"+i+"_value").text(v);
		});
}

function getTextColor(lightness, puffiness){
	if(parseInt(lightness) < 50){
		return "color: #fff !important;\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0."+shadowAlpha(puffiness)+");\n  -webkit-font-smoothing: antialiased;"
	} else {
		return "color: #333 !important;\n  text-shadow: 0 1px 1px rgba(255, 255, 255, 0."+shadowAlpha(puffiness)+");\n  -webkit-font-smoothing: antialiased;"
	};
}

function shadowAlpha(puffiness){
	var a = parseInt(3.3*puffiness);
	if(a<10){a="0"+a};
	return a;
}

function generateHSLGradient(hsl, highlight, lowlight, superLowlight, text, highhex, lowhex) {
  // return '  background-color: ' + lowlight + ' !important;\n\
  //   background-repeat: repeat-x;\n\
  //   filter: progid:DXImageTransform.Microsoft.gradient(startColorStr="'+highhex+'", endColorStr="'+lowhex+'");\n\
  //   background-image: -khtml-gradient(linear, left top, left bottom, from('+highlight+'), to('+lowlight+'));\n\
  //   background-image: -moz-linear-gradient(top, '+highlight+', '+lowlight+');\n\
  //   background-image: -ms-linear-gradient(top, '+highlight+', '+lowlight+');\n\
  //   background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, '+highlight+'), color-stop(100%, '+lowlight+'));\n\
  //   background-image: -webkit-linear-gradient(top, '+highlight+', '+lowlight+');\n\
  //   background-image: -o-linear-gradient(top, '+highlight+', '+lowlight+');\n\
  //   background-image: linear-gradient('+highlight+', '+lowlight+');\n\
  //   border-color: '+lowlight+' '+lowlight+' '+superLowlight+';\n\
  //   '+text+'\n';
  //  filter: progid:DXImageTransform.Microsoft.gradient(startColorStr="'+highhex+'", endColorStr="'+lowhex+'");\n\ // replaced with hack below
	return '  background-color: ' + lowlight + ' !important;\n\
  background-repeat: repeat-x;\n\
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="'+highhex+'", endColorstr="'+lowhex+'");\n\
  background-image: -khtml-gradient(linear, left top, left bottom, from('+highhex+'), to('+lowhex+'));\n\
  background-image: -moz-linear-gradient(top, '+highhex+', '+lowhex+');\n\
  background-image: -ms-linear-gradient(top, '+highhex+', '+lowhex+');\n\
  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, '+highhex+'), color-stop(100%, '+lowhex+'));\n\
  background-image: -webkit-linear-gradient(top, '+highhex+', '+lowhex+');\n\
  background-image: -o-linear-gradient(top, '+highhex+', '+lowhex+');\n\
  background-image: linear-gradient('+highhex+', '+lowhex+');\n\
  border-color: '+lowhex+' '+lowhex+' '+superLowlight+';\n\
  '+text+'\n';
}

function hsl2Hex(h, s, l) {
  var m1, m2, hue;
  var r, g, b
  s /=100;
  l /= 100;
  if (s == 0)
    r = g = b = (l * 255);
  else {
    if (l <= 0.5)
      m2 = l * (s + 1);
    else
      m2 = l + s - l * s;
    m1 = l * 2 - m2;
    hue = h / 360;
    r = HueToRgb(m1, m2, hue + 1/3);
    g = HueToRgb(m1, m2, hue);
    b = HueToRgb(m1, m2, hue - 1/3);
  }
  return "#"+hexify(r) + hexify(g) + hexify(b);
}

function hexify(i){
  var hex = parseInt(i).toString(16);
  if(hex.length == 1){hex="0"+hex};
  return hex;
}

function HueToRgb(m1, m2, hue) {
  var v;
  
 if (hue < 0)
    hue += 1;
  else if (hue > 1)
    hue -= 1;
 
    
if (6 * hue < 1)
    v = m1 + (m2 - m1) * hue * 6;
  else if (2 * hue < 1)
    v = m2;
  else if (3 * hue < 2)
    v = m1 + (m2 - m1) * (2/3 - hue) * 6;
  else
    v = m1;
  return 255 * v;
}


$(function() {
	refreshSwatch();
	
    
    $("#property").slider({
		range: "min",
		max: 1000000,
		value: 400000,
		step: 10000,
        slide: refreshSwatch,
		change: refreshSwatch
	});
    
    $("#equity").slider({
		range: "min",
		max: 50,
		value: 12,
		slide: refreshSwatch,
		change: refreshSwatch
	});
	$("#monthly").slider({
		range: "min",
		max: 4000,
		value: 3000,
		step: 50,
        slide: refreshSwatch,
		change: refreshSwatch
	});
	$("#occupancy").slider({
		range: "min",
		max: 110,
		value: 100,
		step: 5,
        slide: refreshSwatch,
		change: refreshSwatch
	});
	$("#bills").slider({
		range: "min",
		max: 1000,
		value: 300,
        step: 10,
       slide: refreshSwatch,
		change: refreshSwatch
	});
    
    $("#investment").slider({
		range: "min",
		max: 100,
		value: 25,
        step: 5,
       slide: refreshSwatch,
		change: refreshSwatch
	});
    
   
	$( "#occupancy" ).slider( "value", 100 );
});
