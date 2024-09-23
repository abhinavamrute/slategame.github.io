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
    const tileGrid = document.getElementById("tile-grid");

    winButton.addEventListener("click", () => setMode("WIN"));
    loseButton.addEventListener("click", () => setMode("LOSE"));
    playButton.addEventListener("click", startGame);
    clickSlider.addEventListener("input", updateClickLimit);

    function setMode(selectedMode) {
        mode = selectedMode;
        winButton.style.backgroundColor = selectedMode === "WIN" ? "#1E8449" : "#27AE60";
        loseButton.style.backgroundColor = selectedMode === "LOSE" ? "#922B21" : "#C0392B";
        playButton.disabled = false;
    }

    function updateClickLimit() {
        clickLimit = parseInt(clickSlider.value);
    }

    function startGame() {
        gameActive = true;
        clicks = 0;
        playButton.disabled = true;
        generateTileStates();
        renderTiles();
    }

    function generateTileStates() {
        // 20 green tiles and 5 red tiles
        tileStates = new Array(20).fill("green").concat(new Array(5).fill("red"));
        tileStates.sort(() => Math.random() - 0.5); // Shuffle the array
    }

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

    function clickTile(e) {
        if (!gameActive || clicks >= clickLimit) return;

        const index = parseInt(e.target.dataset.index);
        clicks++;

        if (mode === "WIN") {
            // In WIN mode, every clicked tile is forced to be green
            forceTileColor(index, "green");
        } else if (mode === "LOSE") {
            // In LOSE mode, the nth click should be red
            if (clicks === clickLimit) {
                forceTileColor(index, "red");
            } else {
                forceTileColor(index, "green");
            }
        }

        revealTile(tiles[index], tileStates[index]);

        if (clicks === clickLimit || (mode === "LOSE" && tileStates[index] === "red")) {
            revealAllTiles();
            endGame();
        }
    }

    function forceTileColor(index, color) {
        if (tileStates[index] === color) return;

        const swapIndex = tileStates.indexOf(color);
        [tileStates[index], tileStates[swapIndex]] = [tileStates[swapIndex], tileStates[index]];
    }

    function revealTile(tile, state) {
        tile.style.backgroundColor = state === "green" ? "#27AE60" : "#C0392B";
        tile.removeEventListener("click", clickTile);
    }

    function revealAllTiles() {
        tiles.forEach((tile, i) => {
            setTimeout(() => revealTile(tile, tileStates[i]), i * 50);
        });
    }

    function endGame() {
        gameActive = false;
        playButton.disabled = false;
    }
});
