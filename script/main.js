var currentTool = 'appicon';  //is appicon or appsplash  //https://jscompress.com/
var quality = 0.92; 
var android_round = 0.1754;
var isDownloadZip = true; 
var downloadFiles = [];
var imgobj = new Image(); 

currentTool = getQueryParamVal('tool') != 'appsplash' ? 'appicon': 'appsplash';

init();

function init(){
	document.addEventListener('drop', function (e) {
		e.preventDefault()
	}, false);

	document.addEventListener('dragover', function (e) {
		e.preventDefault()
	}, false);
	
	window.addEventListener('load', function() {
		// Fetch all the forms we want to apply custom Bootstrap validation styles to
		var forms = document.getElementsByClassName('needs-validation');
		// Loop over them and prevent submission
		var validation = Array.prototype.filter.call(forms, function(form) {
		  form.addEventListener('submit', function(event) {
			if (form.checkValidity() === false) {
			  event.preventDefault();
			  event.stopPropagation();
			  form.classList.add('was-validated');
			}

		  }, false);
		});
	}, false);
		
	document.getElementById('ionic-project').addEventListener('change', function(e){
		document.getElementById('android-folder-select').disabled = this.checked;
	}, false);
	
	document.getElementById('android-ul-check').addEventListener('change', function(e){
		var els = document.querySelectorAll('#android-ul input:not(#android-ul-check), #android-ul button');
		//for(var el of document.querySelectorAll('#android-ul input:not(#android-ul-check), #android-ul button')){
		for(var i=0; i<els.length; i++){
			var el = els[i];
			el.disabled = !this.checked;
		}
	}, false);
	
	document.getElementById('ios-ul-check').addEventListener('change', function(e){
		var els = document.querySelectorAll('#ios-ul input:not(#ios-ul-check), #ios-ul button');
		//for(var el of document.querySelectorAll('#ios-ul input:not(#ios-ul-check), #ios-ul button')){
		for(var i=0; i<els.length; i++){
			var el = els[i];
			el.disabled = !this.checked;
		}
	}, false);
	
	if(currentTool == 'appicon'){
		document.querySelector('.appicon-nav').classList.add('active');
		document.querySelector('.appsplash-nav').classList.remove('active');
		document.getElementById('android-rounded').addEventListener('change', function(e){
			document.getElementById('android-border-radius').disabled = !this.checked;
			android_round = this.checked ? document.getElementById('android-border-radius').value : 0;
			if(isNaN(android_round) || android_round < 0 ){
				android_round = 0;
			}
			document.getElementById('icon-preview').style.setProperty('border-radius', android_round + '%');
		}, false);
		
		document.getElementById('android-border-radius').addEventListener('change', function(e){
			android_round = document.getElementById('android-rounded').checked ? this.value : 0;
			if(isNaN(android_round) || android_round < 0 ){
				android_round = 0;
			}
			document.getElementById('icon-preview').style.setProperty('border-radius', android_round + '%');
		}, false);
		hideElement('.only-splash');
	}
	else{
		document.querySelector('.appicon-nav').classList.remove('active');
		document.querySelector('.appsplash-nav').classList.add('active');
		android_round = 0;
		hideElement('.android-rounded-form');
		hideElement('#icon-preview');
		hideElement('.only-icon');
	}
	
	//load option items
	var androidoption_html = '', iosoption_html = '';
	var optdataarray = getOptionListData('android', currentTool);
	//for(var itm of getOptionListData('android', currentTool)){
	for(var i=0; i<optdataarray.length; i++){
		var itm = optdataarray[i];
		androidoption_html += createOptionItem(itm);
	}
	optdataarray = getOptionListData('ios', currentTool);
	//for(var itm of getOptionListData('ios', currentTool)){
	for(var i=0; i<optdataarray.length; i++){
		var itm = optdataarray[i];
		iosoption_html += createOptionItem(itm);
	}
	document.querySelector('#android-ul ul.icon-ul').innerHTML = androidoption_html;
	document.querySelector('#ios-ul ul.icon-ul').innerHTML = iosoption_html;
}

function switchTool(tool){
	window.location.href = window.location.href.split('?')[0] + '?tool='+tool;
}

function hideElement(selectors){
	var elements = document.querySelectorAll(selectors);
	//for(var el of elements){
	for(var i=0; i< elements.length; i++){
		var el = elements[i];
		el.style.setProperty('display', 'none');
	}
}

function showElement(selectors, display){
	display = typeof(display) == 'undefined'?'block':display;
	var elements = document.querySelectorAll(selectors);
	//for(var el of elements){
	for(var i=0; i< elements.length; i++){
		var el = elements[i];
		el.style.setProperty('display', display);
	}
}

