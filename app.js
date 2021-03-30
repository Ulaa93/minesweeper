document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	let width = 20;
	let bombAmount = 20;
	let flags = 0;
	let squares = [];
	let isGameOver = false;

	function createBoard() {
		const bombsArray = Array(bombAmount).fill('bomb');
		const emptyArray = Array(width * width - bombAmount).fill('valid');
		const gameArray = emptyArray.concat(bombsArray);
		const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
		const reset = document.createElement('button');
		reset.textContent = 'Reset';
		reset.classList.add('btn-reset');
		for (let i = 0; i < width * width; i++) {
			const square = document.createElement('div');
			square.setAttribute('id', i);
			square.classList.add(shuffledArray[i]);
			grid.appendChild(square);
			squares.push(square);
			square.addEventListener('click', function (e) {
				click(square);
			});
			square.oncontextmenu = function (e) {
				e.preventDefault();
				addFlag(square);
			};
		}

		for (let i = 0; i < squares.length; i++) {
			let total = 0;
			const isLeftEdge = i % width === 0;
			const isRightEdge = i % width === width - 1;
			if (squares[i].classList.contains('valid')) {
				if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb'))
					total++;
				if (
					i > width - 1 &&
					!isRightEdge &&
					squares[i + 1 - width].classList.contains('bomb')
				)
					total++;
				if (i > width && squares[i - width].classList.contains('bomb')) total++;
				if (
					i > width + 1 &&
					!isLeftEdge &&
					squares[i - width - 1].classList.contains('bomb')
				)
					total++;
				if (
					i < squares.length - 1 &&
					!isRightEdge &&
					squares[i + 1].classList.contains('bomb')
				)
					total++;
				if (
					i < squares.length - width &&
					!isLeftEdge &&
					squares[i + width - 1].classList.contains('bomb')
				)
					total++;
				if (
					i < squares.length - width - 1 &&
					!isRightEdge &&
					squares[i + 1 + width].classList.contains('bomb')
				)
					total++;
				if (
					i < squares.length - width &&
					squares[i + width].classList.contains('bomb')
				)
					total++;
				squares[i].setAttribute('data', total);
			}
		}
		grid.appendChild(reset);
		reset.addEventListener('click', resetBoard);
	}

	createBoard();

	function addFlag(square) {
		if (isGameOver) return;
		if (!square.classList.contains('checked') && flags <= bombAmount) {
			if (!square.classList.contains('flag') && flags < bombAmount) {
				square.classList.add('flag');
				square.innerHTML = '🚩';
				flags++;
				checkForWin(square);
			} else if (square.classList.contains('flag')) {
				square.classList.remove('flag');
				square.innerHTML = '';
				flags--;
			}
		}
	}

	function click(square) {
		let currentId = square.id;
		if (isGameOver) return;
		if (
			square.classList.contains('checked') ||
			square.classList.contains('flag')
		)
			return;
		if (square.classList.contains('bomb')) {
			gameOver(square);
		} else {
			let total = square.getAttribute('data');
			if (total != 0) {
				square.classList.add('checked');
				square.innerHTML = total;
				return;
			}
			checkSquare(square, currentId);
			square.classList.add('checked');
		}
	}

	function checkSquare(square, currentId) {
		const isLeftEdge = currentId % width === 0;
		const isRightEdge = currentId % width === width - 1;

		setTimeout(() => {
			if (currentId > 0 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > width - 1 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1 - width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > width) {
				const newId = squares[parseInt(currentId) - width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > width + 1 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1 - width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < squares.length - 1 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < squares.length - width && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1 + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < squares.length - width - 1 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1 + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < squares.length - width) {
				const newId = squares[parseInt(currentId) + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
		}, 10);
	}

	function gameOver(square) {
		isGameOver = true;
		squares.forEach((square) => {
			if (square.classList.contains('bomb')) {
				square.innerHTML = '💣 ';
			}
		});
		showResult('Game over! You lose!', 'far fa-dizzy');
	}

	function checkForWin() {
		let matches = 0;
		for (let i = 0; i < squares.length; i++) {
			if (
				squares[i].classList.contains('flag') &&
				squares[i].classList.contains('bomb')
			) {
				matches++;
			}
		}
		if (matches === bombAmount) {
			isGameOver = true;
			showResult('Congratulation! You win!', 'far fa-grin-beam');
		}
	}

	function showResult(message, icon) {
		const resultEl = document.createElement('div');
		resultEl.classList.add('message-result');
		grid.appendChild(resultEl);
		resultEl.innerHTML = `
        <p>${message}</p>
        <i class='${icon}'></i>
        <button class="close-result">Close</button>
        `;
		const clearMess = document.querySelector('.close-result');
		clearMess.addEventListener('click', clearMessage);
	}

	function resetBoard() {
		squares = [];
		flags = 0;
		isGameOver = false;
		grid.innerHTML = '';
		createBoard();
	}

	function clearMessage() {
		const resultEl = document.querySelector('.message-result');
		resultEl.style.display = 'none';
	}
});
