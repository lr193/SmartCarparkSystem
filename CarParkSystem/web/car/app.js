$('#navbar').load('navbar.html');

var API_URL = 'http://localhost:5000/api';

//register 
$('#register').on('click', function(){
    const user = $('#user').val();
    const rego = $('#vehicleRego').val();
    const model = $('#model').val();
    const password = $('#password').val();
    const conpassword = $('#conPassword').val();


    $.post(`${API_URL}/registration`, {user, rego, model, password})
    .then((response) =>{
        if (response.success) {
            localStorage.setItem('register', user);
            if(password == conpassword ){  
                localStorage.setItem('password', password);
                location.href = '/login';
            }else{
                $(document).ready(function(){
                        $("#message").append("<p class='alert alert-danger'>Passwords do not match!</p>");
                        });
                        console.log("Passwords do not match!");
                
            } 
            
        }else{
            $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
    });
});

//login
$('#login').on('click', function() {
    
    const rego = $("#vehicleRego").val();
    const password = $("#password").val();
    
    $.post(`${API_URL}/authenticate`, { rego, password })
    .then((response) =>{
        if (response.success) {
            localStorage.setItem('register', rego);
            location.href = '/';
        }else{
            console.log(response);
            $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
    });          
});

const logout = () => {
    localStorage.removeItem('register');
    location.href = '/login';
}
