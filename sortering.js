const allSortLinks = document.getElementsByClassName('bi') 
const pager = document.getElementById('pager')
const tbody = document.querySelector("#allPlayers tbody")
const searchPlayer = document.getElementById("searchPlayer")

  let currentSortCol = "id"
  let currentSortOrder = "asc" 
  let currentSearchText = ""
  let currentPageNo = 1
  let currentPageSize = 3


  const onClickPlayer = function(event){
    const htmlElementetSomViHarKlickatPa = event.target
    console.log(htmlElementetSomViHarKlickatPa.dataset.stefansplayerid)
    const player = players.find(p=> p.id == htmlElementetSomViHarKlickatPa.dataset.stefansplayerid)
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
        currentSortOrder = link.dataset.sortorder
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
  }, 1000)

//   searchPlayer.addEventListener("input",(e)=>{
//     updateQuery(e.target.value)
// })
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


async function refresh(){
    let offset = (currentPageNo - 1) * currentPageSize

    //fetch!
    let url = "http://localhost:3000/api/players?sortBy=" 
        + currentSortCol + "&sortOrder=" + currentSortOrder +
         "&q=" + currentSearchText + "&limit=" + currentPageSize+  "&offset=" + offset
         console.log(url)
   
    // let url = "http://localhost:3000/api/players?sortCol=" 
    //     + currentSortCol + "&sortOrder=" + currentSortOrder + "&limit=200"
    //      + "&offset=0" 
    

    const response = await fetch(url,{
        headers:{
            'Accept': 'application/json'
        }
    })

    const result = await response.json()
    console.log(result)
    const count = result.total
    const players = result.result
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
        const btnDelete =document.createElement("button")
        btn.textContent = "EDIT"
        btnDelete.textContent ="DELETE"
        btn.dataset.stefansplayerid = players.id
        btnDelete.dataset.stefansplayerid = players.id
        td.appendChild(btn)
        td.appendChild(btnDelete)
        tr.appendChild(td)

        
        btn.addEventListener ("click",onClickPlayer);

        tbody.appendChild(tr)
    })
    createPager(count,currentPageNo,currentPageSize)
    
}

 await refresh()


  