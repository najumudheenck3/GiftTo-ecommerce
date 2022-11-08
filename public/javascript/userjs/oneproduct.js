
            function addToCart(proId) {
                let quantity = document.getElementById(`qty`)?.value
                $.ajax({
                    url: '/add-to-cart/' + proId + '/' + quantity,
                    method: 'get',
                    success: (response) => {
                        console.log(response, 'lllll');
                        if (response.status) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Product Added to Cart',
                                showConfirmButton: false,
                                timer: 1000
                            })
                            $('#jjsh').load(location.href + " #jjsh")

                        } else {
                            Swal.fire({
                                icon: 'info',
                                title: 'Please Login',
                                showConfirmButton: false,
                                timer: 1000
                            })
                        }
                        console.log(count);
                    }
                })
            }
        
            function addToWishlist(proId) {
                $.ajax({
                    url: '/add-to-wishlist/' + proId,
                    method: 'post',
                    success: (response) => {

                        if (response.status) {
                            $('#jjsh').load(location.href + " #jjsh")

                        } else {
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
       
            function addProductIdNotify(proId) {
                document.getElementById('notifyProductId').value = proId
                console.log(proId);

            }
            document.forms["notifyForm"].addEventListener("submit", async (event) => {
                event.preventDefault();
                var data = $("form").serialize()
                console.log(data);
                $.ajax({
                    url: '/notify-product',
                    method: 'post',
                    data: data,
                    success: (response) => {
                        console.log(response, 'lllll');
                        if (response.status) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Thank you.We will notify you',
                                showConfirmButton: false,
                                timer: 1000
                            })
                            location.reload()
                            // $('#productDetail').load(location.href + " #productDetail")

                        }
                    }
                })
            })
       
            function addProductIdNotify(proId) {
                document.getElementById('notifyProductId').value = proId
                console.log(proId);

            }
            document.forms["reviewForm"].addEventListener("submit", async (event) => {
                event.preventDefault();
                var data = $("form").serialize()
                console.log(data);
                $.ajax({
                    url: '/post-reviews',
                    method: 'post',
                    data: data,
                    success: (response) => {
                        console.log(response, 'lllll');
                        if (response.status) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Thank you.We will notify you',
                                showConfirmButton: false,
                                timer: 1000
                            })
                            location.reload()
                            // $('#productDetail').load(location.href + " #productDetail")

                        }
                    }
                })
            })
       