function getQueryParamVal(queryName) {
	var searchStr = window.location.search;
	if(searchStr.length <= 0){
		return "";
	}
    var reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if ( r != null ){
       return decodeURIComponent(r[2]);
    }else{
       return '';
    }
 }

function fileChange(e){
	if(e.target && e.target.files && e.target.files.length > 0){
		var file    = e.target.files[0];
		showImage(file);
	}
}

function dropfile(e){
	//e.preventDefault();
	//e.stopPropagation(); 
	//file
	if(e.dataTransfer && e.dataTransfer.files){
		var file = e.dataTransfer.files.item(0);
		showImage(file);
	}
}

function showSafeArea(){
	if(currentTool == 'appsplash'){
		var width = 396;
		var img = document.getElementsByClassName("preimg")[0];
		var safearea = document.getElementById("safe-area");
		if(safearea.style.display == 'block' || img.width == 0){
			safearea.style.display = 'none';
		}
		else{
			safearea.style.display = 'block';
			safearea.style.marginLeft = Math.round((396 - 396 * 0.46) / 2) + 'px';
		}
		
	}
}

function showImage(file){
	var thisType = file.type;
	var thisSize = file.size;
	if(thisType.indexOf('image/') != 0){
		return;
	}
	var reader   = new FileReader();

	reader.readAsDataURL(file);
	var Con    = document.getElementById("ImgCon");
	
	// Con.innerHTML = '<img class="preimg" src="' + URL.createObjectURL(f) + '">';
		//const f = new Blob(file);
		//const url = window.URL.createObjectURL(blob);
	
	Con.innerHTML = "";
	reader.onload = function(e) {
		
		Con.innerHTML = '<img class="preimg" src="' + e.target.result + '">';
		imgobj.src = e.target.result;
		document.getElementById('icon-preview').src = e.target.result;
		document.getElementById('icon-preview').style.setProperty('background-color', '#fff'); //background-color: #d62d2d;
	}	
}

function filterUL(platform, action){
	//ANDROID, IOS:  ALL IPHONE WATCH RESET
	var selector = platform == 'ANDROID' ? "#android-ul ul>li input[type=checkbox]":"#ios-ul ul>li input[type=checkbox]";
	var els = document.querySelectorAll(selector);
	//for(var el of document.querySelectorAll(selector)){
	for(var i=0; i<els.length; i++){
		var el = els[i];
		if(action == 'ALL' || el.getAttribute('data-filter').indexOf(action) >= 0){
			el.checked = true;
		}
		else{
			el.checked = false;
		}
	}
}

