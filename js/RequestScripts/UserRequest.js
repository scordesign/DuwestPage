$(function () {
    $("#user-add").on("click", function () {
        $("#formModal").html("");

        $("#modalBackground").toggleClass("hide");


        getSession().then(function (session) {
            if (session !== "[]" && session !== "") {
                session = JSON.parse(session);

                var form = $("<form>").attr("id", "miFormulario");


                form.append($("<i>").attr("font-size", "20vh").attr("class", "fas fa-user-circle").attr("style", "color: #32aa48; font-size:23vh;"));

                form.append($("<label>").text("Correo: "));
                form.append($("<input>").attr("type", "text").attr("disabled", "disabled").attr("value", session.mail).attr("style", "text-align: center;"));

                form.append($("<label>").text("Usuario: "));
                form.append($("<input>").attr("type", "text").attr("disabled", "disabled").attr("value", session.user).attr("style", "text-align: center;"));

                form.append($("<label>").text("nombre: "));
                form.append($("<input>").attr("type", "text").attr("disabled", "disabled").attr("value", session.name).attr("style", "text-align: center;"));


                form.append($("<button>").attr("type", "button").text("cerrar sesión").attr("id", "closeSession").attr("onclick", "closeUser()"));


                form.append($("<button>").attr("type", "button").text("Registar nuevo usuario").attr("id", "register").attr("onclick", "addNewUser()"));



                // Agregar el formulario al cuerpo del documento
                $("#formModal").append(form);

                return;
            }

            $('#formModal').html("");

            var form = $("<form>").attr("id", "miFormulario");


            form.append($("<label>").text("usuario: "));
            form.append($("<input>").attr("type", "text").attr("name", "user").attr("required", "required"));

            form.append($("<label>").text("Contraseña: "));
            form.append($("<input>").attr("type", "password").attr("name", "password").attr("required", "required"));

            form.append($("<input>").attr("type", "text").attr("name", "action").attr("hidden", "hidden").attr("value", "LoggingUser"));

            form.append($("<button>").attr("type", "submit").text("iniciar session"));


            // Agregar el formulario al cuerpo del documento
            $("#formModal").append(form);



            // Manejar el envío del formulario
            $("#miFormulario").submit(function (event) {
                event.preventDefault(); // Prevenir el envío del formulario normal

                // Hacer una llamada AJAX al archivo PHP
                $.ajax({
                    url: "aplication/RequestController.php", // Archivo PHP que contiene la función
                    type: "POST", // Método de solicitud
                    data: $(this).serialize(), // Datos a enviar (datos del formulario serializados)
                    success: function (response) {
                        // Manejar la respuesta
                        response = JSON.parse(response);
                        $("#alerta").removeClass("bg-success");
                        $("#alerta").removeClass("bg-danger");
                        $("#alerta").removeClass("bg-warning");
                        $("#alerta").html(response.message);
                        if (response.status == 200) {
                            $("#alerta").addClass("bg-success");
                        } else if (response.status == 500) {
                            $("#alerta").addClass("bg-danger");
                        } else {
                            $("#alerta").addClass("bg-warning");
                        }

                        $("#modalBackground").toggleClass("hide");


                        // Mostrar la alerta
                        $("#alerta").fadeIn();

                        getSessionDefault();
                        // Desvanecer la alerta después de 3 segundos
                        setTimeout(function () {
                            $("#alerta").fadeOut();
                        }, 3000);

                    },
                    error: function (xhr, status, error) {
                        // Manejar errores
                        console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
                    }
                });
            });
        }).catch(function (error) {
            // Ha ocurrido un error al obtener la sesión
            console.log("Error al obtener la sesión:", error);
        });

    });
});

function addNewUser() {
    $('#formModal').html("");

    var form = $("<form>").attr("id", "miFormulario");

    form.append($("<label>").text("Nombre: "));
    form.append($("<input>").attr("type", "text").attr("name", "name").attr("required", "required"));

    form.append($("<label>").text("Correo electrónico: "));
    form.append($("<input>").attr("type", "email").attr("name", "mail").attr("required", "required"));

    form.append($("<label>").text("usuario: "));
    form.append($("<input>").attr("type", "text").attr("name", "user").attr("required", "required"));

    form.append($("<label>").text("Contraseña: "));
    form.append($("<input>").attr("type", "password").attr("name", "password").attr("required", "required"));

    form.append($("<input>").attr("type", "text").attr("name", "action").attr("hidden", "hidden").attr("value", "RegiterUser"));

    form.append($("<button>").attr("type", "submit").text("Registar usuario"));
    form.append($("<button>").attr("type", "button").text("Iniciar sesión").attr("id", "logging"));


    // Agregar el formulario al cuerpo del documento
    $("#formModal").append(form);



    // Manejar el envío del formulario
    $("#miFormulario").submit(function (event) {
        event.preventDefault(); // Prevenir el envío del formulario normal

        // Hacer una llamada AJAX al archivo PHP
        $.ajax({
            url: "aplication/RequestController.php", // Archivo PHP que contiene la función
            type: "POST", // Método de solicitud
            data: $(this).serialize(), // Datos a enviar (datos del formulario serializados)
            success: function (response) {
                // Manejar la respuesta
                response = JSON.parse(response);
                $("#alerta").removeClass("bg-success");
                $("#alerta").removeClass("bg-danger");
                $("#alerta").removeClass("bg-warning");
                $("#alerta").html(response.message);
                if (response.status == 200) {
                    $("#alerta").addClass("bg-success");
                } else if (response.status == 500) {
                    $("#alerta").addClass("bg-danger");
                } else {
                    $("#alerta").addClass("bg-warning");
                }

                $("#modalBackground").toggleClass("hide");


                // Mostrar la alerta
                $("#alerta").fadeIn();


                // Desvanecer la alerta después de 3 segundos
                setTimeout(function () {
                    $("#alerta").fadeOut();
                }, 3000);
            },
            error: function (xhr, status, error) {
                // Manejar errores
                console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
            }
        });
    });
}

function closeUser() {
    $.ajax({
        url: "aplication/RequestController.php?action=destroySession",
        type: "GET",
        success: function (response) {
            $("#alerta").removeClass("bg-success");
            $("#alerta").removeClass("bg-danger");
            $("#alerta").removeClass("bg-warning");

            if (response == "true") {
                $("#alerta").html("sesión cerrada");
                $("#alerta").addClass("bg-success");
            } else {
                $("#alerta").html("error al cerrar sesión");
                $("#alerta").addClass("bg-danger");
            }

            $("#modalBackground").toggleClass("hide");


            // Mostrar la alerta
            $("#alerta").fadeIn();
            

            // Desvanecer la alerta después de 3 segundos
            setTimeout(function () {
                $("#alerta").fadeOut();
            }, 3000);
            getSessionDefault();

            
            // Resuelve la promesa con la respuesta del servidor
        },
        error: function (xhr, status, error) {
            $("#alerta").removeClass("bg-success");
            $("#alerta").removeClass("bg-danger");
            $("#alerta").removeClass("bg-warning");
            $("#alerta").html("error");

            $("#alerta").addClass("bg-danger");


            $("#modalBackground").toggleClass("hide");


            // Mostrar la alerta
            $("#alerta").fadeIn();


            // Desvanecer la alerta después de 3 segundos
            setTimeout(function () {
                $("#alerta").fadeOut();
            }, 3000);
            reject(error); // Rechaza la promesa con el error
        }
    });
}