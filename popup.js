document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: 'get_scores'}, function(response) {
            if (response && response.length > 0) {
                let predictionsHtml = '';
                let totalGamesAllSets = 0;

                response.forEach((score) => {
                    let { set, player1Score, player2Score, totalGames } = score;
                    totalGamesAllSets += totalGames;

                    let probableTotalGames;
                    if (Math.abs(player1Score - player2Score) > 2) {
                        probableTotalGames = totalGames + (6 - Math.max(player1Score, player2Score));
                    } else {
                        probableTotalGames = totalGames + (6 - Math.min(player1Score, player2Score));
                    }

                    predictionsHtml += `
                        <p>Set ${set} Total: ${totalGames}</p>
                        <p>Probable Total Number of Games: ${probableTotalGames}</p>
                    `;
                });

                // Estimate the probable total number of games for all sets
                let probableTotalGamesAllSets = totalGamesAllSets;
                let setsPlayed = response.length;

                if (setsPlayed === 1) {
                    probableTotalGamesAllSets += 6; // Estimate based on current set status
                } else if (setsPlayed === 2 && response[0].totalGames !== response[1].totalGames) {
                    probableTotalGamesAllSets += 6; // Estimate another set if sets are not balanced
                } else if (setsPlayed >= 3) {
                    probableTotalGamesAllSets += 12; // Estimate based on potential for 5 sets
                }

                predictionsHtml += `
                    <hr>
                    <p>Total Games in All Sets: ${totalGamesAllSets}</p>
                    <p>Probable Total Number of Games in All Sets: ${probableTotalGamesAllSets}</p>
                `;

                document.getElementById('predictions').innerHTML = predictionsHtml;
            } else {
                document.getElementById('predictions').innerHTML = `
                    <p>Failed to retrieve scores. Please ensure you are on the betting page.</p>
                `;
            }
        });
    });
});