function getOptionListData(platform, tooltype){
	var data = {
		android_appicon: [
				{id:'aai_1', title:'ldpi-icon', ionicfilename:'android\\icon\\drawable-ldpi-icon', filename:'android\\mipmap-ldpi\\ic_launcher', subtype:'', size:'36x36', filetype: 'png', checked: true, iscustom:false},
				{id:'aai_2', title:'mdpi-icon', ionicfilename:'android\\icon\\drawable-mdpi-icon', filename:'android\\mipmap-mdpi\\ic_launcher', subtype:'', size:'48x48', filetype: 'png', checked: true, iscustom:false},
				{id:'aai_3', title:'hdpi-icon', ionicfilename:'android\\icon\\drawable-hdpi-icon', filename:'android\\mipmap-hdpi\\ic_launcher', subtype:'', size:'72x72', filetype: 'png', checked: true, iscustom:false},
				{id:'aai_4', title:'xhdpi-icon', ionicfilename:'android\\icon\\drawable-xhdpi-icon', filename:'android\\mipmap-xhdpi\\ic_launcher', subtype:'', size:'96x96', filetype: 'png', checked: true, iscustom:false},
				{id:'aai_5', title:'xxhdpi-icon', ionicfilename:'android\\icon\\drawable-xxhdpi-icon', filename:'android\\mipmap-xxhdpi\\ic_launcher', subtype:'', size:'144x144', filetype: 'png', checked: true, iscustom:false},
				{id:'aai_6', title:'xxxhdpi-icon', ionicfilename:'android\\icon\\drawable-xxxhdpi-icon', filename:'android\\mipmap-xxxhdpi\\ic_launcher', subtype:'', size:'192x192', filetype: 'png', checked: true, iscustom:false},
				{id:'aai_7', title:'icon-512', ionicfilename:'android\\icon-512', filename:'android\\icon-512', subtype:'', size:'512x512', filetype: 'png', checked: true, iscustom:false},
				{id:'aai_8', title:'icon-512-squared', ionicfilename:'android\\icon-512-squared', filename:'android\\icon-512-squared', subtype:'', size:'512x512', filetype: 'png', checked: true, iscustom:false}
		],
		ios_appicon:[
				{id:'iai_1', title:'icon', ionicfilename:'ios\\icon\\icon', filename:'ios\\AppIcon.appiconset\\icon', subtype:'iphone', size:'57x57', filetype:'png', checked:true, iscustom:false},
				{id:'iai_2', title:'icon@2x', ionicfilename:'ios\\icon\\icon@2x', filename:'ios\\AppIcon.appiconset\\icon@2x', subtype:'iphone', size:'114x114', filetype:'png', checked:true, iscustom:false},
				{id:'iai_21', title:'icon-20', ionicfilename:'ios\\icon\\icon-20', filename:'ios\\AppIcon.appiconset\\icon-20', subtype:'iphone', size:'20x20', filetype:'png', checked:true, iscustom:false},
				{id:'iai_3', title:'icon-40', ionicfilename:'ios\\icon\\icon-40', filename:'ios\\AppIcon.appiconset\\icon-40', subtype:'iphone', size:'40x40', filetype:'png', checked:true, iscustom:false},
				{id:'iai_4', title:'icon-40@2x', ionicfilename:'ios\\icon\\icon-40@2x', filename:'ios\\AppIcon.appiconset\\icon-40@2x', subtype:'iphone', size:'80x80', filetype:'png', checked:true, iscustom:false},
				{id:'iai_5', title:'icon-40@3x', ionicfilename:'ios\\icon\\icon-40@3x', filename:'ios\\AppIcon.appiconset\\icon-40@3x', subtype:'iphone', size:'120x120', filetype:'png', checked:true, iscustom:false},
				{id:'iai_6', title:'icon-50', ionicfilename:'ios\\icon\\icon-50', filename:'ios\\AppIcon.appiconset\\icon-50', subtype:'iphone', size:'50x50', filetype:'png', checked:true, iscustom:false},
				{id:'iai_7', title:'icon-50@2x', ionicfilename:'ios\\icon\\icon-50@2x', filename:'ios\\AppIcon.appiconset\\icon-50@2x', subtype:'iphone', size:'100x100', filetype:'png', checked:true, iscustom:false},
				{id:'iai_8', title:'icon-60', ionicfilename:'ios\\icon\\icon-60', filename:'ios\\AppIcon.appiconset\\icon-60', subtype:'iphone', size:'60x60', filetype:'png', checked:true, iscustom:false},
				{id:'iai_9', title:'icon-60@2x', ionicfilename:'ios\\icon\\icon-60@2x', filename:'ios\\AppIcon.appiconset\\icon-60@2x', subtype:'iphone', size:'120x120', filetype:'png', checked:true, iscustom:false},
				{id:'iai_10', title:'icon-60@3x', ionicfilename:'ios\\icon\\icon-60@3x', filename:'ios\\AppIcon.appiconset\\icon-60@3x', subtype:'iphone', size:'180x180', filetype:'png', checked:true, iscustom:false},
				{id:'iai_11', title:'icon-72', ionicfilename:'ios\\icon\\icon-72', filename:'ios\\AppIcon.appiconset\\icon-72', subtype:'iphone', size:'72x72', filetype:'png', checked:true, iscustom:false},
				{id:'iai_12', title:'icon-72@2x', ionicfilename:'ios\\icon\\icon-72@2x', filename:'ios\\AppIcon.appiconset\\icon-72@2x', subtype:'iphone', size:'144x144', filetype:'png', checked:true, iscustom:false},
				{id:'iai_13', title:'icon-76', ionicfilename:'ios\\icon\\icon-76', filename:'ios\\AppIcon.appiconset\\icon-76', subtype:'iphone', size:'76x76', filetype:'png', checked:true, iscustom:false},
				{id:'iai_14', title:'icon-76@2x', ionicfilename:'ios\\icon\\icon-76@2x', filename:'ios\\AppIcon.appiconset\\icon-76@2x', subtype:'iphone', size:'152x152', filetype:'png', checked:true, iscustom:false},
				{id:'iai_15', title:'icon-83.5@2x', ionicfilename:'ios\\icon\\icon-83.5@2x', filename:'ios\\AppIcon.appiconset\\icon-83.5@2x', subtype:'iphone', size:'167x167', filetype:'png', checked:true, iscustom:false},
				{id:'iai_16', title:'icon-small', ionicfilename:'ios\\icon\\icon-small', filename:'ios\\AppIcon.appiconset\\icon-small', subtype:'iphone', size:'29x29', filetype:'png', checked:true, iscustom:false},
				{id:'iai_17', title:'icon-small@2x', ionicfilename:'ios\\icon\\icon-small@2x', filename:'ios\\AppIcon.appiconset\\icon-small@2x', subtype:'iphone', size:'58x58', filetype:'png', checked:true, iscustom:false},
				{id:'iai_18', title:'icon-small@3x', ionicfilename:'ios\\icon\\icon-small@3x', filename:'ios\\AppIcon.appiconset\\icon-small@3x', subtype:'iphone', size:'87x87', filetype:'png', checked:true, iscustom:false},
				{id:'iai_19', title:'icon-1024', ionicfilename:'ios\\icon\\icon-1024', filename:'ios\\AppIcon.appiconset\\icon-1024', subtype:'iphone', size:'1024x1024', filetype:'jpg', checked:true, iscustom:false},
				
				{id:'iai_20', title:'AppIcon24x24@2x', ionicfilename:'ios\\icon\\AppIcon24x24@2x', filename:'ios\\AppIcon.appiconset\\AppIcon24x24@2x', subtype:'watch', size:'48x48', filetype:'png', checked:true, iscustom:false},
				{id:'iai_21', title:'AppIcon27.5x27.5@2x', ionicfilename:'ios\\icon\\AppIcon27.5x27.5@2x', filename:'ios\\AppIcon.appiconset\\AppIcon27.5x27.5@2x', subtype:'watch', size:'55x55', filetype:'png', checked:true, iscustom:false},
				{id:'iai_22', title:'AppIcon29x29@2x', ionicfilename:'ios\\icon\\AppIcon29x29@2x', filename:'ios\\AppIcon.appiconset\\AppIcon29x29@2x', subtype:'watch', size:'58x58', filetype:'png', checked:true, iscustom:false},
				{id:'iai_23', title:'AppIcon29x29@3x', ionicfilename:'ios\\icon\\AppIcon29x29@3x', filename:'ios\\AppIcon.appiconset\\AppIcon29x29@3x', subtype:'watch', size:'87x87', filetype:'png', checked:true, iscustom:false},
				{id:'iai_24', title:'AppIcon40x40@2x', ionicfilename:'ios\\icon\\AppIcon40x40@2x', filename:'ios\\AppIcon.appiconset\\AppIcon40x40@2x', subtype:'watch', size:'80x80', filetype:'png', checked:true, iscustom:false},
				{id:'iai_25', title:'AppIcon44x44@2x', ionicfilename:'ios\\icon\\AppIcon44x44@2x', filename:'ios\\AppIcon.appiconset\\AppIcon44x44@2x', subtype:'watch', size:'88x88', filetype:'png', checked:true, iscustom:false},
				{id:'iai_26', title:'AppIcon86x86@2x', ionicfilename:'ios\\icon\\AppIcon86x86@2x', filename:'ios\\AppIcon.appiconset\\AppIcon86x86@2x', subtype:'watch', size:'172x172', filetype:'png', checked:true, iscustom:false},
				{id:'iai_27', title:'AppIcon98x98@2x', ionicfilename:'ios\\icon\\AppIcon98x98@2x', filename:'ios\\AppIcon.appiconset\\AppIcon98x98@2x', subtype:'watch', size:'196x196', filetype:'png', checked:true, iscustom:false}				
		],
		android_appsplash:[
				{id:'aas_1', title:'port-ldpi', ionicfilename:'android\\splash\\drawable-port-ldpi-screen', filename:'android\\drawable-port-ldpi\\screen', subtype:'port', size:'240x320', filetype:'png', checked:true, iscustom:false},
				{id:'aas_2', title:'port-mdpi', ionicfilename:'android\\splash\\drawable-port-mdpi-screen', filename:'android\\drawable-port-mdpi\\screen', subtype:'port', size:'320x480', filetype:'png', checked:true, iscustom:false},
				{id:'aas_3', title:'port-hdpi', ionicfilename:'android\\splash\\drawable-port-hdpi-screen', filename:'android\\drawable-port-hdpi\\screen', subtype:'port', size:'480x800', filetype:'png', checked:true, iscustom:false},
				{id:'aas_4', title:'port-xhdpi', ionicfilename:'android\\splash\\drawable-port-xhdpi-screen', filename:'android\\drawable-port-xhdpi\\screen', subtype:'port', size:'720x1280', filetype:'png', checked:true, iscustom:false},
				{id:'aas_5', title:'port-xxhdpi', ionicfilename:'android\\splash\\drawable-port-xxhdpi-screen', filename:'android\\drawable-port-xxhdpi\\screen', subtype:'port', size:'960x1600', filetype:'png', checked:true, iscustom:false},
				{id:'aas_6', title:'port-xxxhdpi', ionicfilename:'android\\splash\\drawable-port-xxxhdpi-screen', filename:'android\\drawable-port-xxxhdpi\\screen', subtype:'port', size:'1280x1920', filetype:'png', checked:true, iscustom:false},
				{id:'aas_7', title:'land-ldpi', ionicfilename:'android\\splash\\drawable-land-ldpi-screen', filename:'android\\drawable-land-ldpi\\screen', subtype:'land', size:'320x240', filetype:'png', checked:false, iscustom:false},
				{id:'aas_8', title:'land-mdpi', ionicfilename:'android\\splash\\drawable-land-mdpi-screen', filename:'android\\drawable-land-mdpi\\screen', subtype:'land', size:'480x320', filetype:'png', checked:false, iscustom:false},
				{id:'aas_9', title:'land-hdpi', ionicfilename:'android\\splash\\drawable-land-hdpi-screen', filename:'android\\drawable-land-hdpi\\screen', subtype:'land', size:'800x480', filetype:'png', checked:false, iscustom:false},
				{id:'aas_10', title:'land-xhdpi', ionicfilename:'android\\splash\\drawable-land-xhdpi-screen', filename:'android\\drawable-land-xhdpi\\screen', subtype:'land', size:'1280x720', filetype:'png', checked:false, iscustom:false},
				{id:'aas_11', title:'land-xxhdpi', ionicfilename:'android\\splash\\drawable-land-xxhdpi-screen', filename:'android\\drawable-land-xxhdpi\\screen', subtype:'land', size:'1600x960', filetype:'png', checked:false, iscustom:false},
				{id:'aas_12', title:'land-xxxhdpi', ionicfilename:'android\\splash\\drawable-land-xxxhdpi-screen', filename:'android\\drawable-land-xxxhdpi\\screen', subtype:'land', size:'1920x1280', filetype:'png', checked:false, iscustom:false}
		],
		ios_appsplash:[
				{id:'ias_1', title:'Default@2x~iphone', ionicfilename:'ios\\splash\\Default@2x~iphone', filename:'ios\\LaunchImage.launchimage\\Default@2x~iphone', subtype:'port', size:'640x960', filetype:'png', checked:true, iscustom:false},
				{id:'ias_3', title:'Default~iphone', ionicfilename:'ios\\splash\\Default~iphone', filename:'ios\\LaunchImage.launchimage\\Default~iphone', subtype:'port', size:'320x480', filetype:'png', checked:true, iscustom:false},
				{id:'ias_4', title:'Default-568h@2x~iphone', ionicfilename:'ios\\splash\\Default-568h@2x~iphone', filename:'ios\\LaunchImage.launchimage\\Default-568h@2x~iphone', subtype:'port', size:'640x1136', filetype:'png', checked:true, iscustom:false},
				{id:'ias_5', title:'Default-667h', ionicfilename:'ios\\splash\\Default-667h', filename:'ios\\LaunchImage.launchimage\\Default-667h', subtype:'port', size:'750x1334', filetype:'png', checked:true, iscustom:false},
				{id:'ias_6', title:'Default-736h', ionicfilename:'ios\\splash\\Default-736h', filename:'ios\\LaunchImage.launchimage\\Default-736h', subtype:'port', size:'1125x2436', filetype:'png', checked:true, iscustom:false},
				{id:'ias_7', title:'Default-2208h', ionicfilename:'ios\\splash\\Default-2208h', filename:'ios\\LaunchImage.launchimage\\Default-2208h', subtype:'port', size:'1242x2208', filetype:'png', checked:true, iscustom:false},
				{id:'ias_8', title:'Default@2x~universal~anyany', ionicfilename:'ios\\splash\\Default@2x~universal~anyany', filename:'ios\\LaunchImage.launchimage\\Default@2x~universal~anyany', subtype:'port|land', size:'2732x2732', filetype:'png', checked:true, iscustom:false},
				{id:'ias_2', title:'Default@3x~universal~anyany', ionicfilename:'ios\\splash\\Default@3x~universal~anyany', filename:'ios\\LaunchImage.launchimage\\Default@3x~universal~anyany', subtype:'port|land', size:'2208x2208', filetype:'png', checked:true, iscustom:false},
				//{id:'ias_9', title:'splash', ionicfilename:'splash', filename:'splash', subtype:'', size:'1920x2880', filetype:'png', checked:true, iscustom:false},
				{id:'ias_10', title:'Default-Landscape@2x~iphone', ionicfilename:'ios\\splash\\Default-Landscape@2x~iphone', filename:'ios\\LaunchImage.launchimage\\Default-Landscape@2x~iphone', subtype:'land', size:'960x640', filetype:'png', checked:false, iscustom:false},
				{id:'ias_11', title:'Default-Landscape~iphone', ionicfilename:'ios\\splash\\Default-Landscape~iphone', filename:'ios\\LaunchImage.launchimage\\Default-Landscape~iphone', subtype:'land', size:'480x320', filetype:'png', checked:false, iscustom:false},
				{id:'ias_12', title:'Default-Landscape-568h@2x~iphone', ionicfilename:'ios\\splash\\Default-Landscape-568h@2x~iphone', filename:'ios\\LaunchImage.launchimage\\Default-Landscape-568h@2x~iphone', subtype:'land', size:'1136x640', filetype:'png', checked:false, iscustom:false},
				{id:'ias_13', title:'Default-Landscape-667h', ionicfilename:'ios\\splash\\Default-Landscape-667h', filename:'ios\\LaunchImage.launchimage\\Default-Landscape-667h', subtype:'land', size:'1334x750', filetype:'png', checked:false, iscustom:false},
				{id:'ias_14', title:'Default-Landscape-736h', ionicfilename:'ios\\splash\\Default-Landscape-736h', filename:'ios\\LaunchImage.launchimage\\Default-Landscape-736h', subtype:'land', size:'2436x1125', filetype:'png', checked:false, iscustom:false},
				{id:'ias_15', title:'Default-Landscape-2208h', ionicfilename:'ios\\splash\\Default-Landscape-2208h', filename:'ios\\LaunchImage.launchimage\\Default-Landscape-2208h', subtype:'land', size:'2208x1242', filetype:'png', checked:false, iscustom:false}
		]
	};
	var ret = data[platform + '_' + tooltype]; 
	
	//check custom data in localstorage
	ret = ret.concat(getLocalCustomOptions(platform, tooltype));
	
	return ret;
}

