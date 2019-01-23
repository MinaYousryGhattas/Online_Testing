function validate(){
    console.log('error');
    var accept = true;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    $('.error').remove();
    if (!$('#email').val().match(re)){
        $('#email').after('<p class="error">Please write valid mail<p>');
        accept = false;
    }
    if ($('#password1').val() !== $('#password').val()){
        $('#password1').after('<p class="error">Re-password must match password<p>');
        accept = false;
    }
    if ($('#password').val().length < 8){
        $('#password').after('<p class="error">Password must contain 8 digits<p>');
        accept = false;
    }
    $('.error').css("color","red");
    return accept;
}
