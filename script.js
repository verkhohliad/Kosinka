var suit = ['bubna', 'cherva', 'pika', 'trefa'];
var valueCards = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];

//Координаты для контейнеров
var COORDS_FOR_COLUMN = {
	first_X: 350,
	Y: 200,
	distanceBetweenColumn: 10,
	distanceBetweenCards: 15
};
var COORDS_FOR_COLLECTION = {
	first_X: 700,
	Y: 20,
	distanceBetweenCollection: 10
};
var COORDS_FOR_DECK_AND_NEAR_COLLECTION = {
	X_DECK: 300,
	Y: 20,
	distanceBetweenCards: 0.2,
	X_COLLECTION_NEAR_DECK: 400
};

//объекты контейнеров и вспомогательные переменные
var deck;
var collectionNearDeck;
var collections = [];
var NUM_COLLECTIONS = 4;
var columns = [];
var NUM_COLUMNS = 7;

//счетчик для того, чтобы всегда действующий элемент был выше других
var counterForZIndex = 3;

//класс карты
function Card(){
  this.frontSide = document.createElement('img');
  this.backSide = document.createElement('img');

  this.whichContainerHaveThisCard = null;

  this.X = 0;
  this.Y = 0;

  this.CARD = document.createElement('div');

  
  
  this.backSide.src = 'cards/backSide.png';

  this.backSide.className = 'backSide';
  this.frontSide.className = 'frontSide';

  this.CARD.className = 'card';


  this.frontSide.style.display = 'none';

  var self = this;

  this.updateLocation = function(){
  	self.CARD.style.left = self.X + 'px';
  	self.CARD.style.top = self.Y + 'px';
  };

  
 
  document.body.appendChild(this.CARD);


  this.CARD.appendChild(this.frontSide);
  this.CARD.appendChild(this.backSide);

  this.changeSide = function(){
  	/*
  	if(self.backSide.style.display == ''){
    self.backSide.style.display = 'none';
    self.frontSide.style.display = '';
    }
    else if(self.frontSide.style.display == ''){
  	self.backSide.style.display = '';
    self.frontSide.style.display = 'none';
    }
    */

    if(self.CARD.querySelector('.backSide').style.display == ''){
      self.CARD.querySelector('.backSide').style.display = 'none';
      self.CARD.querySelector('.frontSide').style.display = '';
    }
    else {
  	  self.CARD.querySelector('.backSide').style.display = '';
      self.CARD.querySelector('.frontSide').style.display = 'none';
    }
  };
}

//контейнер колоды
function ContainerOfDeck(){
  this.arr = [];

  this.DECK = document.createElement('div');


  this.DECK.style.left = COORDS_FOR_DECK_AND_NEAR_COLLECTION.X_DECK + 'px';
  this.DECK.style.top = COORDS_FOR_DECK_AND_NEAR_COLLECTION.Y + 'px';
  this.DECK.className = 'basis';

  document.body.appendChild(this.DECK);



  this.add = function(card){
  	this.arr.push(card);

  	card.X = COORDS_FOR_DECK_AND_NEAR_COLLECTION.X_DECK + COORDS_FOR_DECK_AND_NEAR_COLLECTION.distanceBetweenCards * (this.arr.length-1);
  	card.Y = COORDS_FOR_DECK_AND_NEAR_COLLECTION.Y;

  	card.updateLocation();

  	card.whichContainerHaveThisCard = 'ContainerOfDeck';
  	//card.whichContainerHaveThisCard = deck;
  };
}

//контейнер коллекции
function ContainerOfCollection(X, Y){
  this.arr = [];

  this.COLLECTION = document.createElement('div');

  this.COLLECTION.style.left = X + 'px';
  this.COLLECTION.style.top = Y + 'px';
  this.COLLECTION.className = 'basis';

  document.body.appendChild(this.COLLECTION);

  this.add = function(card){
  	this.arr.push(card);

  	card.X = X;
  	card.Y = Y;

  	card.updateLocation();

  	card.whichContainerHaveThisCard = 'ContainerOfCollection';

  };
}

