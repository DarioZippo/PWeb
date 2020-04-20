function Block()
{
	this.x;
	this.y;
	this.element;

	this.occupied = false;
    this.occupier = "";
	
	this.selected = false;

    this.movementBlock = false;
	this.attackBlock = false;
	
	this.hover = this.highlight.bind(this);
	this.out = this.disableHighlight.bind(this);
	this.click = this.selectBlock.bind(this);
}

Block.prototype.addEvents =
function()
{
	this.element.addEventListener("mouseover", this.hover );
	this.element.addEventListener("mouseout", this.out );
	this.element.addEventListener("click", this.click );
}

Block.prototype.removeEvents =
function()
{	
	this.element.removeEventListener("mouseover", this.hover);
	this.element.removeEventListener("mouseout", this.out);
	this.element.removeEventListener("click", this.click);
}

Block.prototype.highlight =
function()
{
	//alert(this.className);
	this.element.className += " highlightedBlock";
}

Block.prototype.disableHighlight =
function()
{
	this.element.className = this.element.className.replace("highlightedBlock", "");
}

Block.prototype.selectBlock =
function()
{
	var classe = this.element.className;
	var currentCharacter;

	if(movePhase == true)
	{
		this.movement();
		return;
	}

	if(attackPhase == true)
	{
		this.attack();
		return;
	}

	if(selectedBlock.x != null && selectedBlock.y != null)
	{
		if(selectedBlock.x != this.x || selectedBlock.y != this.y)
		{
			cleanBlock(selectedBlock.x, selectedBlock.y);
		}
	}

	currentCharacter = findCharacter(this.x, this.y); //Trovo il personaggio nella posizione selezionata

	if(this.selected == false)	
	{	
		this.selected = true;
		this.element.className += " selectedBlock";
		
		if(currentCharacter != null)
		{
			currentCharacter.showStats();
			
			if(currentCharacter.movePoints > 0)
			{
				currentCharacter.showArea();
				movePhase = true;
			}
			else if(currentCharacter.attackPoints > 0)
			{
				currentCharacter.showAttackArea();
				attackPhase = true;
			}
		}
		else
		{
			cleanStats();
		}
			
		//Aggiorno la posizione del blocco selezionato
		selectedBlock.x = this.x; 
		selectedBlock.y = this.y;
	}
	else
	{
		cleanBlock(this.x, this.y);
		//Nessun blocco è selezionato
		selectedBlock.x = null; 
		selectedBlock.y = null;
	}

	//alert(this.element.className)
}

Block.prototype.movement =
function()
{
	if(this.movementBlock == true)
	{
		cleanBlock(selectedBlock.x, selectedBlock.y);
		currentCharacter = findCharacter(selectedBlock.x, selectedBlock.y);
		currentCharacter.move(this);
		currentCharacter.movePoints--;
		movePhase = false;
		updateBoardCharacters();

		selectedBlock.x = this.x; 
		selectedBlock.y = this.y;

		currentCharacter.showStats();

		return;
	}
	else
	{
		movePhase = false;
	}
}

Block.prototype.attack =
function()
{
	currentCharacter = findCharacter(selectedBlock.x, selectedBlock.y);
	if(this.attackBlock == true)
	{
		cleanBlock(selectedBlock.x, selectedBlock.y);
		var attackedCharacter = findCharacter(this.x, this.y);
		if(currentCharacter != null && attackedCharacter != null)
			attackMenu(currentCharacter, attackedCharacter);
		
		attackPhase = false;

		return;
	}
	else
	{
		attackPhase = false;
		cleanArea();
		selectedBlock.x = null; 
		selectedBlock.y = null;
	}
}