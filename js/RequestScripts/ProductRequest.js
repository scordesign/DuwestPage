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
                        chargeProducts(currentPageID.replace("#tm-section-","").trim())

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



    $("#searchMenu").keyup(function () { 
        pageId= currentPageID.replace("#tm-section-","").trim();
        $("#products2-" + pageId+" .divProduct").remove();
        getProducts(pageId,$("#searchMenu").val(),($("#filtersInput-"+pageId).val() == ""?undefined:$("#filtersInput-"+pageId).val()))
    });

});

function pagination() {
    var pageCurrent = localStorage.getItem("PageRegs");
    var total = localStorage.getItem("TotalRegs");
    var pageId = currentPageID.replace("#tm-section-","").trim();
    var el =  $("#products2-" + pageId);
    console.log(pageCurrent * 10);
    console.log(total);
    if ((el.offset().top + el.outerHeight(true) < $(window).height()) && (pageCurrent * 10) < total  ) {
        localStorage.setItem("PageRegs",(pageCurrent.valueOf()-1) +2 );


        console.log("lo hizo");
        getProducts(pageId,($("#searchMenu").val() == ""?undefined:$("#searchMenu").val()),($("#filtersInput-"+pageId).val() == ""?undefined:$("#filtersInput-"+pageId).val()),(pageCurrent.valueOf()-1) +2 )
        return ;
    }
    console.log("no lo hizo");
}

function chargeProducts(pageId) {
    $("#products2-" + pageId+" .divProduct").remove();
    $("#filter-product-" + pageId).html('<input type="hidden" name="filtersInput-13" id="filtersInput-13" value="">');
    getProducts(pageId);
    getfilters(pageId);
}

