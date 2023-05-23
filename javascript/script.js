
function rgbJSON(color) {
	var rgb = {
		"r": 255,
		"g": 255,
		"b": 255	
	};	
	if (color == "red") {
		rgb = {
			"r": 255,
			"g": 0,
			"b": 0	
		};		
	};
	if (color == "white") {
		rgb = {
			"r": 255,
			"g": 255,
			"b": 255	
		};		
	};
	return rgb;
};

function goveeAPI(color, key) {
	color = rgbJSON(color);
	$.ajax({
	  url: "https://developer-api.govee.com/v1/devices/control",
	  type: "PUT",
	  data: JSON.stringify({
		"device": "EC:66:D4:AD:FC:7B:9F:88",
		"model": "H61A0",
		"cmd": { 
		  "name": "color", 
		  "value": { 
		  	"r": color.r, 
		  	"g": color.g, 
		  	"b": color.b}
			}
		}),
	  contentType: "application/json",
	  headers: {
	    "Govee-API-Key": key
	  },
	  success: function(response) {
	    console.log("Request succeeded:", response);
	  },
	  error: function(xhr, status, error) {
	    console.log("Request failed:", error);
	  }
	});
	if (color !== "white") {
		setTimeout(function(){
			goveeAPI("white", key);
	    }, 1000);
	};
};

function updateScore() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
    	var response = JSON.parse(xhr.responseText);

    	// update doc elements
      	document.getElementById('score1').textContent = response.score1;
      	document.getElementById('score2').textContent = response.score2;

      	//show winners or busts if needed
		if (response.score1 == 21) {
			clearInterval(refreshIntervalId);
			document.getElementById('score1winner').style.display = "block";
		};
		if (response.score2 == 21) {
			clearInterval(refreshIntervalId);
			document.getElementById('score2winner').style.display = "block";
		};
		if (response.score1 > 21) {
			document.getElementById('bust1').style.display = "block";
			document.getElementById('score1').textContent = score1;
			setTimeout(function(){
				document.getElementById('bust1').style.display = "none";
		    }, 5000);
		};
		if (response.score2 > 21) {
			document.getElementById('bust2').style.display = "block";
			document.getElementById('score2').textContent = score2;
			setTimeout(function(){
				document.getElementById('bust2').style.display = "none";
		    }, 5000);
		};

		// show color flahes if needed
		if (1==2) {
			goveeAPI("red", response.key);
		};

    };
  };
  xhr.open('GET', '/data', true);
  xhr.send();
};
$(document).ready(function() {
	var refreshIntervalId = setInterval(updateScore, 1000);
	$('.reset').click(function(){
		$.ajax({
		    url: "/reset",
		    type: 'GET',
		    success: function(res) {
		        console.log(res);
		    }
		});
	});

});