function createOptionItem(item){
	return '<li class="list-group-item d-flex justify-content-between align-items-center">' +
				'<div class="form-check">' +
				  '<input type="checkbox" class="form-check-input" id="' +item.id + '" data-filter="' +item.subtype + '" ' + (item.checked?'checked':'') + '>' +
				  '<label class="form-check-label" for="' + item.id + '">' +
					item.title +
					(item.iscustom ? '(custom)<button type="button" class="btn btn-link" onclick="showDelCustomDlg(\'' +item.id + '\')">' +
						'<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
						  '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
						  '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
						'</svg>' +
					'</button>' : '') +
				  '</label>' +
				'</div>' +
				 '<span class="badge badge-info badge-pill">' + item.size + '</span>' +
			'</li>';
}

/*
function createOptionItem(item){
	return `<li class="list-group-item d-flex justify-content-between align-items-center">
				<div class="form-check">
				  <input type="checkbox" class="form-check-input" id="${item.id}" data-filter="${item.subtype}" ${item.checked?'checked':''}>
				  <label class="form-check-label" for="${item.id}">
					${item.title}
					${item.iscustom ? `(custom)<button type="button" class="btn btn-link" onclick="showDelCustomDlg('${item.id}')">
						<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
						  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
						</svg>
					</button>` : ''}
				  </label>
				</div>
				 <span class="badge badge-info badge-pill">${item.size}</span>
				 
			</li>`;
}
*/

