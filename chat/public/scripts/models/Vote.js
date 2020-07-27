const emoji = ["&#127877;","&#127947;","&#128110;","&#129332;"];
class Vote{

    constructor() {

        this.coolDown = true;
        this.player = "";
        this.player_vote = "";

    }

    vote(party,player)
    {

        let players_li = document.querySelectorAll("li");
        players_li.forEach((element)=>{
           element.addEventListener('click',()=>{
               if(this.coolDown){
                   if(player.name !== Vote.removeEmoji(element.textContent)) {
                       party.joueurs.forEach((player) => {
                           if (player.name === Vote.removeEmoji(element.textContent))
                               player.score++;
                       });
                       socket.emit('vote', party);
                       party.indexOf(player).then((result)=>{
                           let re = new Vote();
                           re.player = Vote.getEmojiDec(result);
                           re.player_vote = element.textContent;
                           socket.emit('player_has_vote',re);
                       });
                       this.coolDown = false;
                   }
               }
           });
        });
    }

    static getEmojiDec(index) {
        return emoji[index];
    }

    renderVote()
    {

        let li = document.querySelectorAll('li');
        const promise = new Promise((resolve) => {
            li.forEach((element) => {
                if (element.textContent === this.player_vote) resolve(element);
            });
        });

        promise.then((result)=>{
            result.innerHTML = result.textContent + this.player;
        });

    }

    static removeEmoji(string)
    {

        return string.replace("🤴","").replace("🎅","").replace("👮","").replace("🏋","");

    }

}