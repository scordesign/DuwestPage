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

                                divData.append($("<input>").attr("type", "checkbox").attr("onclick", "filterAdd(" + element.id + ")").attr("name", element.name).attr("id", "checkBox-" + element.id).attr("style", "width:20%;"));
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

function getfilters(pageId) {
    $.ajax({
        url: "aplication/RequestController.php?action=getfilters", // Archivo PHP que contiene la función
        type: "GET", // Método de solicitud
        success: function (response) {
            response = JSON.parse(JSON.parse(response));
            console.log(response);
            var sectionNumber = pageId;
            // var sectionNumber = pageId.substring(pageId.length - 2, pageId.length);
            for (var key in response.data) {
                var divFirst = $("<div>").attr("class", "filters").attr("style", "width:100%;color:black;");

                if (response.data.hasOwnProperty(key)) {
                    divFirst.append($("<h4>").html(key).attr("class", "bold"));
                    var objetos = response.data[key];
                    // Iterar sobre los objetos dentro de cada categoría
                    objetos.forEach(function (element) {
                        var divData = $("<div>").attr("class", "filtersEach").attr("style", "display:inline-flex;width:100%;");

                        divData.append($("<input>").attr("data", key).attr("type", "checkbox").attr("onclick", "filterAddProducts(" + element.id + "," + sectionNumber + ")").attr("name", element.name).attr("id", "CheckboxFilter" + sectionNumber + "-" + element.id));
                        divData.append($("<label>").text(element.name).attr("styles", "width:80%;"));

                        divFirst.append(divData);
                    });
                    $("#filter-product-" + sectionNumber).append(divFirst);
                }
            }


        },
        error: function (xhr, status, error) {
            // Manejar errores
            console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
        }
    });
}

function chargeProducts(pageId) {
    getProducts(pageId);
    getfilters(pageId);
}

function filterAdd(id) {
    if ($('#CheckboxFilter' + id).prop('checked')) {
        $("#filtersInput").val($("#filtersInput").val() + "{" + id + "},");
    } else {
        $("#filtersInput").val($("#filtersInput").val().replace("{" + id + "},", ""));
    }
}

function filterAddProducts(id, section) {
    if ($('#CheckboxFilter' + section + "-" + id).prop('checked')) {
        $("#filtersInput-" + section).val($("#filtersInput-" + section).val() + "{" + id + "},");
    } else {
        $("#filtersInput-" + section).val($("#filtersInput-" + section).val().replace("{" + id + "},", ""));
    }
}

function getProducts(section) {
    // section = section.substring(section.length-2,section.length);
    $.ajax({
        url: "aplication/RequestController.php?action=getProducts", // Archivo PHP que contiene la función
        type: "GET", // Método de solicitud
        success: function (response) {
            //console.log(response.replace(/\\/g, ''));
            response = JSON.parse(JSON.parse(response));
            response.data.forEach(element => {
                var divFather = $("<div>").attr("class", "divProduct").attr("onclick", "getProduct(" + element.id + ")");

                var divSon = $("<div>");
                divSon.append($("<img>").attr("src", element.listImg.length == 0 ? "" : element.listImg[0]));
                divFather.append(divSon);
                divFather.append($("<p>").html(element.name + ", " + element.amount));

                divFather.append($("<a>").html("Ver más información"));

                $("#products2-" + section).append(divFather);
            });
            console.log($("#products2-" + section));
            console.log("#products2-" + section);
        },
        error: function (xhr, status, error) {
            // Manejar errores
            console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
        }
    });
}