function showAddCustomOptionDlg(platform){
	document.getElementById("aom-platform").value = platform;
	$('#addOptionModal').modal('show');
}

function addCustomOption(){
	var tmpform = document.querySelector('#addOptionModal form');
	if(tmpform.checkValidity() === false){
		tmpform.classList.add('was-validated');
		return;
	}
		
	var aomplatform = document.getElementById("aom-platform").value;
	var aomtitle = document.getElementById("aom-title").value;
	var aomfilename = document.getElementById("aom-filename").value;
	var aomwidth = document.getElementById("aom-width").value;
	var aomheight = document.getElementById("aom-height").value;
	var aomfiletype = document.getElementById("aom-imgtype").value;
	
	var parentEl = document.querySelector('#' + aomplatform + '-ul ul.icon-ul'); //(`#${aomplatform}-ul ul.icon-ul`)
	var optionsCnt = parentEl.getElementsByTagName('li').length;
	
	var data = {id:aomplatform+'_cst_'+(optionsCnt+1), title:aomtitle, ionicfilename:aomfilename, filename:aomfilename, subtype:'', size:aomwidth+'x'+aomheight, filetype:aomfiletype, checked:true, iscustom:true};
	
	parentEl.innerHTML += createOptionItem(data);
	saveLocalCustomOption(data, aomplatform, currentTool);
		
	tmpform.classList.remove('was-validated');
	$('#addOptionModal').modal('hide');
	
	//save localstorage
}
function showDelCustomDlg(id){
	document.getElementById("dcm-id").value = id;
	$('#deleteConfirmModal').modal('show');
}