//контейнер столбца
function ContainerOfColumn(X, Y){
  this.arr = [];

  this.COLUMN = document.createElement('div');

  this.COLUMN.style.left = X + 'px';
  this.COLUMN.style.top = Y + 'px';
  this.COLUMN.className = 'basis';

  document.body.appendChild(this.COLUMN);


  this.add = function(card){
  	this.arr.push(card);

  	card.X = X;
  	card.Y = Y + COORDS_FOR_COLUMN.distanceBetweenCards * (this.arr.length - 1);

  	card.updateLocation();

  	card.whichContainerHaveThisCard = 'ContainerOfColumn';
  }
}


//инициализация объектов всех контейнеров
function initializationBasis(){
  deck = new ContainerOfDeck();

  collectionNearDeck = new ContainerOfCollection(COORDS_FOR_DECK_AND_NEAR_COLLECTION.X_COLLECTION_NEAR_DECK,
  																				COORDS_FOR_DECK_AND_NEAR_COLLECTION.Y);
  for(var i = 0; i < NUM_COLLECTIONS; i++){
  	if(i == 0){
  	  collections[i] = new ContainerOfCollection(COORDS_FOR_COLLECTION.first_X, COORDS_FOR_COLLECTION.Y);
  	}
  	else{
  		var coords = collections[i-1].COLLECTION.getBoundingClientRect();
  		collections[i] = new ContainerOfCollection(coords.right + COORDS_FOR_COLLECTION.distanceBetweenCollection, 
  												   COORDS_FOR_COLLECTION.Y);
  	}
  }

  for(var i = 0; i < NUM_COLUMNS; i++){
  	if(i == 0){
  	  columns[i] = new ContainerOfColumn(COORDS_FOR_COLUMN.first_X, COORDS_FOR_COLUMN.Y);
  	}
  	else{
  	  var coords = columns[i-1].COLUMN.getBoundingClientRect();
  	  columns[i] = new ContainerOfColumn(coords.right + COORDS_FOR_COLUMN.distanceBetweenColumn, COORDS_FOR_COLUMN.Y);
    }
  }
}

//создание колоды
function createDeck(){
  var card;

  for(var i = 0; i < suit.length; i++){
  	for(var j = 0; j < valueCards.length; j++){
  	  card = new Card();
  	  card.frontSide.src = 'cards/' + suit[i] + '/' + valueCards[j] + '.jpg';

  	  deck.add(card);
  	}
  }
}

//перемешивание колоды
function shakeDeck(){
  var random1, random2;

  for(var i = 0; i < deck.arr.length * 3; i++){
    random1 = Math.floor(Math.random() * deck.arr.length);
    random2 = Math.floor(Math.random() * deck.arr.length);
  
    swapCards(deck.arr[random1],deck.arr[random2]);
  }
}

//замена картинки карт
function swapCards(card1, card2){
  var temp1 = card1.CARD.querySelector('.frontSide').cloneNode(false);
  var temp2 = card2.CARD.querySelector('.frontSide').cloneNode(false);

  card1.CARD.replaceChild(temp2, card1.CARD.querySelector('.frontSide'));
  card2.CARD.replaceChild(temp1, card2.CARD.querySelector('.frontSide'));
}

//разбрасывание карт из колоды в столбцы
function packageDeck(){
  var card;
  var k = 1;// counterForReduceDeckArr = deck.arr.length;

  for(var i = 0; i < columns.length; i++){
  	for(var j = 0; j < k; j++){

  	  card = deck.arr.pop();

  	  card.CARD.style.cssText = 'z-index: ' + counterForZIndex + ';';
  	  //document.body.appendChild(card.CARD);
  	  columns[i].add(card);

  	  counterForZIndex++;
  	}
  	k++;
  }

  for(var i = 0; i < columns.length; i++){
  	columns[i].arr[columns[i].arr.length - 1].changeSide();
  }
}

