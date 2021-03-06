//Funzione che gestisce tutto il turno automatico di un personaggio nemico
//Facendolo muovere nel punto più vicino possibile ai personaggi del giocatore
//Facendolo attaccare, se possibile
//E richiamando l'autoturno del prossimo personaggio nemico, usando una funzione CallBack
Character.prototype.autoTurn =
function(i)
{
    this.showStats();
    this.showArea();
    var that = this;
    setTimeout(function(){that.autoMove();}, 2000);
    setTimeout(function(){updateBoardCharacters();}, 3000);
    setTimeout(function(){cleanArea();}, 3500);
    setTimeout(function(){that.showAttackArea();}, 4000);
    setTimeout(function(){that.autoAttack(i);}, 5000);
}

Character.prototype.autoMove =
function()
{
    var currentBlock, minDistanceBlock;
    var k = 0;
    //Per ogni personaggio del giocatore, il personaggio nemico troverà il blocco disponibile meno distante
    //Verrà poi preso il blocco dalla distanza minima rispetto a tutti i personaggi
    for(var i = 0; i < playerTeam.length; i++)
    {
        if(playerTeam[i].alive == true)
        {
            if(k == 0)
            {
                k++;
                minDistanceBlock = checkMinDistance(this, playerTeam[i]);
            }
            else
            {
                currentBlock = checkMinDistance(this, playerTeam[i]);
                if(currentBlock.dist < minDistanceBlock.dist)
                    minDistanceBlock = currentBlock;
                k++;
            }
        }
    }
    this.move(minDistanceBlock.block);
}

function checkMinDistance(character1, character2)
{
    var currentDistanceX, currentDistanceY;
    var currentBlock = {
        block : null,
        dist : 0
    };
    var minDistanceBlock = {
        block : null,
        dist : 0
    };
    var k = 0;

    for(let i = 0; i < character1.area.movementMatrix.length; i++)
    {
        if(character1.area.movementMatrix[i].movementBlock == true)
        {
            currentDistanceX = distance(character1.area.movementMatrix[i].x, character2.x);
            currentDistanceY = distance(character1.area.movementMatrix[i].y, character2.y);
            if(k == 0)
            {
                minDistanceBlock.block = character1.area.movementMatrix[i];
                minDistanceBlock.dist = currentDistanceX + currentDistanceY;
            }
            else
            {
                currentBlock.block = character1.area.movementMatrix[i];
                currentBlock.dist = currentDistanceX + currentDistanceY; 

                if(currentBlock.dist < minDistanceBlock.dist)
                {
                    minDistanceBlock.block = currentBlock.block;
                    minDistanceBlock.dist = currentBlock.dist;
                }
            }

            k++;
        }
    }

    return minDistanceBlock;
}

Character.prototype.autoAttack =
function(i)
{
    var currentArea = this.area.attackMatrix;
    var targetCharacter;
    var found;
    //Appena trovo un nemico nell'area di attacco, esco dal loop e lo attacco
    for(let i = 0; i < currentArea.length; i++)
    {
        if(currentArea[i].attackBlock == true && currentArea[i].occupied == true)
        {
            targetCharacter = findCharacter(currentArea[i].x, currentArea[i].y);
            if(targetCharacter != null && (targetCharacter.team != this.team) )
            {
                found = true;
                break;
            }
        }
    }
    
    if(found == true)
    {
        attackMenu(this, targetCharacter);
        duel(this, targetCharacter, true);
        setTimeout(
            function()
            {
                if(ended == true)
                {
                    return;
                }
                else
                {
                    cleanArea(); 
                    undo(true); 
                    cleanStats(); 
                    nextEnemyTurn(++i)
                }
            }, 
            5010
        );
    }
    else
    {
        cleanStats();
        cleanArea();
        nextEnemyTurn(++i);
    }
}