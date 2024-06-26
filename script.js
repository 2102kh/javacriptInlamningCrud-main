const allSortLinks = document.getElementsByClassName('bi') 
const pager = document.getElementById('pager')
const tbody = document.querySelector("#allPlayers tbody")
const searchPlayer = document.getElementById("searchPlayer")
const btnAdd = document.getElementById("btnAdd")
const closeDialog = document.getElementById("closeDialog")
const playerNameError = document.getElementById('playerNameError')
const playerNameElement = document.getElementById('playerName')
const playerJerseyError = document.getElementById('playerJerseyError')
const playerJerseyElement = document.getElementById('jersey')
const playerTeamElement = document.getElementById('team')
const playerTeamError = document.getElementById('playerTeamError')



playerNameElement.addEventListener("input", () => {
    if (validator.isLength(playerNameElement.value,{min:2,max:25}) || validator.isEmpty(playerNameElement.value)) {
        playerNameError.style.display = "none";
    } else {
        playerNameError.style.display = "block";
    }
})

playerJerseyElement.addEventListener("input", () => {
    if (validator.isInt(playerJerseyElement.value)) {
        playerJerseyError.style.display = "none";
    } else {
        playerJerseyError.style.display = "block";
    }
})
playerTeamElement.addEventListener("input", () => {
    if (validator.isAlphanumeric(playerTeamElement.value) || validator.isEmpty(playerTeamElement.value)) {
        playerTeamError.style.display = "none";
    } else {
        playerTeamError.style.display = "block";
    }
})




  let currentSortCol = ""
  let currentSortOrder = "" 
  let currentSearchText = ""
  let currentPageNo = 1
  let currentPageSize = 5


function Player(id, name,jersey,team, position){
    this.id = id
    this.name = name
    this.jersey = jersey
    this.team = team
    this.position = position
    this.visible = true
    this.matches = function(searchFor){
        return  this.name.toLowerCase().includes(searchFor) || 
                this.position.toLowerCase().includes(searchFor) || 
                this.team.toLowerCase().includes(searchFor)        
    }
}

async function fetchPlayers(){
    return await((await fetch('http://localhost:3000/api/players')).json())
}

let players =  await fetchPlayers()

searchPlayer.addEventListener("input", function() {
  const searchFor = searchPlayer.value.toLowerCase()
  for(let i = 0; i < players.length;i++){ // TODO add a matches function 
  if(players[i].matches(searchFor)){
     players[i].visible = true
     }else{
     players[i].visible = false 
     }
   } updateTable()

});

const onClickPlayer = function(event){
    const htmlElementetSomViHarKlickatPa = event.target
    console.log(htmlElementetSomViHarKlickatPa.dataset.stefansplayerid)
    const player = players.find(p=> p.id == htmlElementetSomViHarKlickatPa.dataset.stefansplayerid)
    console.log(player)
    playerName.value = player.name
    jersey.value = player.jersey
    team.value = player.team
    position.value = player.position
    editingPlayer = player
    MicroModal.show('modal-1');
}

  Object.values(allSortLinks).forEach(link=>{
    link.addEventListener("click",()=>{
        currentSortCol = link.dataset.sortcol
        currentSortOrder = link.dataset.sortorder // ==="asc" ? "desc" : "asc"
        // currentSortCol = sortcol
        // currentSortOrder = sortorder
        refresh()
    })
    
})
function debounce(cb, delay = 250) {
    let timeout
  
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }

  const updateQuery = debounce(query => {
    currentSearchText = query
    refresh()
  }, 500)

const createTableTdOrTh = function(elementType,innerText){
    let element = document.createElement(elementType)
    element.textContent = innerText
    return element
}


const playerName = document.getElementById("playerName")
const jersey = document.getElementById("jersey")
const position = document.getElementById("position")
const team = document.getElementById("team")

let editingPlayer = null


closeDialog.addEventListener("click",async (ev)=>{
    ev.preventDefault()
    let url = ""
    let method = ""
    // console.log(url)
    var o = {
        "name" : playerName.value,
        "jersey" : jersey.value,
        "position": position.value,
        "team": team.value
        }

    if(editingPlayer != null){
        o.id = editingPlayer.id;
        url =  "http://localhost:3000/api/players/" + o.id
        method = "PUT"
    }else{
        url =  "http://localhost:3000/api/players"
        method = "POST"
    }
    
    let response = await fetch(url,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: method,
          body: JSON.stringify(o)                
    })

    // let json = await response.json()
    players = await fetchPlayers()
    updateTable()
    MicroModal.close('modal-1');
})

btnAdd.addEventListener("click",()=>{
    playerName.value = ""
    jersey.value = 0
    position.value = ""
    team.value = ""
    editingPlayer = null
    MicroModal.show('modal-1');
    
})


