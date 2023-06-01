var gameActive = true;
var soundActivated = false;
var gameColor = "orange";

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
  document.getElementById("scoreOne").load(); 
  document.getElementById("scoreOne").play(); 
};

function scoreThreeSound() { 
  document.getElementById("scoreThree").load(); 
  document.getElementById("scoreThree").play(); 

};

function scoreFiveSound() { 
  document.getElementById("scoreFive").load(); 
  document.getElementById("scoreFive").play(); 
  document.getElementById("clap").load(); 
  document.getElementById("clap").play(); 
};

function bustSound() { 
  document.getElementById("bust").load(); 
  document.getElementById("bust").play(); 
};

function gameOverSound() { 
  document.getElementById("gameOver").load(); 
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
			"r": 239,
			"g": 133,
			"b": 51	
		};		
	};
	if (color == "purple") {
		rgb = {
			"r": 126,
			"g": 44,
			"b": 245	
		};		
	};
	return rgb;
};

function goveeAPI(key) {
	if (gameColor == "orange") {
		gameColor = "purple";
	}
	else {
		gameColor = "orange";
	};
	$.ajax({
	  url: "https://developer-api.govee.com/v1/devices/control",
	  type: "PUT",
	  data: JSON.stringify({
		"device": "7B:36:D4:AD:FC:78:32:5A",
		"model": "H61A2",
		"cmd": { 
		  "name": "color", 
		  "value": { 
		  	"r": rgbJSON(gameColor).r, 
		  	"g": rgbJSON(gameColor).g, 
		  	"b": rgbJSON(gameColor).b}
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
			//goveeAPI(response.key);
			bustSound();
			$("#bust1").show();
			setTimeout(function(){
				$("#bust1").hide();
		    }, 4000);
		};
		if (response.score2 > 21) {
			//goveeAPI(response.key);
			bustSound();
			$("#bust2").show();
			setTimeout(function(){
				$("#bust2").hide();
		    }, 4000);
		};

		// Scoring scenarios
    	if (delta1 == 1 || delta2 == 1) {
				//goveeAPI(response.key);
    		scoreOneSound();
    	};
    	if (delta1 == 3 || delta2 == 3) {
				goveeAPI(response.key);
    		scoreThreeSound();
    	};
    	if ((delta1 > 4 && response.score1 < 21) || (delta2 > response.score2 < 21)) {
				//goveeAPI(response.key);
    		scoreFiveSound();
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