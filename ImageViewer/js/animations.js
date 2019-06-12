var ppiAnim;
var rhiAnim;
var all_winds_anim;
var wind_mag_anim;

$( window ).resize(function() {
	ppiAnim.updateSize();
	rhiAnim.updateSize();
	all_winds_anim.updateSize();
	wind_mag_anim.updateSize();
});

// This is the main function. It initalizes the date, and all the animation objects
$(function () {
	$('[data-toggle="tooltip"]').tooltip({
		trigger : 'hover'
	});
	$('.popover-dismiss').popover({
		trigger: 'hover'
	});
	
	var today_date = new Date()
	var anim_date = today_date.toISOString().split('T')[0]; // Gets todays date
	updateAnimations(anim_date);

    $( "#datepicker" ).datepicker({
			"dateFormat":"yy-mm-dd",
			"onSelect":function(selected_date){
				updateAnimations(selected_date);
			}
		});
    $( "#datepicker" ).datepicker("setDate",anim_date);

	ppiAnim = new Animation([], 'ppi_canvas', 'ppiAnim');
	rhiAnim = new Animation([], 'rhi_canvas', 'rhiAnim');
	all_winds_anim = new Animation([], 'all_winds_canvas', 'all_winds_anim');
	wind_mag_anim = new Animation([], 'wind_mag_canvas', 'wind_mag_anim');
});

function updateAnimations(anim_date){
	console.log("Updating animation with date: "+anim_date+"...");

	var cur_path = window.location.href;
	cur_path = cur_path.replace("index.php","")

	var url = cur_path+'getImages.php?date='+anim_date;
	d3.json(url).then(function(img_names){ 
		console.log("Received files:"+img_names);
		// This object contains the names of the PPI images
		var ppiNames = filterNames(img_names, 'PPI');
		var rhiNames = filterNames(img_names, 'RHI');
		var all_winds_Names = filterNames(img_names, 'Allvel');
		var wind_mag_Names = filterNames(img_names, 'Magnitude');
					
		ppiAnim.updateDates(ppiNames);
		rhiAnim.updateDates(rhiNames);
		all_winds_anim.updateDates(all_winds_Names);
		wind_mag_anim.updateDates(wind_mag_Names);

	});
}

function toggledisplay(elementID)
{
	(function(style) {
		style.display = style.display === 'none' ? '' : 'none';
	})(document.getElementById(elementID).style);
}

image_type = "jpg";                   //"gif" or "jpg" or whatever your browser can display

first_image_name = 0;     //Representa el nombre de la primer imagen
first_image = 0;                      //first image number
speed_text = 0;
var inicioPlayfwd = false;    //Controla la animacion si esta en play o en stop
var inicioPlayBkw = false;    //Controla la animacion cuando esta en reversa

//=== THE CODE STARTS HERE - no need to change anything below ===
//=== global variables ====
var theImages = new Array();
normal_delay = 1000;
delay = normal_delay;  //delay between frames in 1/100 seconds
delay_step = 10;
delay_max = 30000;
delay_min = 1;
current_image = first_image;     //number of the current image
timeID = null;
status = 1;            // 0-stopped, 1-playing
play_mode = 1;         // 0-normal, 1-loop, 2-swing
size_valid = 0;
var loadCount = 1;
var last_image_;
var lewidth;
var leheight;

speed_text = 1;


function scalePreserveAspectRatio(imgW,imgH,maxW,maxH){
//	console.log(imgW,",",imgH,",",maxW,",",maxH);
    return(Math.min((maxW/imgW),(maxH/imgH)));
}

function naturalCompare(a, b) {
	var ax = [], bx = [];
	
	a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
	b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
	
	while(ax.length && bx.length) {
		var an = ax.shift();
		var bn = bx.shift();
		var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
		if(nn) return nn;
	}
	
	return ax.length - bx.length;
}