function removeCustomOption(){
	if(localStorage){
		var id = document.getElementById("dcm-id").value;
		$('#deleteConfirmModal').modal('hide');
		
		//document.getElementById(id).remove();
		$('li:has(#'+id+')').remove();
		
		var curplatform = id.indexOf('android') == 0 ? 'android':'ios';
		var localdata = getLocalCustomOptions(curplatform, currentTool);
		for(var i = 0; i<localdata.length; i++){
			if(id == localdata[i].id){
				localdata.splice(i, 1);
				break;
			}
		}
		localStorage.setItem('mky_customoptions_' + curplatform + '_' + currentTool, JSON.stringify(localdata));
	}
}

function getLocalCustomOptions(platform, tool){
	if(localStorage){
		var opts = localStorage.getItem('mky_customoptions_' + platform + '_' + tool);
		if(opts && opts != ''){
			try{
				return JSON.parse(opts);
			}
			catch(e){}
		}
	}
	return [];
}

function saveLocalCustomOption(item, platform, tool){
	if(localStorage){
		var curlocalval = getLocalCustomOptions(platform, tool);
		curlocalval.push(item);
		localStorage.setItem('mky_customoptions_' + platform + '_' + tool, JSON.stringify(curlocalval));
	}
}

function getSettingOpts(){
	var qly = document.getElementById("output-quality").value;
	if(qly< 50){
		qly = 50;
	}
	else if(qly>100){
		qly = 100;
	}
	
	return {
		tool: currentTool,
		isDownloadZip: isDownloadZip,
		quality: qly / 100.0,
		isIonicProject: document.getElementById('ionic-project').checked,
		android_icon_radius: android_round,
		//android_folder: document.getElementById('android-folder-select').value,
		zip_filename: currentTool + (new Date()).getTime() + ".zip"
	};
}

