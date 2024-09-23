document.addEventListener("DOMContentLoaded", function () {
    let mode = null;
    let tiles = [];
    let tileStates = [];
    let gameActive = false;
    let clicks = 0;
    let clickLimit = 1;

    const winButton = document.getElementById("win-button");
    const loseButton = document.getElementById("lose-button");
    const playButton = document.getElementById("play-button");
    const clickSlider = document.getElementById("click-slider");
    const clickCount = document.getElementById("click-count");
    const tileGrid = document.getElementById("tile-grid");

    // Attach event listeners to buttons and slider
    winButton.addEventListener("click", () => setMode("WIN"));
    loseButton.addEventListener("click", () => setMode("LOSE"));
    playButton.addEventListener("click", startGame);
    clickSlider.addEventListener("input", updateClickLimit);

    // Set mode and enable play button
    function setMode(selectedMode) {
        mode = selectedMode;
        winButton.style.backgroundColor = selectedMode === "WIN" ? "#1E8449" : "#3498DB";
        loseButton.style.backgroundColor = selectedMode === "LOSE" ? "#922B21" : "#3498DB";
        playButton.disabled = false;
    }

    // Update click limit and display current value
    function updateClickLimit() {
        clickLimit = parseInt(clickSlider.value);
        clickCount.textContent = clickLimit;  // Display slider value next to slider
    }

    // Start the game
    function startGame() {
        gameActive = true;
        clicks = 0;
        playButton.disabled = true;
        generateTileStates();
        renderTiles();
    }

    // Generate 20 green tiles and 5 red tiles
    function generateTileStates() {
        tileStates = new Array(20).fill("green").concat(new Array(5).fill("red"));
        tileStates.sort(() => Math.random() - 0.5); // Shuffle array
    }

    // Render the 5x5 grid of tiles
    function renderTiles() {
        tileGrid.innerHTML = "";
        tiles = [];

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const tile = document.createElement("div");
                tile.classList.add("tile");
                tile.dataset.index = i * 5 + j;
                tile.addEventListener("click", clickTile);
                tileGrid.appendChild(tile);
                tiles.push(tile);
            }
        }
    }

    // Handle tile click
    function clickTile(e) {
        if (!gameActive || clicks >= clickLimit) return;

        const index = parseInt(e.target.dataset.index);
        clicks++;

        if (mode === "WIN") {
            forceTileColor(index, "green");
        } else if (mode === "LOSE" && clicks === clickLimit) {
            forceTileColor(index, "red");
        } else {
            forceTileColor(index, "green");
        }

        revealTile(tiles[index], tileStates[index]);

        if (clicks === clickLimit || (mode === "LOSE" && tileStates[index] === "red")) {
            revealAllTiles();
            endGame();
        }
    }

    // Ensure the nth clicked tile has the right color
    function forceTileColor(index, color) {
        if (tileStates[index] === color) return;

        const swapIndex = tileStates.indexOf(color);
        [tileStates[index], tileStates[swapIndex]] = [tileStates[swapIndex], tileStates[index]];
    }

    // Reveal individual tile
    function revealTile(tile, state) {
        tile.style.backgroundColor = state === "green" ? "#27AE60" : "#C0392B";
        tile.removeEventListener("click", clickTile);
    }

    // Reveal all tiles
    function revealAllTiles() {
        tiles.forEach((tile, i) => {
            setTimeout(() => revealTile(tile, tileStates[i]), i * 50);
        });
    }

    // End the game
    function endGame() {
        gameActive = false;
        playButton.disabled = false;
    }
});
