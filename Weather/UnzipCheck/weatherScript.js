/*
 * Citation:
 * Much of this code is similar to the code provided in the lectures.
 * It is changed to get weather data, but the basic approach is the same.
 */

var apiKey = 'fa7d80c48643dfadde2cced1b1be6ca1';

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
    document.getElementById('citySubmit').addEventListener('click', function(event) {
        var req = new XMLHttpRequest();
        var info = document.getElementById('cityName').value;
        req.open("GET", "https://api.openweathermap.org/data/2.5/weather?q=" + info + "&units=imperial&appid=" + apiKey, true);
        req.addEventListener('load', function(){
            if (req.status < 400) {
                document.getElementById('err').textContent = "No Errors Occurred";
                var response = JSON.parse(req.responseText);
                displayInfo(response);
            }
            else {
                document.getElementById('err').textContent = "An Error Occurred";
                clearInfo();
            }
        });
        req.send(null);
        event.preventDefault();
    })
		
    document.getElementById('zipSubmit').addEventListener('click', function(event) {
        var req = new XMLHttpRequest();
        var info = document.getElementById('zipCode').value;
        req.open("GET", "https://api.openweathermap.org/data/2.5/weather?zip=" + info + "&units=imperial&appid=" + apiKey, true);
        req.addEventListener('load', function(){
            if (req.status < 400) {
                document.getElementById('err').textContent = "No Errors Occurred";
                var response = JSON.parse(req.responseText);
                displayInfo(response);
            }
            else {
                document.getElementById('err').textContent = "An Error Occurred";
                clearInfo();
            }
        });
        req.send(null);
        event.preventDefault();
    })
		
    function displayInfo(response){
        document.getElementById('name').textContent = response.name;
        document.getElementById('long').textContent = response.coord.lon;
        document.getElementById('latt').textContent = response.coord.lat;
        document.getElementById('temp').textContent = response.main.temp + " Fahrenheit";
        document.getElementById('hum').textContent = response.main.humidity;
    }

    function clearInfo(response){
        document.getElementById('name').textContent = "N/A";
        document.getElementById('long').textContent = "N/A";
        document.getElementById('latt').textContent = "N/A";
        document.getElementById('temp').textContent = "N/A";
        document.getElementById('hum').textContent = "N/A";
    }
}