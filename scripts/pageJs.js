$(document).ready(function(){

    let displayLA = true
    
    $('.latxt').mouseenter(() => {

        if(displayLA){

            $('.la-img').fadeIn(50)
            $('.la-img').fadeOut(1000)

            displayLA = false

        }
    })

    $('.latxt').click(() => {

        if(displayLA){

            $('.la-img').fadeIn(50)
            $('.la-img').fadeOut(1000)

            // displayLA = false

        }
    })
})