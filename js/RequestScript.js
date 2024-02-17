$(document).ready(function () {
    $("#closeModal").on("click", function () {
        $("#modalBackground").toggleClass("hide");
    });
    // Crear el formulario dinámicamente
    $("#user-add").on("click", function () {
        $("#modalBackground").toggleClass("hide");

        $('#formModal').empty();

        var form = $("<form>").attr("id", "miFormulario");

        form.append($("<label>").text("Nombre: "));
        form.append($("<input>").attr("type", "text").attr("name", "name"));

        form.append($("<label>").text("Correo electrónico: "));
        form.append($("<input>").attr("type", "email").attr("name", "mail"));

        form.append($("<label>").text("usuario: "));
        form.append($("<input>").attr("type", "text").attr("name", "user"));

        form.append($("<label>").text("Contraseña: "));
        form.append($("<input>").attr("type", "password").attr("name", "password"));

        form.append($("<input>").attr("type", "text").attr("name", "action").attr("hidden", "hidden").attr("value", "RegiterUser"));

        form.append($("<button>").attr("type", "submit").text("Registar usuario"));


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
                        $("#alerta").append("Guardado exitosamente");
                         $("#alerta").addClass("alert-success");

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


});