$('#navbar').load('navbar.html');

//register 
$('#register').on('click', function(){
    const username = $('#user').val();
    const rego = $('#vehicleRego').val();
    const password = $('#password').val();
    const conpassword = $('#conPassword').val();

    const register = JSON.parse(localStorage.getItem('register')) || [];
    

    const exists = register.find(register => register.register === rego);

    console.log(register);
    console.log(exists);

    if(exists===undefined){
       
        //registration not found
        if(password === conpassword){
            
            //register
            register.push({ user:username, password:password, register:rego });
            localStorage.setItem('register', JSON.stringify(register));
           
            location.href = "/login";
            console.log("Passwords match"); 

        }else{
            
            //password do not match
            $(document).ready(function(){
                $("#message").append("<p class='alert alert-danger'>password do not match</p>");
            });
            console.log("password do not match")

        }


    }else{
        //Registration exists
        $(document).ready(function(){
            $("#message").append("<p class='alert alert-danger'>user already exists</p>");
        });
        console.log("Registration number already exists");
    }    

});

//login
$('#login').on('click', function() {
    
    const rego = $("#vehicleRego").val();
    const password = $("#password").val();

    const register = JSON.parse(localStorage.getItem('register')) || [];
    const exists = register.find(register => register.register === rego);

    if(exists===undefined){
        
        //rego password incorrect
        $(document).ready(function(){
            $("#message").append("<p class='alert alert-danger'>User name or Password incorrect!</p>");
        });
        console.log("registration or Password incorrect!");

    }else{
        if(password === exists.password){

            //login successful
            console.log("Password Match");

            const isAuthenticated = undefined;
            localStorage.setItem('isAuthenticated', "true");

            location.href = "/";

        }else{

            //password incorrect
            $(document).ready(function(){
                $("#message").append("<p class='alert alert-danger'>Password incorrect!</p>");
            });

            console.log("Password incorrect!");

        }
    }           
});




const logout = () => {
    localStorage.removeItem('register');
    location.href = '/login';
}
