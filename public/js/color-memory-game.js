;
(function(window) {
	'use strict';

	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function shuffle(o) {
		for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};

	function MemoryGame(options) {
		this.options = extend({}, this.options);
		extend(this.options, options);
		this.init();
	}
	MemoryGame.prototype.options = {
		containerID: "color-memory-game",
		colors: [{
			id: 1,
			img: "img/colour1.gif"
		}, {
			id: 2,
			img: "img/colour2.gif"
		}, {
			id: 3,
			img: "img/colour3.gif"
		}, {
			id: 4,
			img: "img/colour4.gif"
		}, {
			id: 5,
			img: "img/colour5.gif"
		}, {
			id: 6,
			img: "img/colour6.gif"
		}, {
			id: 7,
			img: "img/colour7.gif"
		}, {
			id: 8,
			img: "img/colour8.gif"
		}],
	}
	MemoryGame.prototype.init = function() {
		this.game = document.createElement("div");
		this.game.id = "ColorGame";
		this.game.className = "ColorGame";
		document.getElementById(this.options.containerID).appendChild(this.game);
		this.gameMeta = document.createElement("div");
		this.gameMeta.className = "ColorGame-meta clearfix";
		this.gameStartScreen = document.createElement("div");
		this.gameStartScreen.id = "ColorGame-start-screen";
		this.gameStartScreen.className = "ColorGame-start-screen";
		this.gameWrapper = document.createElement("div");
		this.gameWrapper.id = "ColorGame-wrapper";
		this.gameWrapper.className = "ColorGame-wrapper";
		this.gameContents = document.createElement("div");
		this.gameContents.id = "ColorGame-contents";
		this.gameWrapper.appendChild(this.gameContents);
		this.gameMessages = document.createElement("div");
		this.gameMessages.id = "ColorGame-onend";
		this.gameMessages.className = "ColorGame-onend";
		this.setupGame();
	};
	var goLeft = function() {
		var element = document.getElementById('color-game-hover')
		var hoverPosition = element.className.match(/\d+/)[0];
		if (parseInt(hoverPosition) !== 1) {
			element.removeAttribute("id");
			var new_class_name = "ColorGame-tile-" + (parseInt(hoverPosition) - 1);
			var new_element = document.getElementsByClassName(new_class_name)[0];
			new_element.id = 'color-game-hover';
		}
		return;
	}
	var goRight = function() {
		var element = document.getElementById('color-game-hover')
		var hoverPosition = element.className.match(/\d+/)[0];
		if (parseInt(hoverPosition) !== 16) {
			element.removeAttribute("id");
			var new_class_name = "ColorGame-tile-" + (parseInt(hoverPosition) + 1);
			var new_element = document.getElementsByClassName(new_class_name)[0];
			new_element.id = 'color-game-hover';
		}
		return;
	}
	var goUp = function() {
		var element = document.getElementById('color-game-hover')
		var hoverPosition = element.className.match(/\d+/)[0];
		if (parseInt(hoverPosition) > 4) {
			element.removeAttribute("id");
			var new_class_name = "ColorGame-tile-" + (parseInt(hoverPosition) - 4);
			var new_element = document.getElementsByClassName(new_class_name)[0];
			new_element.id = 'color-game-hover';
		}
		return;
	}
	var goDown = function() {
		var element = document.getElementById('color-game-hover')
		var hoverPosition = element.className.match(/\d+/)[0];
		if (parseInt(hoverPosition) <= 12) {
			element.removeAttribute("id");
			var new_class_name = "ColorGame-tile-" + (parseInt(hoverPosition) + 4);
			var new_element = document.getElementsByClassName(new_class_name)[0];
			new_element.id = 'color-game-hover';
		}
		return;
	}

	var selectCard = function() {
		var element = document.getElementById('color-game-hover');
		var eleChild = element.childNodes;
		var i = 0;
		var j = eleChild.length;
		while (i < j) {
			if (eleChild[i].className == "ColorGame-tile--inner") {
				var elementCard = eleChild[i];
			}
			i++;
		}
	}

	MemoryGame.prototype.setupGame = function() {
		var self = this;
		this.gameState = 1;
		this.colors = shuffle(this.options.colors);
		this.card1 = "";
		this.card2 = "";
		this.card1id = "";
		this.card2id = "";
		this.card1flipped = false;
		this.card2flipped = false;
		this.flippedTiles = 0;
		this.userScore = 0;
		this.tries = 0;

		this.game.appendChild(this.gameMeta);

		this.game.appendChild(this.gameStartScreen);

		document.getElementById("restart-button").addEventListener("click", function(e) {
			self.resetGame();
		});


		var xhr = new XMLHttpRequest();
		xhr.open("GET", '/api/highscores', false);
		xhr.send(null);
		this.currentHighscore = JSON.parse(xhr.responseText);

		var html = '';
		this.currentHighscore.forEach(function(element, index) {
			html = html + '<li>' + element.username + ' | ' + element.score + '</li>';
		});
		document.getElementById("highscores").innerHTML = '<span class="score-title">Highscores</span><ul>' + html + '</ul>';
		this.setupGameWrapper();
	}

	MemoryGame.prototype.setupGameWrapper = function() {
		this.gameContents.className = "ColorGame-contents ColorGame-plan";
		this.game.appendChild(this.gameWrapper);
		this.renderTiles();
	};

	MemoryGame.prototype.renderTiles = function() {
		this.gridX = 4;
		this.gridY = 4;
		this.numTiles = this.gridX * this.gridY;
		this.halfNumTiles = this.numTiles / 2;
		this.newCards = [];
		for (var i = 0; i < this.halfNumTiles; i++) {
			this.newCards.push(this.colors[i], this.colors[i]);
		}
		this.newCards = shuffle(this.newCards);
		this.tilesHTML = '';
		var hoverID = null;
		for (var i = 0; i < this.numTiles; i++) {
			var n = i + 1;
			if (n === 16) {
				hoverID = 'color-game-hover';
			}
			this.tilesHTML += '<div class="ColorGame-tile ColorGame-tile-' + n + '" id="' + hoverID + '">\
						  <div class="ColorGame-tile--inner" data-id="' + this.newCards[i]["id"] + '">\
						  <span class="ColorGame-tile--outside"></span>\
						  <span class="ColorGame-tile--inside"><img src="' + this.newCards[i]["img"] + '"></span>\
						  </div>\
						  </div>';
		}
		this.gameContents.innerHTML = this.tilesHTML;
		this.gameState = 2;
		this.gamePlay();
	}

	MemoryGame.prototype.gamePlay = function() {
		var tiles = document.querySelectorAll(".ColorGame-tile--inner");
		for (var i = 0, len = tiles.length; i < len; i++) {
			var tile = tiles[i];
			this.gamePlayEvents(tile);
		};
	};

	MemoryGame.prototype.gamePlayEvents = function(tile) {
		var self = this;
		document.onkeydown = function(e) {
			e = e || window.event;
			switch (e.which || e.keyCode) {
				case 37:
					goLeft(); // left
					break;
				case 38:
					goUp(); // up
					break;
				case 39:
					goRight(); // right
					break;
				case 40:
					goDown(); // down
					break;
				case 13:
					flipthiscard();
					break;
				default:
					return; //exit
			}
		}

		var flipthiscard = function(e) {
			var element = document.getElementById('color-game-hover');
			var eleChild = element.childNodes;
			var i = 0;
			var j = eleChild.length;
			while (i < j) {
				if (eleChild[i].className == "ColorGame-tile--inner") {
					var elementCard = eleChild[i];
				}
				i++;
			}
			if (elementCard !== undefined && !elementCard.classList.contains("flipped")) {
				if (self.card1flipped === false && self.card2flipped === false) {
					elementCard.classList.add("flipped");
					self.card1 = elementCard;
					self.card1id = elementCard.getAttribute("data-id");
					self.card1flipped = true;
				} else if (self.card1flipped === true && self.card2flipped === false) {
					elementCard.classList.add("flipped");
					self.card2 = elementCard;
					self.card2id = elementCard.getAttribute("data-id");
					self.card2flipped = true;
					if (self.card1id == self.card2id) {
						self.gameCardsMatch();
					} else {
						self.gameCardsMismatch();
					}
				}
			}
		}
	}

	MemoryGame.prototype.gameCardsMatch = function() {
		var self = this;

		this.startTime = (this.startTime === undefined) ? Math.floor(Date.now() / 1000) : this.startTime;
		window.setTimeout(function() {
			self.card1.classList.add("correct");
			self.card2.classList.add("correct");
		}, 200);

		window.setTimeout(function() {
			self.card1.classList.remove("correct");
			self.card2.classList.remove("correct");
			self.gameResetVars();
			self.flippedTiles = self.flippedTiles + 2;
			if (self.flippedTiles == self.numTiles) {
				self.winGame();
			}
		}, 1000);

		this.gameCounterPlusOne();
	};

	MemoryGame.prototype.gameCardsMismatch = function() {
		var self = this;

		this.startTime = (this.startTime === undefined) ? Math.floor(Date.now() / 1000) : this.startTime;
		window.setTimeout(function() {
			self.card1.classList.remove("flipped");
			self.card2.classList.remove("flipped");
			self.gameResetVars();
		}, 900);

		this.gameCounterMinusOne();
	};

	MemoryGame.prototype.gameResetVars = function() {
		this.card1 = "";
		this.card2 = "";
		this.card1id = "";
		this.card2id = "";
		this.card1flipped = false;
		this.card2flipped = false;
	}

	MemoryGame.prototype.gameCounterPlusOne = function() {
		this.userScore = this.userScore + 1;
		this.tries = this.tries + 1;
		document.getElementById("score-count").innerHTML = this.userScore;
		document.getElementById("user-tries").innerHTML = this.tries;
	};

	MemoryGame.prototype.gameCounterMinusOne = function() {
		this.userScore = this.userScore - 1;
		this.tries = this.tries + 1;
		document.getElementById("score-count").innerHTML = this.userScore;
		document.getElementById("user-tries").innerHTML = this.tries;
	};

	MemoryGame.prototype.clearGame = function() {
		if (this.gameMeta.parentNode !== null) this.game.removeChild(this.gameMeta);
		if (this.gameStartScreen.parentNode !== null) this.game.removeChild(this.gameStartScreen);
		if (this.gameWrapper.parentNode !== null) this.game.removeChild(this.gameWrapper);
		if (this.gameMessages.parentNode !== null) this.game.removeChild(this.gameMessages);
		document.getElementById("score-count").innerHTML = 0;
		document.getElementById("user-tries").innerHTML = 0;
	}

	MemoryGame.prototype.xhttpPOSTRequest = function(url, obj) {
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", url, false);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send(JSON.stringify(obj));
		return xhttp.responseText;
	}

	MemoryGame.prototype.winGame = function() {
		var self = this;
		this.gameTime = Math.floor(Date.now() / 1000) - this.startTime;
		var minutes = Math.floor(this.gameTime / 60);
		var seconds = this.gameTime - minutes * 60;

		var stat_values = {};
		stat_values.score = this.userScore;
		stat_values.time = this.gameTime;
		var stats = JSON.parse(this.xhttpPOSTRequest('/api/stats', stat_values));

		this.clearGame();
		this.gameMessages.innerHTML = '<h2 class="ColorGame-onend--heading">Congratulations !</h2><p class="ColorGame-onend--message">You did this in ' + this.tries + ' tries , you have score ' + this.userScore + '. <br> You completed the game in ' + minutes + ':' + seconds + ' minutes, ' + stats.timestat + ' % of other players do better ! <br> You are rank ' + stats.rank + ' in our highscore please submit below or just play again for fun ! </p><br><input type="text" maxlength="20" class="input" name="username" id="username" placeholder="username"><br><input type="email" class="input" name="email" placeholder="email" id="email"><br><br><button id="submit-score-button" class="color-game-button">Submit Score</button><br><br><button id="restart-game" class="color-game-button">Play again?</button>';
		this.game.appendChild(this.gameMessages);
		document.getElementById("restart-game").addEventListener("click", function(e) {
			self.resetGame();
		});
		document.getElementById("submit-score-button").addEventListener("click", function(e) {
			self.submitScore();
		});
	}

	MemoryGame.prototype.resetGame = function() {
		this.clearGame();
		this.setupGame();
	};

	MemoryGame.prototype.submitScore = function() {
		this.sendScore();
		this.clearGame();
		this.setupGame();
	};

	MemoryGame.prototype.sendScore = function() {
		var result = {};
		result.username = document.getElementById('username').value;
		result.email = document.getElementById('email').value;
		result.score = this.userScore;
		result.time = this.gameTime;
		result.tries = this.tries;
		this.xhttpPOSTRequest('/api/user/add', result);
	};

	window.MemoryGame = MemoryGame;

})(window);