function getfilters(pageId) {
    $.ajax({
        url: "aplication/RequestController.php?action=getfilters", // Archivo PHP que contiene la función
        type: "GET", // Método de solicitud
        success: function (response) {
            response = JSON.parse(JSON.parse(response));
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

function filterAdd(id) {
    if ($('#checkBox-' + id).prop('checked')) {
        $("#filtersInput").val($("#filtersInput").val() + "{" + id + "},");
    } else {
        $("#filtersInput").val($("#filtersInput").val().replace("{" + id + "},", ""));
    }
    console.log(($("#filtersInput").val()));
}

function filterAddProducts(id, section) {
    if ($('#CheckboxFilter' + section + "-" + id).prop('checked')) {
        $("#filtersInput-" + section).val($("#filtersInput-" + section).val() + "{" + id + "},");
    } else {
        $("#filtersInput-" + section).val($("#filtersInput-" + section).val().replace("{" + id + "},", ""));
    }
    pageId= currentPageID.replace("#tm-section-","").trim();
    $("#products2-" + pageId+" .divProduct").remove();
    getProducts(pageId,(($("#searchMenu").val() == ""?undefined :$("#searchMenu").val())),($("#filtersInput-"+pageId).val() == ""?undefined:$("#filtersInput-"+pageId).val()));
}



function getProducts(section,search,filters,page) {
    // section = section.substring(section.length-2,section.length);
    $.ajax({
        url: "aplication/RequestController.php?action=getProducts&section=tm-section-"+section+( typeof search == "undefined" ?"":"&search="+search)+( typeof filters == "undefined" ?"":"&filters="+filters)+( typeof page == "undefined" ?"":"&page="+page) , // Archivo PHP que contiene la función
        type: "GET", // Método de solicitud
        success: function (response) {
            //console.log(response.replace(/\\/g, ''));
            response = JSON.parse(JSON.parse(response));
            console.log(response);

            console.log(response.Total);
            console.log(response.Page);

            localStorage.setItem("TotalRegs",response.Total);
            localStorage.setItem("PageRegs",response.Page);

            response.data.forEach(element => {
                var divFather = $("<div>").attr("class", "divProduct").attr("onclick", "getProduct(" + element.id + ")");

                var divSon = $("<div>");
                divSon.append($("<img>").attr("src",element.listImg == null?"": element.listImg.length == 0 ? "" : element.listImg[0]));
                divFather.append(divSon);
                divFather.append($("<p>").html(element.name + ", " + element.amount));

                divFather.append($("<a>").html("Ver más información"));

                $("#products2-" + section).append(divFather);
            });

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
            if ($("#modalBackground").hasClass("hide")) {
                $("#modalBackground").toggleClass("hide");
            }


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

            divInfo.append($("<h5>").addClass("noClose").html((response.data.name + " / " + response.data.amount).toUpperCase()).addClass("fuente-leomn-milk").addClass("bold"));
            divInfo.append($("<p>").addClass("noClose").html(response.data.description).attr("id", "infoProductDesc").addClass("noClose").addClass("fuente-century-gothic"));

            var filtersProduct = "";
            i = 0;
            (response.data.filters.replaceAll("{", "").replaceAll("}", "").split(",")).forEach(element => {
                var filtersProductElement = $("#CheckboxFilter" + section + "-" + element);
                if (filtersProduct.includes(filtersProductElement.attr("data"))) {
                    filtersProduct = filtersProduct.substring(0, (filtersProduct.indexOf(filtersProductElement.attr("data")) + filtersProductElement.attr("data").length + 1)) + " " + filtersProductElement.attr("name") + "," + filtersProduct.substring((filtersProduct.indexOf(filtersProductElement.attr("data")) + filtersProductElement.attr("data").length + 1 /*+ filtersProductElement.attr("name").length + 2*/), filtersProduct.length) + ", ";
                } else {

                    filtersProduct += +" " + filtersProductElement.attr("data") + ": " + filtersProductElement.attr("name") + ", ";
                }
            });

            filtersProduct = filtersProduct.replaceAll(", 0", " ");
            filtersProduct = filtersProduct.endsWith(", ") ? filtersProduct.substring(0, filtersProduct.length - 2) : filtersProduct;
            filtersProduct = filtersProduct.startsWith("0") ? filtersProduct.substring(1, filtersProduct.length).replaceAll("0", " ") : filtersProduct.replaceAll("0", " ");
            divInfo.append($("<p>").addClass("filtersProduct").html(filtersProduct).addClass("noClose").addClass("fuente-century-gothic"));
            response.data.listDocs.forEach(element => {
                // var pDocs = $("<p>").addClass("noClose");
                // pDocs.append($("<a>").attr("href", element).attr("target", "_blank").html(element.split("/")[element.split("/").length-1]).addClass("noClose").addClass("fuente-century-gothic").addClass("DocProducts"));            
                divInfo.append($("<a>").attr("href", element).attr("target", "_blank").html(element.split("/")[element.split("/").length - 1]).addClass("noClose").addClass("fuente-century-gothic").addClass("DocProducts"));
                divInfo.append($("<br>"));
            });
 
            if(localStorage.getItem("session") == 1){
                divInfo.append($("<button>").attr("type", "button").attr("class", "btn btn-success ").html("editar").attr("style", "margin-top:2%;").attr("onclick", "getProductForUpdate("+id+")"));
                divInfo.append($("<br>"));
                divInfo.append($("<button>").attr("type", "button").attr("class", "btn btn-danger ").html("eliminar").attr("style", "margin-top:2%;").attr("onclick", "getProductForDelete("+id+")"));    
            }
            div.append(divCarrusel);
            div.append(divInfo);


            $("#formModal").append(div);
        },
        error: function (xhr, status, error) {
            // Manejar errores
            console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
        }
    });
}

function getProductForUpdate(id) {
    $.ajax({
        url: "aplication/RequestController.php?action=getProduct&id=" + id, // Archivo PHP que contiene la función
        type: "GET", // Método de solicitud
        success: function (responseProduct) {
            //console.log(response.replace(/\\/g, ''));
            responseProduct = JSON.parse(JSON.parse(responseProduct));
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
                form.append($("<input>").attr("type", "text").attr("value", responseProduct.data.name).attr("name", "name").attr("required", "required"));
    
                form.append($("<label>").text("Cantidad del producto: "));
                form.append($("<input>").attr("type", "text").attr("name", "amount").attr("value", responseProduct.data.amount));
    
                form.append($("<label>").text("Descripción del producto: "));
                form.append($("<textarea>").attr("name", "description").attr("style", "width: calc(100% - 20px);").val(responseProduct.data.description));
    
                form.append($("<label>").text("Imagenes del producto: "));
                form.append($("<input>").attr("type", "file").attr("name", "images[]").attr("multiple", "multiple").attr("style", "color:black;"));
                
                var divImg =$("<div>").addClass("noClose");                
                responseProduct.data.listImg.forEach(element => {
                    // var pDocs = $("<p>").addClass("noClose");
                    // pDocs.append($("<a>").attr("href", element).attr("target", "_blank").html(element.split("/")[element.split("/").length-1]).addClass("noClose").addClass("fuente-century-gothic").addClass("DocProducts"));            
                    var divContent = $("<div>").addClass("ContentFiles").addClass("noClose");
                    var divContentFile = $("<div>").addClass("ContentFile").html("<a href=\""+element+"\" target=\"_blank\" class=\"noClose\">"+element.split("/")[element.split("/").length-1]+"</a>").addClass("noClose");
                    var divContentActions = $("<div>").addClass("ContentFileActions").addClass("noClose");
                    divContentActions.append($("<button>").attr("type","button").attr("class","btn btn-danger").attr("onclick","deleteDocs(\""+element+"\","+responseProduct.data.id+","+1+")").html("<i class=\"far fa-trash-alt\"></i>").addClass("noClose"));
                    divContent.append(divContentFile);
                    divContent.append(divContentActions);
                    divImg.append(divContent);
                });
                form.append(divImg);


                form.append($("<label>").text("Archivos asociados al producto: "));
                form.append($("<input>").attr("type", "file").attr("name", "files[]").attr("multiple", "multiple").attr("style", "color:black;"));
                
                var divFile =$("<div>").addClass("noClose");                
                responseProduct.data.listDocs.forEach(element => {
                    // var pDocs = $("<p>").addClass("noClose");
                    // pDocs.append($("<a>").attr("href", element).attr("target", "_blank").html(element.split("/")[element.split("/").length-1]).addClass("noClose").addClass("fuente-century-gothic").addClass("DocProducts"));            
                    var divContent = $("<div>").addClass("ContentFiles").addClass("noClose");
                    var divContentFile = $("<div>").addClass("ContentFile").html("<a href=\""+element+"\" target=\"_blank\" class=\"noClose\">"+element.split("/")[element.split("/").length-1]+"</a>").addClass("noClose");
                    var divContentActions = $("<div>").addClass("ContentFileActions").addClass("noClose");
                    divContentActions.append($("<button>").attr("type","button").attr("class","btn btn-danger").attr("onclick","deleteDocs(\""+element+"\","+responseProduct.data.id+","+0+")").html("<i class=\"far fa-trash-alt\"></i>").addClass("noClose"));
                    divContent.append(divContentFile);
                    divContent.append(divContentActions);
                    divFile.append(divContent);
                });
                form.append(divFile);

                var div = $("<div>").attr("id", "filters").attr("style", "margin-top:2%;").addClass("noClose");
    
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
                                    var input = $("<input>").attr("type", "checkbox").attr("onclick", "filterAdd(" + element.id + ")").attr("name", element.name).attr("id", "checkBox-" + element.id).attr("style", "width:20%;");
                                    if(responseProduct.data.filters.includes("{"+element.id+"}")){
                                        input.prop('checked', true);
                                    }
                                    divData.append(input);
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
    
    
    
                form.append($("<input>").attr("type", "text").attr("name", "filters").attr("id", "filtersInput").attr("hidden", "hidden").val(responseProduct.data.filters+","));
    
                form.append($("<input>").attr("type", "text").attr("name", "section").attr("hidden", "hidden").attr("value", currentPageID));

                form.append($("<input>").attr("type", "text").attr("name", "id").attr("hidden", "hidden").attr("value", responseProduct.data.id));
    
                form.append($("<input>").attr("type", "text").attr("name", "action").attr("hidden", "hidden").attr("value", "editProducts"));
    
    
                form.append($("<button>").attr("type", "submit").text("Editar producto").attr("id", "editProducts"));
    
    
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

                            chargeProducts(currentPageID.replace("#tm-section-","").trim())
    
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
        },
        error: function (xhr, status, error) {
            // Manejar errores
            console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
        }
    });
}

function getProductForDelete(id) {
    $.ajax({
        url: "aplication/RequestController.php?action=getProduct&id=" + id, // Archivo PHP que contiene la función
        type: "GET", // Método de solicitud
        success: function (responseProduct) {
            //console.log(response.replace(/\\/g, ''));
            responseProduct = JSON.parse(JSON.parse(responseProduct));
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
    
                form.append($("<h4>").text("Esta seguro de eliminar el producto: ").addClass("noClose"));

                form.append($("<label>").text("Nombre del producto: "));
                form.append($("<input>").attr("type", "text").attr("disabled", "disabled").attr("value", responseProduct.data.name).attr("name", "name").attr("required", "required"));                

                form.append($("<input>").attr("type", "text").attr("name", "id").attr("hidden", "hidden").attr("value", responseProduct.data.id));
    
                form.append($("<input>").attr("type", "text").attr("name", "action").attr("hidden", "hidden").attr("value", "deleteProducts"));
    
    
                form.append($("<button>").attr("type", "submit").text("Editar producto").attr("id", "deleteProducts"));
    
    
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

                            chargeProducts(currentPageID.replace("#tm-section-","").trim())
    
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

function deleteDocs(docName,id,Type) {
    $.ajax({
        url: "aplication/RequestController.php", // Archivo PHP que contiene la función
        type: "POST", // Método de solicitud
        data: {
            "action": "deleteDocs",
            "docName": docName, // Variable1 que deseas enviar
            "id": id, // Variable2 que deseas enviar
            "type": Type // Variable3 que deseas enviar
        },
        success: function (response) {
            // Manejar la respuesta
            response = JSON.parse(JSON.parse(response));
            console.log(response);
            chargeProducts(currentPageID.replace("#tm-section-","").trim())
            getProductForUpdate(id);


        },
        error: function (xhr, status, error) {
            // Manejar errores
            console.log(xhr.responseText); // Mostrar la respuesta del servidor en la consola
        }
    });
}