function build(){
	var include_android = document.getElementById("android-ul-check").checked;
	var include_ios = document.getElementById("ios-ul-check").checked;
	if(!include_android && !include_ios){
		return;
	}
	var setting = getSettingOpts();
	var outputList = [];
	
	if(include_android){
		var androiddata = getOptionListData('android', currentTool);
		var els = document.querySelectorAll('#android-ul li input[type=checkbox]');
		//for(var el of document.querySelectorAll('#android-ul li input[type=checkbox]')){
		for(var i=0; i<els.length; i++){
			var el = els[i];
			if(el.checked){
				var itm = findItem(el.id, androiddata);
				outputList.push(itm);
				itm.platform = 'android';
			}
		}
	}
	if(include_ios){
		var iosdata = getOptionListData('ios', currentTool);
		var els = document.querySelectorAll('#ios-ul li input[type=checkbox]');
		//for(var el of document.querySelectorAll('#ios-ul li input[type=checkbox]')){
		for(var i=0; i<els.length; i++){
			var el = els[i];
			if(el.checked){
				outputList.push(findItem(el.id, iosdata));
				var itm = findItem(el.id, iosdata);
				outputList.push(itm);
				itm.platform = 'ios';
			}
		}
	}
	if(outputList.length == 0){
		return;
	}
	else if(outputList.length == 1){
		setting.isDownloadZip = false;
	}
	
	$('#loadingModal').modal('show');
	downloadFiles = [];
	setTimeout(function(){

			//setting, outputList
		//for(var item of outputList){
		for(var i=0; i<outputList.length; i++){
			var item = outputList[i];
			resizeImage(imgobj,item, setting, currentTool); 
			//sleep(500);
			sleep(10);
		}
		if(setting.isDownloadZip && downloadFiles.length > 0){
			downloadZipFiles(setting.zip_filename);
		}
		else{
		//loading.modal('hide');
			setTimeout(function(){
				$('#loadingModal').modal('hide');
			}, 300);
		}
	},
	300);
	
}

function findItem(id, data){
	//for(var itm of data){
	for(var i=0; i<data.length; i++){
		var itm = data[i];
		if(itm.id == id){
			return itm;
		}
	}
	return null;
}

