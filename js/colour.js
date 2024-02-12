$(document).ready(function () {

    colourText();

	$(document).on("mouseenter mouseleave", ".textColour",
	  function() {
		$( this ).css("color", get_random_colour());
	  }
	);

	$(document).on("mouseover", ".divColour",
	  function() {
		colourWhiteDiv(this);
	  }
	);
	
	$(document).on("click", ".divColour",
	  function() {
		colourWhiteDiv(this);
	  }
	);
	
});

function colourText() {

	//for each jsColour class set a new colour
	$('.textColour').each(function( index ) {
	  $(this).css("color", get_random_colour());
	});

};

function colourWhiteDiv(div) {
	if ($(div).css("background-color") == "rgb(255, 255, 255)") {
		$(div).css("background-color", get_random_colour());
	}
	else {
		$(div).css("background-color", "#FFFFFF");
	}
}

function get_random_colour() {

    var letters = '0123456789ABCDEF'.split('');
	//get a random colour 
	//not even
	
    var colour = '#';
    for (var i = 0; i < 6; i++ ) {
        colour += letters[Math.round(Math.random() * (letters.length - 1))];
    }
    return colour;
	
}


