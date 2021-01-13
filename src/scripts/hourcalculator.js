$(document).ready(function() {


    // ============================== //
    // Botão alterar datas para hoje: //
    // ============================== //
    $("#btnAlterarDatas").click(function() {
        $("#dataIni").val(moment().format("yyyy-MM-DD"));
        validacaoDatas("#dataIni");
        $("#dataFim").val(moment().format("yyyy-MM-DD"));
        validacaoDatas("#dataFim");
    });


    // ====================== //
    // Botão de informações : //
    // ====================== //
    $("#opcaoinfo").click(function() {
        document.querySelector('.resultado').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });

    $("#opcaolimpar").click(function() {
        document.location.reload();
    });


    // ============================ //
    // Validação visual dos inputs: //
    // ============================ //
    $("#dataIni").focusout(function() {
        validacaoDatas("#dataIni");
    });

    $("#dataFim").focusout(function() {
        validacaoDatas("#dataFim");
    });

    $("#horaIni").focusout(function() {
        validacaoHoras("#horaIni");
    });

    $("#horaFim").focusout(function() {
        validacaoHoras("#horaFim");
    });


    // Funções de validação:
    // Check e Parse das informações.
    function validacaoDatas(inputId) {
        const MAX_DATE = moment("3000-12-31", "YYYY-MM-DD");
        const MIN_DATE = moment("1900-01-01", "YYYY-MM-DD");
        const inputValue = moment($(inputId).val(), "YYYY-MM-DD");

        if(inputValue > MAX_DATE || inputValue < MIN_DATE || !moment(inputValue).isValid()) {
            alterarCorDeFundo(inputId, "invalid");
        } else {
            alterarCorDeFundo(inputId, "valid");
            console.log(moment(inputValue).isValid());
        }
    }

    function validacaoHoras(inputId) {
        const inputValue = moment($(inputId).val(), "HH:mm:ss");
        console.log(inputValue);

        if(!moment(inputValue).isValid()) {
            alterarCorDeFundo(inputId, "invalid");
        } else {
            alterarCorDeFundo(inputId, "valid");
        }
    }

    function alterarCorDeFundo(inputId, style) {
        if(style === "valid") {
            $(inputId).removeClass("invalid");
            $(inputId).addClass("valid");
        }

        if(style === "invalid") {
            $(inputId).removeClass("valid");
            $(inputId).addClass("invalid");
        }
        
    }

    function limparInputs() {
        $("#dataIni").val("").removeClass(["invalid", "valid"]).addClass("untouched");
        $("#dataFim").val("").removeClass(["invalid", "valid"]).addClass("untouched");
        $("#horaIni").val("").removeClass(["invalid", "valid"]).addClass("untouched");
        $("#horaFim").val("").removeClass(["invalid", "valid"]).addClass("untouched");
    }

    // Variáveis globais:
    var arquivoResultados = [{}];
    var subtotal;

    // ============== //
    // # Botão Calcular:
    // • Preparar a requisição;
    // • Chamar a API de cálculo;
    // • Montar elementos e aprensetar na página;
    // ================================================================ //
    $("#btnCalcular").click(function() {
        const HOST_NAME = "http://localhost:8080";
        const PATH = "/api/calc/";
        const popUpSucesso = "Calculo Realizado!";
        const popUpFalhou = "Verifique os Campos!";
        const dataInicial = moment($("#dataIni").val()).format("YYYY-MM-DD").toString();
        const dataFinal = moment($("#dataFim").val()).format("YYYY-MM-DD").toString();
        const horaInicial = $("#horaIni").val().toString();
        const horaFinal = $("#horaFim").val().toString();     

        checarEDestacarCampos();
        chamandoValidacoes();
        
        function chamandoValidacoes() {
            if(estaVazio()) {
                chamarPopUp("falhou", popUpFalhou);
    
            } else if(dataInvertida()) {
                inverterDatas();
    
            } else if(horarioInvertido()) {
                inverterHorarios();
    
            } else {
                const body = montarReqBody();
                chamarAPI(body);
            }
        }

        function estaVazio() {
            if($("#horaIni").val().length === 0 || $("#horaFim").val().length === 0 || 
            $("#dataIni").val().length === 0 || $("#dataFim").val().length === 0) {
                return true;
            } else {
                return false;
            }
        }

        function dataInvertida() {
            if($("#dataIni").val() > $("#dataFim").val()) {
                return true;
            } else {
                return false;
            }
        }

        function inverterDatas() {
            let inverter = confirm("A data inicial informada é maior que a data final, deseja inverter?");
            if(inverter) {
                let aux = $("#dataIni").val();
                $("#dataIni").val($("#dataFim").val()).change();
                $("#dataFim").val(aux).change();
            }
        }

        function horarioInvertido() {
            if(($("#dataIni").val() === $("#dataFim").val()) && ($("#horaIni").val() > $("#horaFim").val())) {
                return true;
            } else {
                return false;
            }
        }

        function inverterHorarios() {
            let inverter = confirm("O primeiro horário está menor que o segundo horário, considerando que as datas são iguais, deseja inverter os horários?");
            if(inverter) {
                let aux = $("#horaIni").val();
                $("#horaIni").val($("#horaFim").val()).change();
                $("#horaFim").val(aux).change();
            }
        }

        function montarReqBody() {
            const req = {
                startHour: moment(dataInicial + " " + horaInicial).format("YYYY-MM-DD HH:mm:ss"),
                finalHour: moment(dataFinal + " " + horaFinal).format("YYYY-MM-DD HH:mm:ss")
            };
            return req;
        }

        function checarEDestacarCampos() {
            validacaoDatas("#dataIni");
            validacaoDatas("#dataFim");
            validacaoHoras("#horaIni");
            validacaoHoras("#horaFim");
        }

        function chamarAPI(body) {

            $.ajax({
                url: HOST_NAME + PATH,
                contentType: 'application/json',
                dataType: 'json',
                processData: false,
                type: 'POST',
                data: JSON.stringify(body),
            
                success: (res) => {
                        const response = [res];
                        checarSePrimeiroRegistro(arquivoResultados, response);
                        montarResultados(response);
                        limparInputs();
                        chamarPopUp("sucesso", popUpSucesso);
                },

                error: (error) => {
                    alert("Erro ao tentar realizar o cálculo.");
                    chamarPopUp("falhou", popUpFalhou);
                }
            });
        }

        function checarSePrimeiroRegistro(array, response) {
            if(array.length === 0) {
                array[arquivoResultados.length] = response;
            } else {
                array.push(response);
            }
        }

        function montarResultados(response) {
            var startHour;
            var finalHour;
            var horasResultado;
            var minutosResultado;
            var identificador;
            
           criarElementosHTML();
           mostrarElementosHTML();

           function criarElementosHTML() {
                for(let i = 0; i < response.length; i++) {
                    startHour = response[i].input.startHour;
                    finalHour = response[i].input.finalHour;
                    horasResultado = response[i].result.diffHours.toString();
                    minutosResultado = response[i].result.diffMinutes.toString();
                    identificador = i;

                    // Montando os elementos para mostrar o resultado:
                    const idResultadoDiv = criarElemento("div");
                    const resultadoDiv = criarElemento("div", "resultadoContainer");                
                    const resultadoText = criarElemento("textarea", "resultadoText");
                    const divBtn = criarElemento("div");
                    const copiarBtn = criarElemento("button", "resultadoBtn");
                    const toggleBtn = criarElemento("button", "resultadoBtn");
                    const deletarBtn = criarElemento("button", "resultadoBtn");
        
                    idResultadoDiv.innerHTML = "# - " + mascaraDoisDigitos(i);
                    resultadoText.innerHTML = 
                    "Resultado: " + `${mascaraDoisDigitos(horasResultado)}` + "h " + `${mascaraDoisDigitos(minutosResultado)}` + "m" + "\n" +
                    "-----------------------------------" + "\n" +
                    startHour + " - Hora Inicial" + "\n" +
                    finalHour + " - Hora Final";

                    // Adicionando as classes:
                    resultadoText.classList.add("resultadoText");
                    copiarBtn.classList.add("resultadoBtn");
                    toggleBtn.classList.add("resultadoBtn");
                    deletarBtn.classList.add("resultadoBtn");
                    divBtn.classList.add("resultadoBtnDiv");

                    // Append ao html principal:
                    resultadoDiv.append(resultadoText);
                    divBtn.append(copiarBtn, toggleBtn, deletarBtn);
                    resultadoDiv.append(divBtn);
                    $(".resultado").append(resultadoDiv);
                }
            }
        }

        function criarElemento(elementoHtml, classe) {
            let elemento = document.createElement(elementoHtml);    

            if(classe != null) {
                elemento.classList.add(classe);
            }
            return elemento;
        }

        function alterarSubtotal(tipo, valor) {
            const tipos = ["entrada", "saida"];

            if(tipo === tipos[0]) {
                subtotal += valor;
            }

            if(tipo === tipos[1]) {
                subtotal -= valor;
            }
        }
 
        function mascaraDoisDigitos(valor) {
            if(valor.length === 1) {
                return "0" + valor.toString();
            } else {
                return valor;
            }
        }

        function mostrarElementosHTML() {
            $(".resultado").removeClass("invisible");
            window.scroll(0, $(window).height());
        }

        function chamarPopUp(tipo, mensagem) {
            if(tipo === "sucesso" || tipo === "falhou") {
                $(".popup").html(mensagem);
                $(".popup").addClass(tipo);
                $(".popup-calculo").removeClass("invisible");
    
                setTimeout(function () {
                    $(".popup-calculo").addClass("invisible");
                    $(".popup").removeClass(tipo);
                }, 3000); 
            }
        }

        function textoCopiado(btn) {
            $(btn).html("Copiado!");
            setTimeout(function () {
                $(btn).html("CTRL + C");
            }, 1000);
        }

        function copiarConteudo(inputId) {
            var input = $(inputId);
            input.select();
            document.execCommand("copy");
        }
    });
});
