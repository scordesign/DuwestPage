$(document).ready(function () {
    $("#closeModal").on("click", function () {
        $("#modalBackground").toggleClass("hide");
    });


    $("#user-add").on("click", function () {
        $("#formModal").html("");

        $("#modalBackground").toggleClass("hide");


        getSession().then(function (session) {
            if (session != "[]") {
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
        }).catch(function (error) {
            // Ha ocurrido un error al obtener la sesión
            console.log("Error al obtener la sesión:", error);
        });

    });



    $("#addProduct").on("click", function () {

        $("#modalBackground").toggleClass("hide");

        getSession().then(function (session) {

            $('#formModal').html("");

            var form = $("<form>").attr("id", "miFormulario");


            form.append($("<label>").text("Nombre del producto: "));
            form.append($("<input>").attr("type", "text").attr("name", "name").attr("required", "required"));

            form.append($("<label>").text("Descripción del producto: "));
            form.append($("<textarea>").attr("name", "description").attr("style", "width: calc(100% - 20px);"));

            form.append($("<label>").text("Imagenes del producto: "));
            form.append($("<input>").attr("type", "file").attr("name", "images[]").attr("multiple", "multiple").attr("style", "color:black;"));

            form.append($("<label>").text("Archivos asociados al producto: "));
            form.append($("<input>").attr("type", "file").attr("name", "files[]").attr("multiple", "multiple").attr("style", "color:black;"));

            var div = $("<div>").attr("id", "filters").attr("style", "margin-top:2%;");

            $.ajax({
                url: "aplication/RequestController.php?action=getfilters", // Archivo PHP que contiene la función
                type: "GET", // Método de solicitud
                success: function (response) {
                    response = JSON.parse(JSON.parse(response));

                    (response.data).forEach(function (element) {
                        var divData = $("<div>").attr("class", "filtersEach").attr("style", "display:inline-flex;width:50%;");

                        divData.append($("<input>").attr("type", "checkbox").attr("onclick", "filterAdd(" + element.id + ")").attr("name", element.name).attr("style", "width:20%;").attr("id", "CheckboxFilter"+element.id));
                        divData.append($("<label>").text(element.name).attr("styles", "width:80%;"));

                        div.append(divData);
                    });
                },
                error: function (xhr, status, error) {
                    // Manejar errores
                    console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
                }
            });

            form.append(div);

            form.append($("<input>").attr("type", "text").attr("name", "filters").attr("id", "filters").attr("hidden", "hidden"));

            form.append($("<input>").attr("type", "text").attr("name", "action").attr("hidden", "hidden").attr("value", "addProduct"));

            form.append($("<button>").attr("type", "button").text("Registar nuevo Producto").attr("id", "addProduct"));


            // Agregar el formulario al cuerpo del documento
            $("#formModal").append(form);



            // Manejar el envío del formulario
            $("#miFormulario").submit(function (event) {
                event.preventDefault(); // Prevenir el envío del formulario normal
                formData =new FormData(this);

                // Hacer una llamada AJAX al archivo PHP
                $.ajax({
                    url: "aplication/RequestController.php", // Archivo PHP que contiene la función
                    type: "POST", // Método de solicitud
                    data: formData,
                     contentType: false,
                     processData: false,// Datos a enviar (datos del formulario serializados)
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
        }).catch(function (error) {
            // Ha ocurrido un error al obtener la sesión
            console.log("Error al obtener la sesión:", error);
        });

    });



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


    $("body").on("click", function (event) {
        var user = $(event.target).is("#user-add") || $(event.target).is(".fa-user");
        var modal = $(event.target).is(".filtersEach") || $(event.target).is("textarea") || $(event.target).is("#modal") || $(event.target).is("#formModal") || $(event.target).is("label") || $(event.target).is("input") || $(event.target).is("#miFormulario") || $(event.target).is("button") || $(event.target).is("i");

        if (!modal && !$("#modalBackground").hasClass("hide") && !user) {
            $("#modalBackground").toggleClass("hide");
        }
    });


});

function filterAdd(id) {
    if($('#CheckboxFilter'+id).prop('checked')){
        $("#filters").val($("#filters").val() + "{"+id+"},");
    }else{
        $("#filters").val($("#filters").val().replace("{"+id+"},", ""));
    }
}

// Crear el formulario dinámicamente
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