function getProduct(id) {
    var section = currentPageID.substring(currentPageID.length - 2, currentPageID.length);
    $.ajax({
        url: "aplication/RequestController.php?action=getProduct&id=" + id, // Archivo PHP que contiene la función
        type: "GET", // Método de solicitud
        success: function (response) {
            //console.log(response.replace(/\\/g, ''));
            response = JSON.parse(JSON.parse(response));
            console.log(response);
            console.log(response.listImg);
            $("#formModal").html("");

            $("#modalBackground").toggleClass("hide");


            var div = $("<div>").attr("id", "fatherProductModal").addClass("noClose");
            var divCarrusel = $("<div>").attr("id", "myCarouselProduct").attr("class", "carousel slide").attr("data-ride", "carousel").addClass("noClose");


            var divCarruselinner = $("<div>").attr("class", "carousel-inner").addClass("noClose");

            var i = 0;
            response.data.listImg.forEach(element => {
                var divCarruselinnerItem = $("<div>").attr("class", "carousel-item " + (i == 0 ? "active" : "")).attr("id", "carousel-item" + i).addClass("noClose");
                divCarruselinnerItem.append($("<img>").attr("class", "d-block w-100").attr("src", element).attr("alt", "imagen " + i).addClass("noClose"));
                divCarruselinner.append(divCarruselinnerItem);
                i++;
            });
            divCarrusel.append(divCarruselinner);
            var aCarruselPrev = $("<a>").attr("id", "carousel-control-prev").attr("onclick", "prevProductIMg(0)").attr("class", "carousel-control-prev").attr("href", "#carouselExampleIndicators").attr("role", "button").attr("data-slide", "prev").addClass("noClose");
            aCarruselPrev.append($("<span>").attr("class", "carousel-control-prev-icon").attr("aria-hidden", "true").addClass("noClose"));
            aCarruselPrev.append($("<span>").attr("class", "sr-only").html("Anterior").addClass("noClose"));

            var aCarruselNext = $("<a>").attr("id", "carousel-control-next").attr("onclick", "nextProductIMg(0)").attr("class", "carousel-control-next").attr("href", "#carouselExampleIndicators").attr("role", "button").attr("data-slide", "next").addClass("noClose");
            aCarruselNext.append($("<span>").attr("class", "carousel-control-next-icon").attr("aria-hidden", "true").addClass("noClose"));
            aCarruselNext.append($("<span>").attr("class", "sr-only").html("Siguiente").addClass("noClose"));

            divCarrusel.append(aCarruselPrev);
            divCarrusel.append(aCarruselNext);

            // info
            var divInfo = $("<div>").attr("id", "infoProduct").addClass("noClose");
            divInfo.append($("<h5>").addClass("noClose").html(response.name));
            divInfo.append($("<p>").addClass("noClose").html(response.description).attr("id", "infoProductDesc"));

            var filtersProduct = "";
            i = 0;
            console.log(response.data.filters.replaceAll("{", "").replaceAll("}", ""));
            (response.data.filters.replaceAll("{", "").replaceAll("}", "").split(",")).forEach(element => {
                var filtersProductElement = $("#CheckboxFilter" + section + "-" + element);
                if (filtersProduct.includes(filtersProductElement.attr("data"))) {
                    filtersProduct =  filtersProduct.substring(0, (filtersProduct.indexOf(filtersProductElement.attr("data")) + filtersProductElement.attr("data").length + 1) )+ " " + filtersProductElement.attr("name") +"," + filtersProduct.substring( (filtersProduct.indexOf(filtersProductElement.attr("data")) + filtersProductElement.attr("data").length + 1 +filtersProductElement.attr("name").length+2) , filtersProduct.length );
                } else {
                    filtersProduct += +" "+filtersProductElement.attr("data") + ": " + filtersProductElement.attr("name");
                }
            });
            console.log(filtersProduct);
            div.append(divCarrusel);


            $("#formModal").append(div);
        },
        error: function (xhr, status, error) {
            // Manejar errores
            console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
        }
    });
}

function nextProductIMg(currentImg) {
    var nextPage = $(".carousel-item").length - 1 < (currentImg + 1) ? 0 : (currentImg + 1);
    $(".carousel-item").removeClass("active");
    $("#carousel-item" + nextPage).addClass("active");
    $("#carousel-control-next").removeAttr("onclick");
    $("#carousel-control-next").attr("onclick", "nextProductIMg(" + nextPage + ")");
}

function prevProductIMg(currentImg) {
    var nextPage = 0 > (currentImg - 1) ? ($(".carousel-item").length - 1) : (currentImg - 1);
    $(".carousel-item").removeClass("active");
    $("#carousel-item" + nextPage).addClass("active");
    $("#carousel-control-prev").removeAttr("onclick");
    $("#carousel-control-prev").attr("onclick", "prevProductIMg(" + nextPage + ")");

}

