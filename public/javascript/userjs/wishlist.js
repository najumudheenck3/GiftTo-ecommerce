
            function deleteItemFromWishlist(proId) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Remove From Wishlist!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#013542',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Remove!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: '/delete-from-wishlist/' + proId,
                            method: 'delete',
                            success: (response) => {
                                if (response.status) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'okey!..',
                                        text: 'remove from Wishlist',
                                        showConfirmButton: false,
                                        timer:500
                                    })
                                  
                                        location.reload()
                                 

                                }
                            }
                        })

                    }
                })


            }

      
            function addToCart(proId) {
                let quantity = 1
                $.ajax({
                    url: '/add-to-cart/' + proId + '/' + quantity,
                    method: 'get',
                    success: (response) => {
                        console.log(response, 'lllll');
                        Swal.fire({
                            icon: 'success',
                            title: 'okeyyy!..',
                            text: 'Successfully Added To the Cart',
                            showConfirmButton: false,
                        })
                        setTimeout(() => {
                            location.reload()
                        }, 1000)
                    }
                })
            }
       