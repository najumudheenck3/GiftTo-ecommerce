
            function changeQuantity(proId, changeStatus) {

                let qtynull = document.getElementById(`qtynull-${proId}`)?.value
                console.log(qtynull);
                console.log(changeStatus);
                if (qtynull == 1 && changeStatus == -1) {
                    deleteItemFromCart(proId)
                }else if(qtynull == 10 && changeStatus == 1){
                    Swal.fire({
                                icon: 'warning',
                                title: 'errrr!..',
                                text: 'Your maximum limit is 10',
                                showConfirmButton: true,
                            })
// alert('you maximum limmitr is 10')
                } else {

                    $.ajax({
                        url: '/change-quantity/' + proId + '/' + changeStatus,
                        method: 'post',
                        success: (response) => {
                            if(response.status){
                                $('#cartfill').load(location.href + " #cartfill")
                            }
                            // console.log(response, 'lllll');
                            // Swal.fire({
                            //     icon: 'success',
                            //     title: 'okeyyy!..',
                            //     text: 'Quantity changed',
                            //     showConfirmButton: false,
                            // })
                            // setTimeout(() => {
                                // window.location.reload();
                                // location.reload()
                            // }, 1)
                        }
                    })
                }
            }
       
            function deleteItemFromCart(proId) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Remove From Cart!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#013542',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Remove!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: '/delete-from-cart/' + proId,
                            method: 'delete',
                            success: (response) => {
                                if (response.status) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'okeyyy!..',
                                        text: 'remove from cart',
                                        showConfirmButton: false,
                                    })
                                   
                                        location.reload()
                                

                                }
                            }
                        })

                    }
                })


            }

   