//generate image
var canvas = null;
function resizeImage(img, item, setting, tool){
	var sizes = item.size.split('x');
	var filetype = item.filetype;
	var isround = setting.android_icon_radius>0 && item.platform == 'android';
	var filename = setting.isIonicProject ? item.ionicfilename : item.filename;
	var scalecanvas = isround ? 1: 1;  //5:1
	var width = sizes[0] * scalecanvas;
	var height = sizes[1] * scalecanvas;

	if(canvas==null){
		canvas = document.createElement('canvas'); 
	}
	canvas.width = width; // img.width;  
	canvas.height = height; //img.height;  

	var context = canvas.getContext('2d'); 
	context.clearRect(0,0, canvas.width, canvas.height);
	context.imageSmoothingQuality ='high';
	if(isround){
		roundCanvas(context, canvas.width, canvas.height, Math.round(canvas.width * setting.android_icon_radius / 100.0));	
	}

	//context.drawImage(img,x,y,width,height);
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	if(tool=='appicon'){
		context.drawImage(img, 0, 0, width, height); 
	}
	else{
		//splash maybe need to crop
		var sw = img.width;
		var sh = img.height;
		var hrate = sh * 1.0 / height;
		var wrate = sw * 1.0 / width;
		var sx=0;
		var sy=0;
		
		if(hrate > wrate){
			//crop height
			sh = Math.round(wrate * height);
			sy = Math.round((img.height - sh) / 2);
		}
		else{
			//crop width
			sw = Math.round(hrate * width);
			sx = Math.round((img.width - sw) / 2);
		}
		context.drawImage(img,sx,sy,sw,sh,0,0,width,height);
	}


	 //output base64 image data
	var imgData = canvas.toDataURL(filetype=="jpg"?"image/jpeg":"image/png", setting.quality);  

	//rescale
	if(scalecanvas > 1){
		var tmpcanvas = document.createElement('canvas'); 
		tmpcanvas.width = width / scalecanvas;  
		tmpcanvas.height = height / scalecanvas;
		var tmpcontext = tmpcanvas.getContext('2d');  
		tmpcontext.clearRect(0,0, tmpcanvas.width, tmpcanvas.height);
		var tmpimg = new Image();
		tmpimg.src = imgData;
		var tmpfilename = filename;
		var tmpIsZip = setting.isDownloadZip;
		tmpimg.onload =function(e){
			tmpcontext.drawImage(tmpimg, 0, 0, tmpcanvas.width, tmpcanvas.height); 
			tmpimg = null;
			imgData = tmpcanvas.toDataURL(filetype=="jpg"?"image/jpeg":"image/png", setting.quality);  
			tmpcontext = null;
			
			saveImageFile(imgData, tmpfilename, filetype, tmpIsZip);
		}
		return;
	}

	context = null;
	saveImageFile(imgData, filename, filetype, setting.isDownloadZip);
}

function saveImageFile(imgData, filename, filetype, isZip){
	var strs = filename.split('\\');
	var imgfilename = strs[strs.length - 1] + '.' + filetype;  //(new Date()).getTime()

	if(isZip){
		strs.splice(strs.length-1, 1);
		imgData = imgData.replace('data:'+ fixType(filetype)+';base64,', '');  
		downloadFiles.push({path:strs, filename: imgfilename, data:imgData, base64:true});
	}
	else{
		//download  
		imgData = imgData.replace(fixType(filetype), 'image/octet-stream');  
		saveFile(imgData, imgfilename);  
	} 
}

function downloadZipFiles(filename){
	var zip = new JSZip();
	var folders = {};
	//for(var fl of downloadFiles){
	for(var i=0; i< downloadFiles.length; i++){
		var fl = downloadFiles[i];
		if(fl.path.length == 0){
			zip.file(fl.filename, fl.data, {base64: fl.base64});
		}
		else{
			//a, b, c
			var curpath = '';
			var curfolder = zip;
			//for(var p of fl.path){
			for(var m = 0; m< fl.path.length; m++){
				var p = fl.path[m];
				curpath += (curpath.length >0?'\\' : '') + p;
				if(folders[curpath] === undefined){
					curfolder = curfolder.folder(p);
					folders[curpath] = curfolder;
				}
				else{
					curfolder = folders[curpath];
				}
			}
			curfolder.file(fl.filename, fl.data, {base64: fl.base64});
		}
	}

	var zipfilename = filename;
	zip.generateAsync({type:"blob"}).then(function(content){
		filedata = URL.createObjectURL(content);
		saveFile(filedata, zipfilename);  
		setTimeout(function(){
			$('#loadingModal').modal('hide');
		}, 300);

	});
}

function saveFile(data, filename) {  
	var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');  
	save_link.href = data;  
	save_link.download = filename;  

	var event = document.createEvent('MouseEvents');  
	event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);  
	save_link.dispatchEvent(event);  
} 

function roundCanvas(cxt, width, height, radius){
	cxt.beginPath(0);
	cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
	cxt.lineTo(radius, height);
	cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
	cxt.lineTo(0, radius);
	cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
	cxt.lineTo(width - radius, 0);
	cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
	cxt.lineTo(width, height - radius);
	cxt.closePath();
	cxt.clip();
}

function fixType(type) {  
	type = type.toLowerCase().replace(/jpg/i, 'jpeg');  
	var r = type.match(/png|jpeg|bmp|gif/)[0];  
	return 'image/' + r;  
}

var sleep = function(time) {
	var startTime = new Date().getTime() + parseInt(time, 10);
	while(new Date().getTime() < startTime) {}
};
