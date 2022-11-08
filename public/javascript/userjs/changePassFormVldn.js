var newpassError = document.getElementById('new-pass-error');
var newconfirmPassError = document.getElementById('new-confirmPass-error');
var newsubmitError = document.getElementById('pass-submit-error');




function validateNewPassword() {
    var newpass = document.getElementById('newPassword').value;

    if (newpass.length == 0) {
        newpassError.innerHTML = '**New Password is required';
        return false
    }
   
    if (newpass.length <= 8) {
        newpassError.innerHTML = '**Minimum password length must be 8';
        return false
    }
    newpassError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateNewConfirm() {
    var newconfirmPass = document.getElementById('confirmNewPassword').value;
    var newpass = document.getElementById('newPassword').value;

    if (newconfirmPass.length == 0) {
        newconfirmPassError.innerHTML = '**Confirm password is required';
        return false
    }
    if (newpass != newconfirmPass) {
        newconfirmPassError.innerHTML = '**Password doesnt matches';
        return false
    }
    newconfirmPassError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateNewForm() {
    if ( !validateNewPassword() || !validateNewConfirm()) {
        newsubmitError.style.display = 'block'
        newsubmitError.innerHTML = 'Please fill the form';
        setTimeout(function () { newsubmitError.style.display = 'none' }, 3000)
        return false;
    }
}