
    document.forms["messageForm"].addEventListener("submit", async (event) => {
        event.preventDefault();
        var data = $("form").serialize();
        console.log(data);
        $.ajax({
            url: '/contact-message',
            method: 'post',
            data: data,
            success: (response) => {
                console.log(response, 'll6666lll');
                if(response.status){
                    $('#msgeFormdiv').load(location.href + " #msgeFormdiv")

                }
            }
        })
    })

