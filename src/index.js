// write your code here

const ramenDiv = document.querySelector('div#ramen-menu')
const ramenDetail = document.querySelector('div#ramen-detail')
const ramenForm = document.querySelector('form#ramen-rating')

function loadOneRamen(ramenObj){

    const img = document.createElement('img')
    img.dataset.id = ramenObj.id
    img.src = ramenObj.image

    ramenDiv.append(img)
}

function loadAllRamen(){ 
    fetch('http://localhost:3000/ramens')
        .then(res => res.json())
        .then( ramens => ramens.forEach( ramen => loadOneRamen(ramen)))

}


ramenDiv.addEventListener('click', function (event) {
    
    fetch(`http://localhost:3000/ramens/${event.target.dataset.id}`)
        .then(res => res.json())
        .then(ramenObj => {
            
            ramenDetail.innerHTML = `
            <img class="detail-image" src=${ramenObj.image} alt=${ramenObj.name} />
            <h2 class="name">${ramenObj.name}</h2>
            <h3 class="restaurant">${ramenObj.restaurant}</h3>`
        
            ramenForm.dataset.id = ramenObj.id 

            ramenForm.innerHTML = `
            <label for="rating">Rating: </label>
            <input type="text" name="rating" id="rating" value=${ramenObj.rating} />
            <label for="comment">Comment: </label>
            <textarea name="comment" id="comment">${ramenObj.comment}</textarea>
            <input type="submit" value="Update" />`
        
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


loadAllRamen()
