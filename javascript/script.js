var gameActive = true;
var soundActivated = false;

function activateSound() {
	if (soundActivated == false) {
	  document.getElementById("scoreOne").play(); 
	  document.getElementById("scoreThree").play(); 
	  document.getElementById("scoreFive").play(); 
	  document.getElementById("clap").play(); 
	  document.getElementById("bust").play(); 
	  document.getElementById("gameOver").play(); 
	  soundActivated = true;
	}
};

function scoreOneSound() { 
  document.getElementById("scoreOne").play(); 
};

function scoreThreeSound() { 
  document.getElementById("scoreThree").play(); 

};

function scoreFiveSound() { 
  document.getElementById("scoreFive").play(); 
  document.getElementById("clap").play(); 
};

function bustSound() { 
  document.getElementById("bust").play(); 
};

function gameOverSound() { 
  document.getElementById("gameOver").play(); 
}; 

function rgbJSON(color) {
	var rgb = {
		"r": 255,
		"g": 255,
		"b": 255	
	};	
	if (color == "orange") {
		rgb = {
			"r": 255,
			"g": 255,
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

    	// Calculate score deltas before making the update to the UI
    	var delta1 = response.score1 - $("#score1").html();
    	var delta2 = response.score2 - $("#score2").html();
      	$("#score1").html(response.score1);
      	$("#score2").html(response.score2);

      	// Game over scenarios
		if (response.score1 == 21) {
			gameOverSound();
			$("#score1winner").show();
			gameActive = false;
		};
		if (response.score2 == 21) {
			gameOverSound();
			$("#score2winner").show();
			gameActive = false;
		};

		// Bust scenarios
		if (response.score1 > 21) {
			bustSound();
			$("#bust1").show();
			setTimeout(function(){
				$("#bust1").hide();
		    }, 4000);
		};
		if (response.score2 > 21) {
			bustSound();
			$("#bust2").show();
			setTimeout(function(){
				$("#bust2").hide();
		    }, 4000);
		};

		// Scoring scenarios
    	if (delta1 == 1 || delta2 == 1) {
    		scoreOneSound();
			//goveeAPI("orange", response.key);
    	};
    	if (delta1 == 3 || delta2 == 3) {
    		scoreThreeSound();
			//goveeAPI("orange", response.key);
    	};
    	if (delta1 > 4 || delta2 > 4) {
    		scoreFiveSound();
			//goveeAPI("orange", response.key);
    	};

    };
  };
  xhr.open('GET', '/data', true);
  xhr.send();
};

function resetGame() {
	activateSound();
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
	setInterval(updateScore, 250);

	//Reset game event listener
	$(".reset").click(function(){resetGame();});

});