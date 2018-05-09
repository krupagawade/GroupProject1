
window.onload = function(){
var city = localStorage.getItem("city");
var zipcode =  localStorage.getItem("zipcode");
var queryURL = "";

if(city === ""){
    queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + zipcode +"&APPID=13d0f678f16aa7142eb28873f21f6efb";
    console.log("Inside blank city");

}
else{
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&APPID=13d0f678f16aa7142eb28873f21f6efb";
    console.log("Inside else");
}
  $.ajax({  
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
        console.log(response);
        var descript = response.weather[0].description;
        var temp = Math.trunc((((response.main.temp-273.15)*1.8) +32));
        var temp2 = temp + "°F"
        $('#temp').text(temp2);
        $('#description').text(descript);


  });

};