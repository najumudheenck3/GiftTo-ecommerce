
function addToWishlist(proId) {
    $.ajax({
        url: '/add-to-wishlist/' + proId,
        method: 'post',
        success: (response) => {
                if(response.status){
                
                        $('#wishnum').load(location.href + " #wishnum")
                        $('#jjsh').load(location.href + " #jjsh")
                }else{
                Swal.fire({
                    icon: 'info',
                    title: 'Please Login',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        }
    })
}
