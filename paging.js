const searchPlayer = document.getElementById("searchPlayer")
const tbody = document.getElementById("tbody")
const sortIdDown = document.getElementById("sortIdDown")
const sortIdUp = document.getElementById("sortIdUp")
const allSortLinks = document.getElementsByClassName('bi') 

let currentSortCol = "id"
let currentSortOrder = "asc"
let currentSearchText = ""

Object.values(allSortLinks).forEach(link=>{
    link.addEventListener("click",()=>{
        currentSortCol = link.dataset.sortcol
        currentSortOrder = link.dataset.sortorder
        refresh()
    })
    
})

// function debounce(cb, delay = 250) {
//     let timeout
  
//     return (...args) => {
//       clearTimeout(timeout)
//       timeout = setTimeout(() => {
//         cb(...args)
//       }, delay)
//     }
//   }

//   const updateQuery = debounce(query => {
//     currentSearchText = query
//     refresh()
//   }, 1000)



filterInput.addEventListener("input",(e)=>{
    updateQuery(e.target.value)
})



function createTd(data){
    let element =  document.createElement("td")
    element.innerText = data
    return element
}

async function refresh(){
    let url = "http://localhost:3002/api/players?sortBy=" + currentSortCol + "&sortOrder=" + currentSortOrder + "&q=" +currentSearchText

    const response = await fetch(url,{
        headers:{
            'Accept': 'application/json'
        }
    })

    const products = await response.json()
    tbody.innerHTML = ""
    products.forEach(player=>{
        const tr = document.createElement("tr")
        tr.appendChild(createTd(player.id))
        tr.appendChild(createTd(player.name))
        tr.appendChild(createTd(player.jersey))
        tr.appendChild(createTd(player.position))
        tr.appendChild(createTd(player.team))
        tbody.appendChild(tr)
    })
}


await refresh()
