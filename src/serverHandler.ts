import { getUserData, UserData } from '@decentraland/Identity'

// get player data

// external servers being used by the project - Please change these to your own if working on something else!
export const fireBaseServer =
    'https://us-central1-westminster-meta.cloudfunctions.net/app'

// get latest scoreboard data from server
export async function getScoreBoard() {
    try {
        const url = fireBaseServer + '/get-scores'
        const response = await fetch(url)
        const json = await response.json()
        log(json)
        return json
    } catch (e) {
        log('error fetching scores from server ', e)
    }
}

// change data in scoreboard
export async function publishScore(score: string) {
    executeTask(async () => {
        let data = await getUserData();
        if (!data) return;
        log(data.displayName);
    
    fetch('https://us-central1-westminster-meta.cloudfunctions.net/app/publish-scores',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ name: data.displayName, id: data.publicKey, score: score})
        }
    ).then(r => {
        log(r)
    })

})


};