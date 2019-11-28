/*
 * Citation:
 * Much of this code is similar to the code provided in the lectures.
 * It is changed to meet the requirements of the assignment, but the
 * basic approach is the same.
 */
 
document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
    document.getElementById('postSubmit').addEventListener('click', function(event) {
        var req = new XMLHttpRequest();
        var info = document.getElementById('postText').value;
        req.open("POST", "http://httpbin.org/post", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function(){
            if(req.status < 400) {
                document.getElementById('err2').textContent = "No Errors Occurred";
                var response = JSON.parse(req.responseText);
                document.getElementById('postData').textContent = response.data;
            }
            else {
                document.getElementById('err2').textContent = "An Error Occurred";
            }
        });
        req.send(JSON.stringify(info));
        event.preventDefault();
    })
}		