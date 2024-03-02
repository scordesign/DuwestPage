$(function () {
    $("#addProduct").on("click", function () {

        $("#modalBackground").toggleClass("hide");

        getSession().then(function (session) {
            $('#formModal').html("");
            if (session == "[]" || session == "") {
                session = JSON.parse(session);

                var form = $("<form>").attr("id", "miFormulario");


                form.append($("<i>").attr("font-size", "20vh").attr("class", "fas fa-times-circle").attr("style", "color: #32aa48; font-size:23vh;"));

                form.append($("<label>").text("error: "));
                form.append($("<input>").attr("type", "text").attr("disabled", "disabled").attr("value", "Sesión no iniciada").attr("style", "text-align: center;"));

                // Agregar el formulario al cuerpo del documento
                $("#formModal").append(form);

                return;
            }



            var form = $("<form>").attr("id", "miFormulario");


            form.append($("<label>").text("Nombre del producto: "));
            form.append($("<input>").attr("type", "text").attr("name", "name").attr("required", "required"));

            form.append($("<label>").text("Cantidad del producto: "));
            form.append($("<input>").attr("type", "text").attr("name", "amount"));

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

                    for (var key in response.data) {
                        var divFirst = $("<div>").attr("class", "filters noClose").attr("style", "width:100%;color:black;");
                        
                        if (response.data.hasOwnProperty(key)) {
                            divFirst.append($("<h4>").html(key).attr("class", "bold noClose"));
                            var objetos = response.data[key];
                            // Iterar sobre los objetos dentro de cada categoría
                            objetos.forEach(function (element) {
                                var divData = $("<div>").attr("class", "filtersEach").attr("style", "display:inline-flex;width:50%;");
        
                                divData.append($("<input>").attr("type", "checkbox").attr("onclick", "filterAdd(" + element.id + ")").attr("name", element.name).attr("style", "width:20%;").attr("id", "CheckboxFilter" + element.id));
                                divData.append($("<label>").text(element.name).attr("styles", "width:80%;"));
        
                                divFirst.append(divData);
                            });
                            div.append(divFirst);
                        }
                    }


                },
                error: function (xhr, status, error) {
                    // Manejar errores
                    console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
                }
            });

            form.append(div);

            

            form.append($("<input>").attr("type", "text").attr("name", "filters").attr("id", "filtersInput").attr("hidden", "hidden"));

            form.append($("<input>").attr("type", "text").attr("name", "section").attr("hidden", "hidden").attr("value", currentPageID));

            form.append($("<input>").attr("type", "text").attr("name", "action").attr("hidden", "hidden").attr("value", "addProduct"));


            form.append($("<button>").attr("type", "submit").text("Registar nuevo Producto").attr("id", "addProduct"));


            // Agregar el formulario al cuerpo del documento
            $("#formModal").append(form);

            // Manejar el envío del formulario
            $("#miFormulario").submit(function (event) {
                event.preventDefault(); // Prevenir el envío del formulario normal
                formData = new FormData(this);
                // Hacer una llamada AJAX al archivo PHP
                $.ajax({
                    url: "aplication/RequestController.php", // Archivo PHP que contiene la función
                    type: "POST", // Método de solicitud
                    data: formData,
                    contentType: false,
                    processData: false,// Datos a enviar (datos del formulario serializados)
                    success: function (response) {
                        // Manejar la respuesta
                        response = JSON.parse(JSON.parse(response));
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
});

function chargeProducts() {
    getProducts();
    $.ajax({
        url: "aplication/RequestController.php?action=getfilters", // Archivo PHP que contiene la función
        type: "GET", // Método de solicitud
        success: function (response) {
            response = JSON.parse(JSON.parse(response));
            console.log(response);
            var sectionNumber = currentPageID.substring(currentPageID.length - 2, currentPageID.length);
            for (var key in response.data) {
                var divFirst = $("<div>").attr("class", "filters").attr("style", "width:100%;color:black;");
                 
                if (response.data.hasOwnProperty(key)) {
                    divFirst.append($("<h4>").html(key).attr("class", "bold"));
                    var objetos = response.data[key];
                    // Iterar sobre los objetos dentro de cada categoría
                    objetos.forEach(function (element) {
                        var divData = $("<div>").attr("class", "filtersEach").attr("style", "display:inline-flex;width:100%;");

                        divData.append($("<input>").attr("type", "checkbox").attr("onclick", "filterAddProducts(" + element.id + ","+sectionNumber+")").attr("name", element.name).attr("style", "width:20%;").attr("id", "CheckboxFilter"+ sectionNumber +"-"+ element.id));
                        divData.append($("<label>").text(element.name).attr("styles", "width:80%;"));

                        divFirst.append(divData);
                    });
                    $("#filter-product-"+sectionNumber).append(divFirst);
                }
            }


        },
        error: function (xhr, status, error) {
            // Manejar errores
            console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
        }
    });
}

function filterAdd(id) {
    if ($('#CheckboxFilter' + id).prop('checked')) {
        $("#filtersInput").val($("#filtersInput").val() + "{" + id + "},");
    } else {
        $("#filtersInput").val($("#filtersInput").val().replace("{" + id + "},", ""));
    }
}

function filterAddProducts(id,section) {
    if ($('#CheckboxFilter'+section+"-" + id).prop('checked')) {
        $("#filtersInput-"+section).val($("#filtersInput-"+section).val() + "{" + id + "},");
    } else {
        $("#filtersInput-"+section).val($("#filtersInput-"+section).val().replace("{" + id + "},", ""));
    }
}

function getProducts() {
    $.ajax({
        url: "aplication/RequestController.php?action=getProducts", // Archivo PHP que contiene la función
        type: "GET", // Método de solicitud
        success: function (response) {
            //console.log(response.replace(/\\/g, ''));
            response = JSON.parse(JSON.parse(response));
            response.data.forEach(element => {
                
            });
            
        },
        error: function (xhr, status, error) {
            // Manejar errores
            console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
        }
    });
}