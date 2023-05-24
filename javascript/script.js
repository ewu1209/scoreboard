var gameActive = true;

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
	if (!gameActive) {
		return;
	}
	console.log("updateScore");
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
    	var response = JSON.parse(xhr.responseText);

    	// See what changed
    	var delta1 = response.score1 - $("#score1").html();
    	var delta2 = response.score2 - $("#score2").html();

		// Govee logic
    	if (delta1 > 4 || delta2 > 4) {
    		console.log("redflash");
			//goveeAPI("red", response.key);
    	};

    	// update doc elements
      	$("#score1").html(response.score1);
      	$("#score2").html(response.score2);

      	//show winners or busts if needed
		if (response.score1 == 21) {
			$("#score1winner").show();
			gameActive = false;
		};
		if (response.score2 == 21) {
			$("#score2winner").show();
			gameActive = false;
		};
		if (response.score1 > 21) {
			$("#bust1").show();
			setTimeout(function(){
				$("#bust1").hide();
		    }, 4000);
		};
		if (response.score2 > 21) {
			$("#bust2").show();
			setTimeout(function(){
				$("#bust2").hide();
		    }, 4000);
		};

    };
  };
  xhr.open('GET', '/data', true);
  xhr.send();
};

function resetGame() {
  	$("#score1").html("0");
  	$("#score2").html("0");
	$(".reset").html("Loading...");
	$("#score1winner").hide();
	$("#score2winner").hide();
	$.ajax({
	    url: "/reset",
	    type: 'GET',
	    success: function(res) {
	        console.log(res);
	        updateScore();
	        $(".reset").html("[RESTART GAME]");
        	gameActive = true;
	    }
	});
};

$(document).ready(function() {

	//Initiate the updater 
	setInterval(updateScore, 500);

	//Reset game event listener
	$(".reset").click(function(){resetGame();});

});