const myButton = document.getElementById('button')
// const userCard1 = document.getElementById("card1")
// const userCard2 = document.getElementById("card2")
// const userCard3 = document.getElementById("card3")
// const userCard4 = document.getElementById("card4")
// const userCard5 = document.getElementById("card5")
// const houseCard1 = document.getElementById("house-card1")
// const houseCard2 = document.getElementById("house-card2")
// const houseCard3 = document.getElementById("house-card3")
// const houseCard4 = document.getElementById("house-card4")
// const houseCard5 = document.getElementById("house-card5")
const houseTotal = document.getElementById("sum-house")
const message = document.getElementById("message-el")
const sumDisplay = document.getElementById("sum")
const userCardsContainer = document.getElementById("user-cards-container")
const houseCardsContainer = document.getElementById("house-cards-container")
const houseCardsUrls = []
const cardValues = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'JACK': 10,
    'QUEEN': 10,
    'KING': 10,
    'ACE': 11
}
const aceLow = {
    'ACE': 1
}
let gameState = {
    currentDeck: '',
    userCards: [],
    userCountHigh: 0,
    userCountLow: 0,
    userCount: 0,
    houseCards: [],
    houseCountHigh: 0,
    houseCountLow: 0,
    houseCount: 0,
    housePlaying: false,
    gameOver: false,
    wins: 0,
    losses: 0
}
let myStorage = window.localStorage