//уничтожение всех карт(требуется для начала новой игры)
function destroyCards(){
  var arr = document.querySelectorAll('.card');
  for(var i = 0; i < arr.length; i++){
    document.body.removeChild(arr[i]);
  }

  deck.arr.length = 0;
  collectionNearDeck.arr.length = 0;
  for(var i = 0; i < columns.length; i++){
  	columns[i].arr.length = 0;
  }
  for(var i = 0; i < collections.length; i++){
    collections[i].arr.length = 0;
  }
}

//начало новой игры
function startGame(){
  initializationBasis();
  createDeck();
  shakeDeck();
  setTimeout(packageDeck, 1);
}



//функция, для клика на колоде(возвращает все открытые карты в колоду)
function goBackInDeck(){
  var card, num = collectionNearDeck.arr.length;
  for(var i = 0; i < num; i++){
    card = collectionNearDeck.arr.pop();
    card.changeSide();

    card.CARD.style.zIndex = counterForZIndex;
    counterForZIndex++;

    deck.add(card);
  }
}



//отключение стандартного DnD
document.ondragstart = function() {
  return false;
};

//по элементу HTML(div), по которому был совершен клик найдем объект, которому он пренадлежит и массив элементов, которые
//уже лежат над ним в правильном порядке
function searchObjectLikeTarget(elem){
  
  var arrAdditionalElem = [];
  var result = {};

  if(deck.arr[deck.arr.length - 1] != undefined && deck.arr[deck.arr.length - 1].CARD === elem){
  	result.elem = deck.arr[deck.arr.length - 1];
  	return result;
  }

 

  if(collectionNearDeck.arr[collectionNearDeck.arr.length - 1] != undefined &&
  									 collectionNearDeck.arr[collectionNearDeck.arr.length - 1].CARD === elem){
  	result.elem = collectionNearDeck.arr[collectionNearDeck.arr.length - 1];
  	return result;
  }
  

  for(var i = 0; i < collections.length; i++){
    if(collections[i].arr[collections[i].arr.length - 1] != undefined &&
    								 collections[i].arr[collections[i].arr.length - 1].CARD === elem){
      result.elem = collections[i].arr[collections[i].arr.length - 1];
      return result;
    }
  }

  for(var i = 0; i < columns.length; i++){
    if(columns[i].arr[columns[i].arr.length - 1] != undefined &&
    								 columns[i].arr[columns[i].arr.length - 1].CARD === elem){
      result.elem = columns[i].arr[columns[i].arr.length - 1]
      return result;
    }
  }


  /********************/

  EXIT:for(var i = 0; i < columns.length; i++){
    for(var j = 0; j < columns[i].arr.length; j++){
      if(columns[i].arr[j].CARD.querySelector('.frontSide').style.display == '' && columns[i].arr[j].CARD === elem){
        for(var k = j+1, h = j, l = 0; k < columns[i].arr.length; k++, h++, l++){
          if(checkForDifferentSuit(columns[i].arr[k].CARD, columns[i].arr[h].CARD) == true && 
      	 										checkForReduce(columns[i].arr[k].CARD, columns[i].arr[h].CARD) == true){
          	arrAdditionalElem[l] = columns[i].arr[k];
            if(k == columns[i].arr.length - 1){
              result.arrAdditionalElem = arrAdditionalElem;
              result.elem = columns[i].arr[j];
              return result;
            }
          } else break EXIT;
        }
      }
    }
  }
  /***************************************/
  result.elem = undefined;
  return result;
}

//находим в какой контейнер собираемся добавить элемент
function searchObjectOfBasis(elem){
  var coords = elem.getBoundingClientRect();
  for(var i = 0; i < collections.length; i++){
    
    if(collections[i].COLLECTION.getBoundingClientRect().left == coords.left && 
    	collections[i].COLLECTION.getBoundingClientRect().top == coords.top){
      return collections[i];
    }
  }
  for(var i = 0; i < columns.length; i++){
  	
  	if(columns[i].COLUMN.getBoundingClientRect().left == coords.left &&
  		columns[i].COLUMN.getBoundingClientRect().top == coords.top){
  	  return columns[i];
  	}
  }
}

