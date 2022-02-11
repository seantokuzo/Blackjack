// let firstCard = 6
// let secondCard = 9
// let sum = firstCard + secondCard
// let hasBlackJack = false
// isAlive = true

// if (sum <= 20) {
//     console.log("Want to draw another card? 🙂")
// } else if (sum === 21) {
//     console.log("Blackjack! 🥳")
// } else {
//     console.log("Busted! 😭")
// }

let deckId = ''
let shuffled = false

function getNewDeck(id) {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(res => res.json())
        .then(data => {
            console.log(data)
            deckId = data.deck_id
            console.log(deckId)
            shuffled = data.shuffled
            console.log(shuffled)
        })
        .catch(e => console.log(e))
}

getNewDeck(deckId)

// function firstDraw(id) {
//     fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=2`)
//         .then(res => {
//             console.log(deckId)
//             res.json()
//         })
//         .then(data => console.log(data))
//         .catch(e => console.log(e))
// }

// firstDraw(deckId)