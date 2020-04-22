var board = null;
var characters = null;
var len = 5;

var movementLength = 2; //Ampiezza dell'area di movimento
var attackLength = 1; //Ampiezza dell'area di attacco

var teams = ["Blue", "Red"]; //Variabile che registra chi deve fare il turno corrente

var turn;

var movePhase = false;
var attackPhase = false;

var selectedBlock = {
	x : null,
	y : null
};

function begin()
{
	board = new Board(len);
	characters = new Array();
	characters[0] = new Character("Bylet", 0, 0, "Blue");
	characters[1] = new Character("Petra", 0, len-1, "Blue");
	characters[2] = new Character("Edelgard", len-1, 0, "Red");
	characters[3] = new Character("Claude", len-1, len-1, "Red");
	updateBoardCharacters();
	turn = new Turn();
}

function updateBoardCharacters()
{
	var currentX, currentY;
	var currentBlock;
	var imageWrapper;
	for (var i = 0; i < characters.length; i++) 
	{
		if(characters[i].alive == true)
		{
			currentX = characters[i].x;
			currentY = characters[i].y;
			currentBlock = board.blocks[currentX * len + currentY];
			
			if(currentBlock.occupied == false)
			{
				currentBlock.occupied = true;
				currentBlock.occupier = characters[i].name;

				imageWrapper = document.createElement("div");
				imageWrapper.className = "characterWrapper";
				imageWrapper.id = characters[i].name;
				imageWrapper.appendChild(characters[i].images.sprite);

				currentBlock.element.appendChild(imageWrapper);
			}
			/*currentBlock.element.className += " occupied"; //+ " " + character[i].name; da implementare*/
		}
	}
}