//открываем одну карту из колоды
function goOneCardFromDeckInCollectionNearDeck(){
  var card;

  card = deck.arr.pop();

  //document.body.appendChild(card.CARD);
  
  card.CARD.style.cssText = 'z-index: ' + counterForZIndex + ';';
  card.changeSide();

  collectionNearDeck.add(card);
 
  counterForZIndex++;
}


//получаем координаты элемента
function getCoords(elem){
  var box = elem.CARD.getBoundingClientRect();

  return {
    top: box.top,
    left: box.left
  };
}

//проверка цвета рубашки
function isRedSuit(suit){
  if(suit == 'bubna' || suit == 'cherva'){
  	return true;
  }
  else if(suit == 'pika' || suit == 'trefa'){
  	return false;
  }
}

//проверрка на различие цветов рубашек двух карт
function checkForDifferentSuit(card1, card2){
  var pctr1, pctr2, suit1, suit2;

  pctr1 = card1.querySelector('.frontSide').cloneNode(false);
  pctr2 = card2.querySelector('.frontSide').cloneNode(false);


  suit1 = pctr1.src.slice(pctr1.src.lastIndexOf('s') + 2, pctr1.src.lastIndexOf('/'));
  suit2 = pctr2.src.slice(pctr2.src.lastIndexOf('s') + 2, pctr2.src.lastIndexOf('/'));


  if((isRedSuit(suit1) == true && isRedSuit(suit2) == true) || (isRedSuit(suit1) == false && isRedSuit(suit2) == false)){
    return false;
  }
  else{
  	return true;
  }
}

//проверка на схождение рубашек у двух карт
function checkForSameSuit(card1, card2){
  var pctr1, pctr2, suit1, suit2;

  pctr1 = card1.querySelector('.frontSide').cloneNode(false);
  pctr2 = card2.querySelector('.frontSide').cloneNode(false);


  suit1 = pctr1.src.slice(pctr1.src.lastIndexOf('s') + 2, pctr1.src.lastIndexOf('/'));
  suit2 = pctr2.src.slice(pctr2.src.lastIndexOf('s') + 2, pctr2.src.lastIndexOf('/'));

  for(var i = 0; i < suit.length; i++){
    if(suit[i] == suit1 && suit[i] == suit2){
      return true;
    }
  }
  return false;
}

//проверка на убывание карт
function checkForReduce(added, sitteth){
  var pctrAdded, pctrSitteth, strengthAdded, strengthSitteth, kAdded, kSitteth;

  pctrAdded = added.querySelector('.frontSide').cloneNode(false);
  pctrSitteth = sitteth.querySelector('.frontSide').cloneNode(false);

  strengthAdded = pctrAdded.src.slice(pctrAdded.src.lastIndexOf('/') + 1, pctrAdded.src.lastIndexOf('.'));
  strengthSitteth = pctrSitteth.src.slice(pctrSitteth.src.lastIndexOf('/') + 1, pctrSitteth.src.lastIndexOf('.'));

  for(var i = 0; i < valueCards.length; i++){
    if(valueCards[i] == strengthAdded){
      kAdded = i;
    }
    if(valueCards[i] == strengthSitteth){
      kSitteth = i;
    }
  }


  if(kAdded == kSitteth-1){
    return true;
  }
  else{
    return false;
  } 
}

function checkForGrow(added, sitteth){
  var pctrAdded, pctrSitteth, strengthAdded, strengthSitteth, kAdded, kSitteth;

  pctrAdded = added.querySelector('.frontSide').cloneNode(false);
  pctrSitteth = sitteth.querySelector('.frontSide').cloneNode(false);

  strengthAdded = pctrAdded.src.slice(pctrAdded.src.lastIndexOf('/') + 1, pctrAdded.src.lastIndexOf('.'));
  strengthSitteth = pctrSitteth.src.slice(pctrSitteth.src.lastIndexOf('/') + 1, pctrSitteth.src.lastIndexOf('.'));

  for(var i = 1; i < valueCards.length; i++){
    if(valueCards[i] == strengthAdded && valueCards[i-1] == strengthSitteth){
      return true;
    }
  }
  return false;

}