//SHUFFLE THE DECK
function shuffleDeck() {
    fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/shuffle/`)
        .then(res => res.json())
        .then(data => console.log("Shuffled"))
        .catch(e => console.log(e))
}

function removeButton() {
    const holdButton = document.getElementById("hold-button")
    holdButton.remove()
    myButton.innerText = "Run it Back"
}

//ADD STAY BUTTON AND SET BUTTONS TEXT
function setButtons() {
    const buttonsDiv = document.getElementById("buttons-div")
    if (gameState.userCards.length == 2) {
        myButton.innerText = "Hit Me"
        let holdButton = document.createElement("button")
        holdButton.id = "hold-button"
        holdButton.innerText = "Stand"
        holdButton.onclick = userStands
        buttonsDiv.appendChild(holdButton)
    } else if (gameState.userCards.length === 5) {
        removeButton()
    }
}

//RELAY USER COUNT TO THE SUM DISPLAY
function setSumDisplay() {
    sumDisplay.innerText = `Your Total: ${gameState.userCount}`
}

//ADD USER CARDS TO DISPLAY
const addUserCard = (url) => {
    var cardImg = document.createElement("IMG")
    cardImg.src = url
    cardImg.alt = "card"
    cardImg.className = `card card${gameState.userCards.length}`
    userCardsContainer.appendChild(cardImg)
}

function showHiddenHouseCard() {
    let houseCard2 = document.getElementById("house-card-2")
    houseCard2.src = houseCardsUrls[1]
}

//ADD HOUSE CARDS TO DISPLAY
const addHouseCard = (url) => {
    var houseCardImg = document.createElement("IMG")
    // if (gameState.houseCards.length === 2) {
    // }
    if (gameState.houseCards.length === 2) {
        houseCardImg.id = "house-card-2"
        houseCardImg.src = "https://andrewthamcc.github.io/blackjack2.0/assets/facedown.png"
    } else if (gameState.houseCards.length === 3) {
        houseCardImg.src = url
        showHiddenHouseCard()
    } else {
        houseCardImg.src = url
    }
    houseCardImg.alt = "card"
    // console.log(gameState.houseCards)
    // console.log(gameState.houseCards.length)
    houseCardImg.className = `card card${gameState.houseCards.length}`
    houseCardsContainer.appendChild(houseCardImg)
}

//REMOVE CARDS FROM DISPLAY
function removeCards() {
    let allCards = document.getElementsByClassName("card")
    while (allCards.length > 0) {
        allCards[0].parentNode.removeChild(allCards[0])
    }
}

//UPDATE USER COUNT
function sumUserCards() {
    const userCardsValueArray = gameState.userCards.map(card => cardValues[card])
    gameState.userCountHigh = userCardsValueArray.reduce((acc, num) => acc + num)

    const userCardsValueArrayLow = gameState.userCards.map(card => {
        if (card === "ACE") {
            return 1
        } else return cardValues[card]
    })
    gameState.userCountLow = userCardsValueArrayLow.reduce((acc, num) => acc + num)
    if (gameState.userCountHigh > 21 && gameState.userCountLow < 22) {
        gameState.userCount = gameState.userCountLow
    } else if (gameState.userCountHigh > 21 && gameState.userCountLow > 21) {
        gameState.userCount = gameState.userCountLow
    } else gameState.userCount = gameState.userCountHigh
    console.log(`User Count: ${gameState.userCount}`)
}

//UPDATE HOUSE COUNT
function sumHouseCards() {
    const houseCardsValueArray = gameState.houseCards.map(card => cardValues[card])
    gameState.houseCountHigh = houseCardsValueArray.reduce((acc, num) => acc + num)

    const houseCardsValueArrayLow = gameState.houseCards.map(card => {
        if (card === "ACE") {
            return 1
        } else return cardValues[card]
    })
    gameState.houseCountLow = houseCardsValueArrayLow.reduce((acc, num) => acc + num)

    if (gameState.houseCountHigh > 21 && gameState.houseCountLow < 22) {
        gameState.houseCount = gameState.houseCountLow
    } else gameState.houseCount = gameState.houseCountHigh
    console.log(`House Count: ${gameState.houseCount}`)
}

//DRAW A USER CARD
function drawUserCard() {
    fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            gameState.userCards.push(data.cards[0].value)
            // console.log(gameState.userCards)
            addUserCard(data.cards[0].image)
            sumUserCards()
            setSumDisplay()
            setButtons()
            checkGameStatus()
        })
        .catch(e => console.log(e))
}

//DRAW A HOUSE CARD
function drawHouseCard() {
    fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            gameState.houseCards.push(data.cards[0].value)
            houseCardsUrls.push(data.cards[0].image)
            addHouseCard(data.cards[0].image)
            sumHouseCards()
            console.log(gameState.gameOver)
            if (gameState.userCards.length === 5) {
                gameState.gameOver = true
            }
            if (gameState.gameOver === true) {
                checkGameStatus()
            }
        })
        .catch(e => console.log(e))
}

//COMPARE COUNTS 
function compareCounts() {
    houseTotal.innerText = `House Total: ${gameState.houseCount}`
    if (gameState.userCount < 22 && gameState.houseCount > 21) {
        message.innerText = "You Win!"
    } else if (gameState.userCount > gameState.houseCount && gameState.userCount < 22) {
        message.innerText = "You Win!"
    } else if (gameState.userCount < gameState.houseCount && gameState.houseCount < 22) {
        message.innerText = "You Loser!"
    } else if (gameState.userCount === gameState.houseCount) {
        message.innerText = "Push it... Push it real good"
    }
}

//HOUSE PLAYS AFTER USER
function houseThinking() {
    console.log("House bout to make some moves")
    if (gameState.houseCards.length < 5 && gameState.houseCount < 22) {
        if (gameState.userCount <= 21 && gameState.houseCount < gameState.userCount) {
            gameState.housePlaying = true
            drawHouseCard()
        } else gameState.housePlaying = false
    } compareCounts()
}

//USER STANDS
function userStands() {
    showHiddenHouseCard()
    gameState.gameOver = true
    removeButton()
    console.log("User Stands")
    houseThinking()
}

//CHECK GAME STATUS AFTER EACH DRAW
function checkGameStatus() {
    if (gameState.userCount === 21 && !gameState.housePlaying) {
        console.log("BING BONG - BLACKJACK!")
        message.innerText = "BING BONG - BLACKJACK!"
        userStands()
    } else if (gameState.userCount > 21 && !gameState.housePlaying) {
        console.log("BING BONG - BUSTED!")
        message.innerText = "BING BONG - BUSTED!"
        userStands()
    } else if (gameState.gameOver) {
        houseThinking()
    } else return
}

//HANDLE DRAW BUTTON CLICK
function Draw() {
    //FIRST DRAW
    if (gameState.userCards.length === 0 && !gameState.gameOver) {
        drawUserCard()
        drawUserCard()
        drawHouseCard()
        drawHouseCard()
        // message.innerText = "Big Money Big Money Big Money"
        //IN BETWEEN DRAWS
    } else if (gameState.userCards.length > 0 && gameState.userCards.length < 5 && !gameState.gameOver) {
        drawUserCard()
        //NEW GAME START WITH 2 CARDS
    } else {
        //RESET STATE
        gameState.userCards = []
        gameState.userCountHigh = 0
        gameState.userCountLow = 0
        gameState.houseCards = []
        gameState.houseCountHigh = 0
        gameState.houseCountLow = 0
        gameState.gameOver = false
        houseTotal.innerText = "House Total:"
        message.innerText = "Here We Go Again"
        myButton.innerText = "Hit Me"
        //REMOVE THE PREVIOUS GAME'S CARDS
        removeCards()
        //RETURN CARDS TO DECK AND SHUFFLE
        shuffleDeck()
        //FETCH USER FIRST 2 CARDS
        drawUserCard()
        drawUserCard()
        // FETCH HOUSE FIRST 2 CARDS
        drawHouseCard()
        drawHouseCard()
    }
}

//GET THE DECK OF CARDS ON PAGE LOAD
const getYourDeck = () => {
    //IF USER HAS DECK ID STORED IN LOCAL STORAGE
    if (myStorage.deckId) {
        currentDeck = myStorage.getItem('deckId')
        console.log(currentDeck)
        shuffleDeck()
        //GET NEW DECK IF NONE IN LOCALS STORAGE
    } else {
        fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then(res => res.json())
            .then(data => {
                myStorage.setItem('deckId', data.deck_id)
                currentDeck = data.deck_id
            })
            .catch(e => console.log(e))
    }
}
getYourDeck()

// function theDrawHandler() {
//     //SETTING THE BUTTON AND MESSAGE TEXT
//     if (userCountHigh === 21 || userCountLow === 21) {
//         message.innerText = "YOU WIN!"
//         myButton.innerText = "Run It Back"
//         gameOver = true
//         userCards.length = 5
//         console.log(userCards.length)
//     } else if (userCards.length === 5 && userCountLow < 21) {
//         message.innerText = "YOU WIN!"
//         myButton.innerText = "Run It Back"
//         userCards.length = 5
//         gameOver = true
//     } else if (userCountLow > 21) {
//         message.innerText = "YOU LOSER!"
//         myButton.innerText = "Try Again"
//         gameOver = true
//         userCards.length = 5
//         console.log(userCards.length)
//     } else {
//         message.innerText = "Draw another card or stay?"
//         myButton.innerText = "Hit Me"
//     }
//ADD HOLD BUTTON
// if (userCards.length > 0 && userCards.length < 5 && gameOver === false) {
//     let holdButton = document.createElement("button")
//     holdButton.id = "hold-button"
//     holdButton.onclick = holdEm()
//     holdButton.value = "HOLD"
//     buttonsDiv.appendChild(holdButton)
// }
// }

// const setCard = (card, url) => {
//     card.src = url
//     card.style.visibility = "visible"
// }