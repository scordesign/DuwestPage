$(document).ready(function () {

    getSessionDefault();


    $("#closeModal").on("click", function () {
        $("#modalBackground").toggleClass("hide");
    });

    $("body").on("click", function (event) {
        var user = $(event.target).is("#user-add") || $(event.target).is(".fa-user");
        var modal =$(event.target).is(".noClose")|| $(event.target).is(".filtersEach") || $(event.target).is("textarea") || $(event.target).is("#modal") || $(event.target).is("#formModal") || $(event.target).is("label") || $(event.target).is("input") || $(event.target).is("#miFormulario") || $(event.target).is("button") || $(event.target).is("i");

        if (!modal && !$("#modalBackground").hasClass("hide") && !user) {
            $("#modalBackground").toggleClass("hide");
        }
    });


});

function getSessionDefault() {
    $.ajax({
        url: "aplication/RequestController.php?action=getSession",
        type: "GET",
        success: function (response) {

            if(response !== "[]" && response !== ""){
                localStorage.setItem("session","1")
                $('.adminSession').removeClass("hide");
            }else{
                localStorage.setItem("session","0")
                $('.adminSession').addClass("hide");
            }
        },
        error: function (xhr, status, error) {
            reject(error); // Rechaza la promesa con el error
        }
    });
}


function getSession() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "aplication/RequestController.php?action=getSession",
            type: "GET",
            success: function (response) {
                resolve(response); // Resuelve la promesa con la respuesta del servidor
            },
            error: function (xhr, status, error) {
                reject(error); // Rechaza la promesa con el error
            }
        });
    });
}


// Crear el formulario dinámicamente