//удаление из старого контейнера при добавлении в новый
function deleteFromOldContainer(card, arrAdditionalElem){
  if(card.whichContainerHaveThisCard === 'ContainerOfCollection'){
  	EXIT:for(var i = 0; i < collections.length; i++){
      for(var j = 0; j < collections[i].arr.length; j++){
        if(collections[i].arr[j] === card){
        	collections[i].arr.pop();
        	break EXIT;
        }
      }
    }
    EXIT:for(var i = 0; i < collectionNearDeck.arr.length; i++){
      if(collectionNearDeck.arr[i] === card){
        collectionNearDeck.arr.pop();
        break EXIT;
      }
    }
  } else if(card.whichContainerHaveThisCard === 'ContainerOfColumn' && arrAdditionalElem === undefined){
     EXIT:for(var i = 0; i < columns.length; i++){
            for(var j = 0; j < columns[i].arr.length; j++){
            if(columns[i].arr[j] === card){
          	  columns[i].arr.pop();
          	  if(columns[i].arr.length && 
          	  				columns[i].arr[columns[i].arr.length - 1].CARD.querySelector('.frontSide').style.display == 'none'){
          	    columns[i].arr[columns[i].arr.length - 1].changeSide();
          	  }
          	  break EXIT;
          }
        }
      }
  } else if(card.whichContainerHaveThisCard === 'ContainerOfColumn' && arrAdditionalElem !== undefined){
  	EXIT:for(var i = 0; i < columns.length; i++){
            for(var j = columns[i].arr.length - 1; j >= 0; j--){
              for(var l = 0; l < arrAdditionalElem.length; l++){
                if(columns[i].arr[j] === arrAdditionalElem[l]){
                  columns[i].arr.pop();
                  //break EXIT;
                }
              }
              //break EXIT;
        	}
        }
        EXIT:for(var i = 0; i < columns.length; i++){
            for(var j = 0; j < columns[i].arr.length; j++){
            if(columns[i].arr[j] === card){
          	  columns[i].arr.pop();
          	  if(columns[i].arr.length &&
          	  		columns[i].arr[columns[i].arr.length - 1].CARD.querySelector('.frontSide').style.display == 'none'){
          	    columns[i].arr[columns[i].arr.length - 1].changeSide();
          	  }
          	  break EXIT;
          }
        }
      }
  }
}

//откат передвижения
function rollBack(card, arrAdditionalElem){
  if(card.whichContainerHaveThisCard === 'ContainerOfCollection'){
    for(var i = 0; i < collections.length; i++){
      for(var j = 0; j < collections[i].arr.length; j++){
        if(collections[i].arr[j] === card){
        	collections[i].arr.pop();
        	collections[i].add(card);
        }
      }
    }
    for(var i = 0; i < collectionNearDeck.arr.length; i++){
      if(collectionNearDeck.arr[i] === card){
        collectionNearDeck.arr.pop();
     	  collectionNearDeck.add(card);
      }
    }
  } else if(card.whichContainerHaveThisCard === 'ContainerOfColumn' && arrAdditionalElem === undefined){
    for(var i = 0; i < columns.length; i++){
      for(var j = 0; j < columns[i].arr.length; j++){
        if(columns[i].arr[j] === card){
        	columns[i].arr.pop();
        	columns[i].add(card);
        }
      }
    }
  } else if(card.whichContainerHaveThisCard === 'ContainerOfColumn' && arrAdditionalElem !== undefined){
  	for(var i = 0; i < columns.length; i++){
  	  for(var k = columns[i].arr.length - 1; k >= 0; k--){
  	  	for(var l = 0; l < arrAdditionalElem.length; l++){
  	  	  if(columns[i].arr[k] === arrAdditionalElem[l]){
  	  	  	columns[i].arr.pop();
  	  	  }
  	    }
  	  }
  	}
  	for(var i = 0; i < columns.length; i++){
      for(var j = 0; j < columns[i].arr.length; j++){
        if(columns[i].arr[j] === card){
        	columns[i].arr.pop();
        	columns[i].add(card);
        	for(var l = 0; l < arrAdditionalElem.length; l++){
        	  columns[i].add(arrAdditionalElem[l]);
        	}
        }
      }
    }

    }
}

