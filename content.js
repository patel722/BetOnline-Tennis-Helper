// Function to extract scores
function getScores() {
    let scores = [];
    let player1TotalScores = document.querySelectorAll('.scoreBoard-participantScores:nth-of-type(1) .scoreBoard-partialScoreBox span.scoreBoard-partialScore');
    let player2TotalScores = document.querySelectorAll('.scoreBoard-participantScores:nth-of-type(2) .scoreBoard-partialScoreBox span.scoreBoard-partialScore');
    
    for (let i = 0; i < player1TotalScores.length; i++) {
        let player1Score = parseInt(player1TotalScores[i].innerText) || 0;
        let player2Score = parseInt(player2TotalScores[i].innerText) || 0;
        let totalGames = player1Score + player2Score;
        scores.push({ set: i + 1, player1Score, player2Score, totalGames });
    }

    return scores;
}

// Send the scores to the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_scores') {
        let scores = getScores();
        sendResponse(scores);
    }
});
