$(document).ready(function () {
    $("#closeModal").on("click", function () {
        $("#modalBackground").toggleClass("hide");
    });


    $("#user-add").on("click", function () {
        $("#modalBackground").toggleClass("hide");

        $('#formModal').empty();

        var form = $("<form>").attr("id", "miFormulario");

        
        form.append($("<label>").text("usuario: "));
        form.append($("<input>").attr("type", "text").attr("name", "user").attr("required", "required"));

        form.append($("<label>").text("Contraseña: "));
        form.append($("<input>").attr("type", "password").attr("name", "password").attr("required", "required"));

        form.append($("<input>").attr("type", "text").attr("name", "action").attr("hidden", "hidden").attr("value", "LoggingUser"));

        form.append($("<button>").attr("type", "submit").text("iniciar session"));
        form.append($("<button>").attr("type", "button").text("Registar nuevo usuario").attr("id", "register").attr("onclick", "addNewUser()"));


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
                    console.log(response);
                    console.log(response == 200);
                    if (response == 200) {
                        $("#alerta").html("Sessionn iniciada");
                         $("#alerta").addClass("bg-success");

                         
                            $("#modalBackground").toggleClass("hide");
              

                        // Mostrar la alerta
                            $("#alerta").fadeIn();
                        

                        // Desvanecer la alerta después de 3 segundos
                        setTimeout(function () {
                            $("#alerta").fadeOut();
                        }, 3000);
                    }else{
                        $("#alerta").html("Sessionn no iniciada");
                         $("#alerta").addClass("bg-success");

                         
                            $("#modalBackground").toggleClass("hide");
              

                        // Mostrar la alerta
                            $("#alerta").fadeIn();
                        

                        // Desvanecer la alerta después de 3 segundos
                        setTimeout(function () {
                            $("#alerta").fadeOut();
                        }, 3000);
                    }

                },
                error: function (xhr, status, error) {
                    // Manejar errores
                    console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
                }
            });
        });
    });





    $("body").on("click", function(event) {
        var user = $(event.target).is("#user-add") || $(event.target).is(".fa-user");
        var modal =$(event.target).is("#modal") || $(event.target).is("#formModal") || $(event.target).is("label") || $(event.target).is("input") || $(event.target).is("#miFormulario") || $(event.target).is("button");

         if (!modal && !$("#modalBackground").hasClass("hide") && !user ) {
                $("#modalBackground").toggleClass("hide");
         }
    });


});

    // Crear el formulario dinámicamente
    function addNewUser() {  
        console.log("llego aca");

        $('#formModal').empty();

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
                    console.log(response);
                    console.log(response == 200);
                    if (response == 200) {
                        $("#alerta").html("Guardado exitosamente");
                         $("#alerta").addClass("bg-success");

                         
                            $("#modalBackground").toggleClass("hide");
              

                        // Mostrar la alerta
                            $("#alerta").fadeIn();
                        

                        // Desvanecer la alerta después de 3 segundos
                        setTimeout(function () {
                            $("#alerta").fadeOut();
                        }, 3000);
                    }

                },
                error: function (xhr, status, error) {
                    // Manejar errores
                    console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
                }
            });
        });
    }