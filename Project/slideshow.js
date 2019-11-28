/********************************************************
 * Project: Dory's Cupcakes
 * Author: Mike Seehafer
 * Date: 3/3/2019
 * Description: This contains the script for carousel
 * photo animations.
 *******************************************************/

//Idea for the carousel animation was adapted from
//https://www.w3schools.com/w3css/w3css_slideshow.asp

let index = 0;

//Wait three seconds after the page loads before switching images
setTimeout(animateSlideshow, 3000);

function animateSlideshow() {
  let slides = document.getElementsByClassName("photoSlide");

  //Remove the current picture
  slides[index].style.display = "none";
  index++;  
  if (index >= slides.length) {
	  index = 0;
  }
  
  //Replace it with the next picture in the class
  slides[index].style.display = "inline-block";
  
  //Wait three seconds before switching again
  setTimeout(animateSlideshow, 3000);
}