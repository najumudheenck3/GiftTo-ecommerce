
function fillForm(oneAddress, index) {
    if (oneAddress === 0) {
        console.log(index);
        console.log('kkk');
        document.getElementById('firstName').value = null
        document.getElementById('lastName').value = null
        document.getElementById('mobileNumber').value = null
        document.getElementById('address').value = null
        document.getElementById('state').value = null
        document.getElementById('district').value = null
        document.getElementById('pin').value = null
        document.getElementById('index').value = index

    } else {
        let address = JSON.parse(oneAddress)
        document.getElementById('firstName').value = address.firstName
        document.getElementById('lastName').value = address.lastName
        document.getElementById('mobileNumber').value = address.phone
        document.getElementById('address').value = address.address
        document.getElementById('state').value = address.state
        document.getElementById('district').value = address.district
        document.getElementById('pin').value = address.pincode
        document.getElementById('index').value = index
    }



}

document.forms["addressForm"].addEventListener("submit", async (event) => {
    event.preventDefault();
    var data = $("form").serialize();
    console.log(data);
    $.ajax({
        url: '/addAddress',
        method: 'post',
        data: data,
        success: (response) => {
            console.log(response, 'll6666lll');
            // Swal.fire({
            //     icon: 'success',
            //     title: 'okeyyy!..',
            //     text: 'Successfully Order Placed',
            //     showConfirmButton: false,
            // })
            // setTimeout(() => {
            // $('#add-ress-reload').load(location.href + " #add-ress-reload")
            if(response.status){
                location.reload()

            }
            // window.location = "/order-success"
            // }, 1000)
        }
    })
})


document.forms["passwordChangeForm"].addEventListener("submit", async (event) => {
    event.preventDefault();
    var data = $("form").serialize();
    console.log(data);
    $.ajax({
        url: '/change-password',
        method: 'post',
        data: data,
        success: (response) => {
            if (response.oldPasswordErr) {
                document.getElementById('oldPassword-error').innerHTML = "password incorrect"
                // $('#modalChangePasswordForm').modal('hide');
                // $('#add-ress-reload').load(location.href + " #add-ress-reload")
                // return false;
            } else if (response.otpVerifyErr) {
                document.getElementById('otpVerify-error').innerHTML = "otp incorrect"

            } else if (response.update) {
              
                location.reload()
                Swal.fire({
                    icon: 'success',
                    title: 'Change Your Password',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
            console.log(response, 'llllrrrl');

        }
    })
})


function deleteAdddress(addressIndex) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#013542',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            console.log(addressIndex,'jhng');
            $.ajax({
                url: '/delete-address/' + addressIndex,
                method: 'delete',
                success: (response) => {

                    $('#add-ress-reload').load(location.href + " #add-ress-reload")
                }
            })
        }
    })
}


function changePassword() {

console.log('najuithanworkd');
    $.ajax({
        url: '/change-passwordOtp',
        method: 'post',

    })


}