//проверка на добавление первого элемента в пустой контейнер
function checkForFillEmptyPlace(card, basisOfTarget){
  var pctrAdded, strengthAdded, result;

  pctrAdded = card.CARD.querySelector('.frontSide').cloneNode(false);
  strengthAdded = pctrAdded.src.slice(pctrAdded.src.lastIndexOf('/') + 1, pctrAdded.src.lastIndexOf('.'));


  if(basisOfTarget.COLLECTION){
  	if(strengthAdded == 'a') result = true;
  	else result = false;
  } else if(basisOfTarget.COLUMN){
  	if(strengthAdded == 'k') result = true;
  	else result = false;
  }

  return result;
}

//проверка на выигрыш(из-за работы других проверок при добавлении, можно проверить выигрыш только проверкой последних
//карт коллекций)
function checkForWin(){
  var pctr, suit, strength;
  var arrResult = [false, false, false, false];


  for(var i = 0; i < collections.length; i++){
  	if(collections[i].arr.length){
  	pctr = collections[i].arr[collections[i].arr.length - 1].CARD.querySelector('.frontSide').cloneNode(false);
  	strength = pctr.src.slice(pctr.src.lastIndexOf('/') + 1, pctr.src.lastIndexOf('.'));
    if(strength == 'k'){
      arrResult[i] = true;
    }
    }
  }

  for(var i = 0; i < arrResult.length; i++){
  	if(arrResult[i] == false){
  	  return false;
  	}
  }
  return true;
}