const updateTable = function(){
    tbody.innerHTML = ""

    // först ta bort alla children
    for(let i = 0; i < players.length;i++) { // hrmmm you do foreach if you'd like, much nicer! 
        if(players[i].visible == false){
            continue
        }
        let tr = document.createElement("tr")
        tr.appendChild(createTableTdOrTh("th", players[i].name))
        tr.appendChild(createTableTdOrTh("td", players[i].jersey ))
        tr.appendChild(createTableTdOrTh("td", players[i].position ))
        tr.appendChild(createTableTdOrTh("td", players[i].team ))

        let td = document.createElement("td")
        let btn = document.createElement("button")
        const btnDelete =document.createElement("button")
        btn.textContent = "EDIT"
        btnDelete.textContent ="DELETE"
        btn.dataset.stefansplayerid = players[i].id
        btnDelete.dataset.stefansplayerid = players[i].id
        td.appendChild(btn)
        td.appendChild(btnDelete)
        tr.appendChild(td)        
        btn.addEventListener ("click",onClickPlayer);

        tbody.appendChild(tr)
    }

    // innerHTML och backticks `
    // Problem - aldrig bra att bygga strängar som innehåller/kan innehålla html
    //    injection
    // for(let i = 0; i < players.length;i++) { // hrmmm you do foreach if you'd like, much nicer! 
    //                                         // I will show you in two weeks
    //                                         //  or for p of players     
    //     let trText = `<tr><th scope="row">${players[i].name}</th><td>${players[i].jersey}</td><td>${players[i].position}</td><td>${players[i].team}</td></tr>`
    //     allPlayersTBody.innerHTML += trText
    // }
    // createElement
}

updateTable()

MicroModal.init({
    onShow: modal => console.info(`${modal.id} is shown`), // [1]
    onClose: modal => console.info(`${modal.id} is hidden`), // [2]
   
    openTrigger: 'data-custom-open', // [3]
    closeTrigger: 'data-custom-close', // [4]
    openClass: 'is-open', // [5]
    disableScroll: true, // [6]
    disableFocus: false, // [7]
    awaitOpenAnimation: false, // [8]
    awaitCloseAnimation: false, // [9]
    debugMode: true // [10]
  });
searchPlayer.addEventListener("input",(e)=>{
    currentSearchText = e.target.value
    refresh()
})

function createPager(count, pageNo, currentPageSize){
    pager.innerHTML = ""
    let totalPages = Math.ceil(count / currentPageSize)
    for(let i = 1; i <= totalPages; i++){
        const li = document.createElement('li')
        li.classList.add("page-item")
        if(i == pageNo){
            li.classList.add("active")
        }
        const a = document.createElement('a')
        a.href="#"
        a.innerText = i
        a.classList.add("page-link")
        li.appendChild(a)
        a.addEventListener("click",()=>{
            
            currentPageNo = i
            refresh()
        })
        pager.appendChild(li)
    }
}
function createTd(data){
    let element =  document.createElement("td")
    element.innerText = data
    return element
}

async function deletePlayer(e){
    const playerId = e.target.dataset.stefansplayerid
    let url = `http://localhost:3000/api/players/${playerId}`;
    
    let response = await fetch(url, {
        method: 'DELETE'
    });
    const index = players.findIndex(p => p.id == playerId)
    players.splice(index, 1)
    updateTable()
}


async function refresh(){
    let offset = (currentPageNo - 1) * currentPageSize

    //fetch!
    let url = "http://localhost:3000/api/players?sortCol=" 
        + currentSortCol + "&sortOrder=" + currentSortOrder +
         "&q=" + currentSearchText + "&limit=" + currentPageSize+  "&offset=" + offset
         console.log(url)
    
    const response = await fetch(url,{
        headers:{
            'Accept': 'application/json'
        }
    })

    const result = await response.json()
    console.log(result)
    const count = result.total
    players = result.result
    console.log(players)
    tbody.innerHTML = ""
    players.forEach (play=> {
        const tr = document.createElement("tr")
        tr.appendChild(createTd(play.id))
        tr.appendChild(createTd(play.name))
        tr.appendChild(createTd(play.jersey))
        tr.appendChild(createTd(play.position))
        tr.appendChild(createTd(play.team))

        let td = document.createElement("td")
        let btn = document.createElement("button")
        let btnDelete =document.createElement("button")
        btn.textContent = "EDIT"
        btnDelete.textContent ="DELETE"
        btn.dataset.stefansplayerid = play.id
        btnDelete.dataset.stefansplayerid = play.id
        td.appendChild(btn)
        td.appendChild(btnDelete)
        tr.appendChild(td)

        btn.addEventListener ("click",onClickPlayer);
        btnDelete.addEventListener("click", deletePlayer);
        tbody.appendChild(tr)
    })

    createPager(count,currentPageNo,currentPageSize)
    
}

 await refresh()


  