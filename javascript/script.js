function updateScore() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
    	var score1 = JSON.parse(xhr.responseText).score1;
    	var score2 = JSON.parse(xhr.responseText).score2;
      	document.getElementById('score1').textContent = score1;
      	document.getElementById('score2').textContent = score2;
		if (score1 == 21) {
			clearInterval(refreshIntervalId);
			document.getElementById('score1winner').style.display = "block";
		};
		if (score2 == 21) {
			clearInterval(refreshIntervalId);
			document.getElementById('score2winner').style.display = "block";
		};
		if (score1 > 21) {
			document.getElementById('bust1').style.display = "block";
			document.getElementById('score1').textContent = score1;
			setTimeout(function(){
				document.getElementById('bust1').style.display = "none";
		    }, 5000);
		};
		if (score2 > 21) {
			document.getElementById('bust2').style.display = "block";
			document.getElementById('score2').textContent = score2;
			setTimeout(function(){
				document.getElementById('bust2').style.display = "none";
		    }, 5000);
		};
    };
  };
  xhr.open('GET', '/data', true);
  xhr.send();
};
var refreshIntervalId = setInterval(updateScore, 1000);