//DnD
var DragManager = new function() {

  var dragObject = {};

  var self = this; // для доступа к себе из обработчиков

  var triggerOfMultyCardsProcessing = false, arrAdditionalElem;

  function onMouseDown(e) {

    if (e.which != 1) return;

    var elem = e.target.closest('.card');
    if (!elem) return;

    dragObject.elem = searchObjectLikeTarget(elem).elem;/*****/

    /**************/
    arrAdditionalElem = searchObjectLikeTarget(elem).arrAdditionalElem;


    if(arrAdditionalElem != undefined){
      triggerOfMultyCardsProcessing = true;
    }

    /***************/

    //невышло захватить элемент
    if(!dragObject.elem) return;

    // запомним, что элемент нажат на текущих координатах pageX/pageY
    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;

    // создать вспомогательные свойства shiftX/shiftY 
    var coords = getCoords(dragObject.elem);
    dragObject.shiftX = dragObject.downX - coords.left;
    dragObject.shiftY = dragObject.downY - coords.top;


    dragObject.elem.CARD.style.zIndex = counterForZIndex;
    counterForZIndex++;

    /************/
    if(triggerOfMultyCardsProcessing){
      for(var i = 0; i < arrAdditionalElem.length; i++){
        arrAdditionalElem[i].CARD.style.zIndex = counterForZIndex;
        counterForZIndex++;

        arrAdditionalElem[i].CARD.style.transition = '0s left, 0s top, 0s right, 0s bottom';
      }
	}
    /**********/

    dragObject.elem.CARD.style.transition = '0s left, 0s top, 0s right, 0s bottom';

   


    if(dragObject.elem.whichContainerHaveThisCard === 'ContainerOfDeck'){
      goOneCardFromDeckInCollectionNearDeck();
      dragObject = {};
    }

    return false;
  }

  function onMouseMove(e) {
    if (!dragObject.elem) return; // элемент не зажат
		    
    //document.body.insertBefore(dragObject.elem.CARD, document.body.firstChild);

    // отобразить перенос объекта при каждом движении мыши
    dragObject.elem.CARD.style.left = e.pageX - dragObject.shiftX + 'px';
    dragObject.elem.CARD.style.top = e.pageY - dragObject.shiftY + 'px';

    /***********/
    if(triggerOfMultyCardsProcessing){
      for(var i = 1; i <= arrAdditionalElem.length; i++){
        arrAdditionalElem[i-1].CARD.style.left = e.pageX - dragObject.shiftX + 'px';
        arrAdditionalElem[i-1].CARD.style.top = e.pageY - dragObject.shiftY + COORDS_FOR_COLUMN.distanceBetweenCards * i + 'px';
      }
    }
    /************/

    //dragObject.elem.CARD.style.left = e.pageX + 'px';
    //dragObject.elem.CARD.style.top = e.pageY + 'px';


    return false;
  }

  function onMouseUp(e){
  	if(!dragObject.elem) return;

  	
  	dragObject.elem.CARD.style.transition = '0.6s left, 0.6s top, 0.6s right, 0.6s bottom';

  	/*****/
  	if(triggerOfMultyCardsProcessing){
  	  for(var i = 0; i < arrAdditionalElem.length; i++){
  	    arrAdditionalElem[i].CARD.style.transition = '0.6s left, 0.6s top, 0.6s right, 0.6s bottom';
  	  }
    }
  	/*****/

  	if(dragObject.elem){
  	  finishDrag(e);
  	}

  	
    dragObject = {};

    
  }

  

  function finishDrag(e){
  	var elemUnderTargetElement = searchObjectLikeTarget(findElementUnderTarget(e)).elem, /*****/
  	elem = (findEmptyPlaceUnderTarget(e)) ? searchObjectOfBasis(findEmptyPlaceUnderTarget(e)) : undefined;

  	if(!elemUnderTargetElement){

  	  if(elem){
  	  	//deleteFromOldContainer(dragObject.elem);
  	  	
  	  	//запоминаем какой был контейнер, иначе мы не сможешь вернуть карту, если вставка неудастся
  	  	//var temp = dragObject.elem.whichContainerHaveThisCard;
  	  	//добавляем, а потом проверяем, чтобы понять в какой контейнер шагаем
  	    //elem.add(dragObject.elem);
  	    //запоминаем какой будет, если все же получается добавить
  	   	//var temp2 = dragObject.elem.whichContainerHaveThisCard;

  	    if(checkForFillEmptyPlace(dragObject.elem, elem) == false){
  	      //elem.arr.pop();
  	      //dragObject.elem.whichContainerHaveThisCard = temp;

  	      self.onDragCancel(dragObject, arrAdditionalElem);
  	    }
  	    else {
  	    	//dragObject.elem.whichContainerHaveThisCard = temp;
  	    	deleteFromOldContainer(dragObject.elem, arrAdditionalElem);
  	    	elem.add(dragObject.elem);
  	    	//dragObject.elem.whichContainerHaveThisCard = temp2;

  	    	if(triggerOfMultyCardsProcessing == true && arrAdditionalElem !== undefined){
	  		for(var i = 0; i < arrAdditionalElem.length; i++){
	    	  container.add(arrAdditionalElem[i]);
	  		}
	  		triggerOfMultyCardsProcessing = false;
	  		arrAdditionalElem = undefined;
	  	    }
  	    }
  	  } else {
  	    self.onDragCancel(dragObject, arrAdditionalElem);
  	  }

  	} else if(elemUnderTargetElement.whichContainerHaveThisCard === 'ContainerOfColumn'){

      if(checkForDifferentSuit(dragObject.elem.CARD, elemUnderTargetElement.CARD) == true && 
      	 										checkForReduce(dragObject.elem.CARD, elemUnderTargetElement.CARD) == true){
      	self.onDragEnd(dragObject, elemUnderTargetElement, elemUnderTargetElement.whichContainerHaveThisCard, arrAdditionalElem);
      } else {
      	self.onDragCancel(dragObject, arrAdditionalElem);
      }

    } else if(elemUnderTargetElement.whichContainerHaveThisCard === 'ContainerOfCollection'){

      if(checkForSameSuit(dragObject.elem.CARD, elemUnderTargetElement.CARD) == true &&
      											checkForGrow(dragObject.elem.CARD, elemUnderTargetElement.CARD) == true){
      	self.onDragEnd(dragObject, elemUnderTargetElement, elemUnderTargetElement.whichContainerHaveThisCard, arrAdditionalElem);
      } else {
      	self.onDragCancel(dragObject, arrAdditionalElem);
      }

    } else {
      self.onDragCancel(dragObject, arrAdditionalElem);
    }
  }

  function findElementUnderTarget(e){
  	dragObject.elem.CARD.hidden = true;

  	var elem = document.elementFromPoint(e.clientX, e.clientY);

  	dragObject.elem.CARD.hidden = false;

  	return elem.closest('.card');
  }

  function findEmptyPlaceUnderTarget(e){
    dragObject.elem.CARD.hidden = true;

    var elem = document.elementFromPoint(e.clientX, e.clientY);

    dragObject.elem.CARD.hidden = false;

    if(elem.getBoundingClientRect().left == COORDS_FOR_DECK_AND_NEAR_COLLECTION.X_COLLECTION_NEAR_DECK){
      return undefined;
    }

    return elem;
  }

  document.onmousedown = onMouseDown;
  document.onmousemove = onMouseMove;
  document.onmouseup = onMouseUp;

  this.onDragEnd = function(dragObject, dropObject, nameOfContainer, arrAdditionalElem){
  	var container;
  	if(nameOfContainer === 'ContainerOfColumn'){
  	  EXIT:for(var i = 0; i < columns.length; i++){
  	    for(var j = 0; j < columns[i].arr.length; j++){
  	      if(columns[i].arr[j].CARD === dropObject.CARD){
  	      	container = columns[i];
  	      	break EXIT;
  	      }
  	    }
  	  }
  	} else if(nameOfContainer === 'ContainerOfCollection'){
  	  EXIT:for(var i = 0; i < collections.length; i++){
  	    for(var j = 0; j < collections[i].arr.length; j++){
  	      if(collections[i].arr[j].CARD === dropObject.CARD){
  	      	container = collections[i];
  	      	break EXIT;
  	      }
  	    }
  	  }
  	}

  	if(arrAdditionalElem === undefined){
  	  deleteFromOldContainer(dragObject.elem, arrAdditionalElem);
  	  container.add(dragObject.elem);
	} else if(arrAdditionalElem !== undefined){
	  deleteFromOldContainer(dragObject.elem, arrAdditionalElem);
	  container.add(dragObject.elem);
	  for(var i = 0; i < arrAdditionalElem.length; i++){
	    container.add(arrAdditionalElem[i]);
	  }
	  triggerOfMultyCardsProcessing = false;
	  arrAdditionalElem = undefined;
	}

	if(nameOfContainer === 'ContainerOfCollection') {
		if(checkForWin()){
      var win = document.createElement('p');
      win.className = 'win';
      document.body.appendChild(win);

      win.innerHTML = 'WIN!';


      win.onclick = function(){
        document.body.removeChild(document.body.lastChild);
      }
    }
	}
  	//container.arr.push(dragObject.CARD);
  	
  };
  this.onDragCancel = function(dragObject, arrAdditionalElem){

  	rollBack(dragObject.elem, arrAdditionalElem);
  	triggerOfMultyCardsProcessing = false;
  	arrAdditionalElem = undefined;
  };
};


//кнопка рестарта
var startButton = document.createElement('div');

startButton.innerHTML = 'Start!';
startButton.className = 'newGame';

document.body.appendChild(startButton);

startButton.onclick = function(){

  destroyCards();
  createDeck();
  shakeDeck();
  setTimeout(packageDeck, 1);

}


//начало игры
startGame();

//возвращение колоды, если произойдет клик по пустому месту, где должна быть колода
deck.DECK.addEventListener('click', goBackInDeck, false);




