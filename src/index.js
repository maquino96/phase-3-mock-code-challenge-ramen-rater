// write your code here

const ramenDiv = document.querySelector('div#ramen-menu')
const ramenDetail = document.querySelector('div#ramen-detail')
const ramenForm = document.querySelector('form#ramen-rating')
const newRamen = document.querySelector('form#new-ramen')


function htmlCode (ramenObj) {

    ramenDetail.innerHTML = `
    <img class="detail-image" src=${ramenObj.image} alt=${ramenObj.name} />
    <h2 class="name">${ramenObj.name}</h2>
    <h3 class="restaurant">${ramenObj.restaurant}</h3>`

    ramenForm.innerHTML = `
    <label for="rating">Rating: </label>
    <input type="text" name="rating" id="rating" value=${ramenObj.rating} />
    <label for="comment">Comment: </label>
    <textarea name="comment" id="comment">${ramenObj.comment}</textarea>
    <input type="submit" value="Update" />
    <button class="button" id="${ramenObj.id}"> Delete</button>`
    
    ramenForm.dataset.id = ramenObj.id 
}

function loadOneRamen(ramenObj){

    const img = document.createElement('img')
    img.dataset.id = ramenObj.id
    img.src = ramenObj.image

    ramenDiv.append(img)   

}

function loadAllRamen(){ 
    fetch('http://localhost:3000/ramens')
        .then(res => res.json())
        .then( ramens => {
            ramens.forEach( ramen => loadOneRamen(ramen))

            htmlCode(ramens[0])    
        })

}

ramenDiv.addEventListener('click', function (event) {
    
    fetch(`http://localhost:3000/ramens/${event.target.dataset.id}`)
        .then(res => res.json())
        .then(ramenObj => {
            
            htmlCode(ramenObj)

            const deleteButton = document.querySelector('button.button')

        deleteButton.addEventListener('click', function (event){
            
            console.log(event.target.id)
            event.preventDefault()

            fetch(`http://localhost:3000/ramens/${ramenObj.id}`, {method: 'DELETE',})
                .then(res => res.json())
                .then(ramenObj => { location.reload()})
        
        })
        })       
    })

ramenForm.addEventListener('submit', function (event){
    event.preventDefault()

    const rating = event.target.rating.value 
    const comment = event.target.comment.value 

    const updatedRamen = {rating, comment}

    fetch(`http://localhost:3000/ramens/${event.target.dataset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json',
                    'Accept': 'accplication/json'
        },      
        body: JSON.stringify(updatedRamen)})

        .then( res => res.json())
        .then( updatedRamen => {
            ramenForm.innerHTML = `
            <label for="rating">Rating: </label>
            <input type="text" name="rating" id="rating" value=${updatedRamen.rating} />
            <label for="comment">Comment: </label>
            <textarea name="comment" id="comment">${updatedRamen.comment}</textarea>
            <input type="submit" value="Update" />`

        })

})

newRamen.addEventListener('submit',function (event){
    event.preventDefault()
    const name = event.target.name.value
    const rating = event.target.rating.value
    const comment = event.target[4].value
    const restaurant = event.target.restaurant.value
    const image = event.target.image.value
    const ramenNew = {name, rating, comment,restaurant, image}

    fetch(`http://localhost:3000/ramens`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'accplication/json'},
        body: JSON.stringify(ramenNew)
    })
    .then( res => res.json())
    .then(ramenObj => loadOneRamen(ramenObj))
    event.target.reset()
})


loadAllRamen()