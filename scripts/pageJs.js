$(document).ready(function(){

    let displayLA = true
    
    $('.effect').mouseenter(() => {

        if(displayLA){

            $('.la-img').fadeIn(50)
            $('.la-img').fadeOut(100)

            displayLA = false

        }
    })

    $('.effect').click(() => {

        if(displayLA){

            $('.la-img').fadeIn(50)
            $('.la-img').fadeOut(100)

            // displayLA = false

        }
    })
})