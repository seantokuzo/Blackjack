const myButton = document.getElementById('button')
const firstCard = document.getElementById("card1")
const secondCard = document.getElementById("card2")
const thirdCard = document.getElementById("card3")
const fourthCard = document.getElementById("card4")
const fifthCard = document.getElementById("card5")
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
let currentDeck = ''
let myStorage = window.localStorage
let drawCount = 0
let myCards = []
let myCountHigh
let myCountLow

function addUpHigh() {
    console.log(myCards)
    const myCardsValueArray = myCards.map(card => cardValues[card])
    myCountHigh = myCardsValueArray.reduce((acc, num) => acc + num)
    console.log(myCountHigh)
}

function addUpLow() {
    console.log(myCards)
    const myCardsValueArray = myCards.map(card => {
        if (card === "ACE") {
            return 1
        } else return cardValues[card]
    })
    myCountLow = myCardsValueArray.reduce((acc, num) => acc + num)
    console.log(myCountLow)
}

// const addUpHigh = (cards) => {
//     console.log(cards)
//     countAceHigh = cards.map(card => {
//         if (parseInt(card)) {
//             console.log('number')
//             countAceHigh = countAceHigh + parseInt(card)
//         } else if (card === 'ACE') {
//             console.log('ace')
//             countAceHigh = countAceHigh + 11
//         } else {
//             console.log('face-card')
//             countAceHigh = countAceHigh + 10
//         }
//         console.log(countAceHigh)
//     })
// }

// const addUpLow = () => {
//     countAceLow = myCards.map(card => {
//         if (parseInt(card)) {
//             countAceLow = countAceLow + parseInt(card)
//         } else if (card === 'ACE') {
//             countAceLow = countAceLow + 1
//         } else {
//             countAceLow = countAceLow + 10
//         }
//         console.log(countAceLow)
//     })
// }



const setCard = (card, url) => {
    card.src = url
    card.style.zIndex = 9
    card.style.visibility = "visible"
}

const resetCard = (card) => {
    card.src = ''
    card.style.zIndex = -1
    card.style.visibility = "hidden"
}

function Draw() {
    //FIRST DRAW
    if (drawCount === 0) {
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=2`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                data.cards.map(obj => myCards.push(obj.value))
                console.log(myCards)
                addUpHigh()
                addUpLow()
                myStorage.setItem('deckId', data.deck_id)
                setCard(firstCard, data.cards[0].image)
                setCard(secondCard, data.cards[1].image)
                drawCount += 2
                currentDeck = data.deck_id
            })
            .catch(e => console.log(e))
        //LAST DRAW
    } else if (drawCount === 4) {
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                data.cards.map(obj => myCards.push(obj.value))
                console.log(myCards)
                const currentCard = document.getElementById(`card${drawCount + 1}`)
                setCard(currentCard, data.cards[0].image)
                addUpHigh()
                addUpLow()
                drawCount += 1
                myButton.innerText = "New Game"
            })
            .catch(e => console.log(e))
        //IN BETWEEN DRAWS
    } else if (drawCount > 0 && drawCount < 4) {
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                data.cards.map(obj => myCards.push(obj.value))
                console.log(myCards)
                addUpHigh()
                addUpLow()
                const currentCard = document.getElementById(`card${drawCount + 1}`)
                setCard(currentCard, data.cards[0].image)
                drawCount += 1
            })
            .catch(e => console.log(e))
        //NEW GAME START WITH 2 CARDS
    } else {
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/shuffle/`)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(e => console.log(e))
        drawCount = 0
        myCards = []
        myCountHigh = 0
        myCountLow = 0
        resetCard(thirdCard)
        resetCard(fourthCard)
        resetCard(fifthCard)
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=2`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                data.cards.map(obj => myCards.push(obj.value))
                console.log(myCards)
                addUpHigh()
                addUpLow()
                setCard(firstCard, data.cards[0].image)
                setCard(secondCard, data.cards[1].image)
                drawCount = 2
                myButton.innerText = "Draw"
            })
            .catch(e => console.log(e))
    }
}

const getYourDeck = () => {
    if (myStorage.deckId) {
        currentDeck = myStorage.getItem('deckId')
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/shuffle/`)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(e => console.log(e))
        console.log(currentDeck)
    } else {
        fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=2")
            .then(res => res.json())
            .then(data => {
                console.log(data)
                data.cards.map(obj => myCards.push(obj.value))
                console.log(myCards)
                // addUpHigh()
                // addUpLow()
                console.log(countAceHigh)
                console.log(countAceLow)
                myStorage.setItem('deckId', data.deck_id)
                console.log(myStorage)
                setCard(firstCard, data.cards[0].image)
                setCard(secondCard, data.cards[1].image)
                currentDeck = data.deck_id
                drawCount = 2
            })
            .catch(e => console.log(e))
    }
}
getYourDeck()



// if (sum <= 20) {
//     console.log("Want to draw another card? 🙂")
// } else if (sum === 21) {
//     console.log("Blackjack! 🥳")
// } else {
//     console.log("Busted! 😭")
// }