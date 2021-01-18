$(document).ready(() => {
    // Variáveis globais:
    const HOST_NAME = "http://localhost:8080";
    const PATH = "/api/calc/";
    var arquivoResultados = [];
    var subtotal;

    inicializarBotoes();
    inicializarValidacaoCampos();

    
    function inicializarBotoes() {
        // Botão Alterar Datas.
        $("#btnAlterarDatas").click(() => {
            $("#dataIni").val(moment().format("yyyy-MM-DD"));
            validacaoDatas("#dataIni");
            $("#dataFim").val(moment().format("yyyy-MM-DD"));
            validacaoDatas("#dataFim");
        });

        // Botão Limpar.
        $("#opcaolimpar").click(() => {
            document.location.reload();
        });

        // Botão Info.
        $("#opcaoinfo").click(() => {
            // document.querySelector(?).scrollIntoView({ 
            //    behavior: 'smooth' 
            // });
        });
    }

    function inicializarValidacaoCampos() {
        $("#dataIni").focusout(() => {
            validacaoDatas("#dataIni");
        });

        $("#dataFim").focusout(() => {
            validacaoDatas("#dataFim");
        });

        $("#horaIni").focusout(() => {
            validacaoHoras("#horaIni");
        });

        $("#horaFim").focusout(() => {
            validacaoHoras("#horaFim");
        });
    }

    function validacaoDatas(inputId) {
        const MAX_DATE = moment("3000-12-31", "YYYY-MM-DD");
        const MIN_DATE = moment("1900-01-01", "YYYY-MM-DD");
        const inputValue = moment($(inputId).val(), "YYYY-MM-DD");

        if(inputValue > MAX_DATE || inputValue < MIN_DATE || !moment(inputValue).isValid()) {
            alterarCorDeFundo(inputId, "invalid");
        } else {
            alterarCorDeFundo(inputId, "valid");
        }
    }

    function validacaoHoras(inputId) {
        const inputValue = moment($(inputId).val(), "HH:mm:ss");
        if(!moment(inputValue).isValid()) {
            alterarCorDeFundo(inputId, "invalid");
        } else {
            alterarCorDeFundo(inputId, "valid");
        }
    }

    function alterarCorDeFundo(inputId, style) {
        if(style === "valid") {
            $(inputId).removeClass("invalid").addClass("valid");

        } else if(style === "invalid") {
            $(inputId).removeClass("valid").addClass("invalid");
        }
    }

    function limparInputs() {
        $("#dataIni").val("").removeClass(["invalid", "valid"]).addClass("untouched");
        $("#dataFim").val("").removeClass(["invalid", "valid"]).addClass("untouched");
        $("#horaIni").val("").removeClass(["invalid", "valid"]).addClass("untouched");
        $("#horaFim").val("").removeClass(["invalid", "valid"]).addClass("untouched");
    }

    /*
      > Botão Calcular:
         Preparar a requisição;
         Chamar a API de cálculo;
         Montar elementos e aprensetar na página;
    */
   
    $("#btnCalcular").click(() => {

        const dataInicial = moment($("#dataIni").val()).format("YYYY-MM-DD").toString();
        const dataFinal = moment($("#dataFim").val()).format("YYYY-MM-DD").toString();
        const horaInicial = $("#horaIni").val().toString();
        const horaFinal = $("#horaFim").val().toString();     
        
        validacaoVisualCampos();
        chamandoValidacoes();

        function validacaoVisualCampos() {
            checarEDestacarCampo("data", "#dataIni");
            checarEDestacarCampo("data", "#dataFim");
            checarEDestacarCampo("hora", "#horaIni");
            checarEDestacarCampo("hora", "#horaFim");
        }

        function chamandoValidacoes() {
            
            if(estaVazio("#dataIni") || estaVazio("#dataFim") || estaVazio("#horaIni") || estaVazio("#horaFim")) {
                chamarPopUp("falhou", "Verifique os campos!");
                window.scroll(0, 0);

            } else if(dataInvertida()) {
                inverterValores("#dataIni", "#dataFim", "A data inicial informada é maior que a data final, deseja inverter?");
    
            } else if(horarioInvertido()) {
                inverterValores("#horaIni", "#horaFim", "Horário inicial é menor que o horário final, deseja inverter os horários?");
    
            } else {
                const body = montarReqBody();
                chamarAPI(body);
            }
        }

        function dataInvertida() {
            if($("#dataIni").val() > $("#dataFim").val()) {
                return true;
            } else {
                return false;
            }
        }

        function inverterValores(primeiro, segundo, mensagem) {
            let inverter = confirm(mensagem);
            if(inverter) {
                const aux = $(primeiro).val();
                $(primeiro).val($(segundo).val()).change();
                $(segundo).val(aux).change();
            }
        }

        function horarioInvertido() {
            if(($("#dataIni").val() === $("#dataFim").val()) && ($("#horaIni").val() > $("#horaFim").val())) {
                return true;
            } else {
                return false;
            }
        }

        function montarReqBody() {
            const req = {
                startHour: moment(dataInicial + " " + horaInicial).format("YYYY-MM-DD HH:mm:ss"),
                finalHour: moment(dataFinal + " " + horaFinal).format("YYYY-MM-DD HH:mm:ss")
            };
            return req;
        }

        function checarEDestacarCampo(tipo, campo) {
            if(tipo === "hora") {
                validacaoHoras(campo);
            }
            if(tipo === "data") {
                validacaoDatas(campo);
            }
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
                        const response = res;
                        registrarResultado(arquivoResultados, response);
                        enumerarResultado(arquivoResultados);
                        mostrarResultado();
                        limparInputs();
                        chamarPopUp("sucesso", "Cálculo realizado!");
                },

                error: (error) => {
                    alert("Erro ao tentar realizar o cálculo.");
                    chamarPopUp("falhou", "Requisição com o servidor falhou!");
                }
            });
        }

        function registrarResultado(array, response) {
            var responseModificado = response;
            responseModificado["somar"] = false;

            if(array.length === 0) {
                array[0] = response;
            } else {
                array.push(response);
            }
        }

        function enumerarResultado(array) {
            for(var i = 0; i < array.length; i++) {
                var posicaoModificada = array[i];           
                posicaoModificada["id"] = mascaraIdResultado(i);
                array[i] = posicaoModificada;
            }
        }

        function mascaraIdResultado(index) {
            return "resultado" + mascaraDoisDigitos(index);
        }

        function mostrarResultado() {
            // Limpar Elementos (?)
            // Limpa todos os elementos referete à resultados já exibidos,
            // o fato disso ser necessário é que a regra 'criarMostrarResultados'
            // atualiza todos os index do array de resultados, ordenando-os novamente.
            limparElementos();
            criarMostrarResultados(arquivoResultados);
            atribuirFuncaoBotoes();
            efeitoNovoResultado();
        }

        function criarMostrarResultados(resultados) {
            if(resultados.length > 0) {
                for(let i = 0; i < resultados.length; i++) {
                    const identificador = resultados[i].id;
                    const contornoDiv = criarElemento("div", "contornoDiv");
                    const resultadoDiv = criarElemento("div", "resultadoContainer resultadoNormal");                
                    const resultadoText = criarElemento("textarea", "resultadoText resultadoTextoNormal");
                    const divBtn = criarElemento("div", "resultadoBtnDiv");
                    const copiarBtn = criarElemento("button", "resultadoBtn btnCopiar " + identificador);
                    const toggleBtn = criarElemento("button", "resultadoBtn btnSomar " + identificador);
                    const deletarBtn = criarElemento("button", "resultadoBtn btnRemover " + identificador);
    
                    resultadoText.innerHTML = 
                    "Resultado: " + mascaraDoisDigitos(resultados[i].result.diffHours) + "h " + mascaraDoisDigitos(resultados[i].result.diffMinutes) + "m" + "\n" +
                    "-----------------------------------" + "\n" +
                    resultados[i].input.startHour + " - Hora Inicial" + "\n" +
                    resultados[i].input.finalHour + " - Hora Final";
                    copiarBtn.innerHTML = "Copiar";
                    toggleBtn.innerHTML = "Somar";
                    deletarBtn.innerHTML = "Remover";
    
                    // Append ao html principal:
                    resultadoDiv.append(resultadoText);
                    divBtn.append(copiarBtn, toggleBtn, deletarBtn);
                    resultadoDiv.append(divBtn);
                    contornoDiv.append(resultadoDiv);
                    $(".resultado").append(contornoDiv);
                }
                // Apenas exibe a div principal dos resultados;
                mostrarElementosHTML();
            } else {
                // Caso não haja resultados a serem exibidos, a div volta a ser invisível.
                // Necessário caso exista um único resultado e ele seja removido.
                esconderElementosHTML();
            }
        }

        function efeitoNovoResultado() {
            let ultimaEntrada = ".resultado" + mascaraDoisDigitos((arquivoResultados.length - 1));

            $(ultimaEntrada).parents(".resultadoContainer").removeClass("resultadoNormal").addClass("resultadoNovo");
            setTimeout(function () {
                $(ultimaEntrada).parents(".resultadoContainer").removeClass("resultadoNovo").addClass("resultadoNormal");
            }, 1000);
        }

        function atribuirFuncaoBotoes() {
            efeitoMouseHoverBotao(".btnRemover", ".resultadoContainer", "resultadoExcluir", "resultadoNormal");
            efeitoMouseHoverBotao(".btnSomar", ".resultadoContainer", "resultadoSomar", "resultadoNormal");
            efeitoMouseHoverBotao(".btnCopiar", ".resultadoText", "resultadoTextoCopiar", "resultadoTextoNormal");
            copiarCalculo(".btnCopiar");
            //somarCalculo(".btnSomar");
            removerCalculo(".btnRemover");
        }

        function copiarCalculo(botao) {
            $(botao).click(function() {
                var $textarea = $(this).parent().parent().children(".resultadoText");
                $textarea.select();
                document.execCommand("copy");
                chamarPopUp("sucesso", "Resultado copiado!");
            });
        }

        function removerCalculo(botao) {
            $(botao).click(function() {
                var classes = $(this).attr("class").split(" ");
                var idResultado = classes[(classes.length - 1)];

                for(var i = 0; i < arquivoResultados.length; i++) {
                    if(arquivoResultados[i].id === idResultado) {
                        arquivoResultados.splice(i, 1);
                    }
                }
                chamarPopUp("excluido", "Resultado excluído!");
                // Atualizando os resultados restantes:
                enumerarResultado(arquivoResultados);
                mostrarResultado();
            });
        }

        function efeitoMouseHoverBotao(botao, alvo, estiloHover, estiloNormal) {
            $(botao).mouseover(function() {
                if(estiloNormal.length === 0) {
                    $(this).parents(alvo).addClass(estiloHover);

                } else if(alvo === ".resultadoText") {
                
                } else {
                    $(this).parents(alvo).removeClass(estiloNormal).addClass(estiloHover);
                }

            }).mouseout(function() {
                if(estiloNormal.length === 0) {
                    $(this).parents(alvo).removeClass(estiloNormal);
                } else {
                    $(this).parents(alvo).removeClass(estiloHover).addClass(estiloNormal);
                }
            });


        }

        function estaVazio(valor) {
            if(valor === null) {
                return true;
            }
            return false;
        }

        function limparElementos() {
            $(".contornoDiv").remove();
        }

        function checarSomaResultados(resultados) {
            for(var i = 0; i < arquivoResultados.length; i++) {
                if(arquivoResultados[i].somar) {
                    
                }
            }
        }

        function criarElemento(elementoHtml, classe) {
            let elemento = document.createElement(elementoHtml);    

            if(classe != null) {
                const classes = classe.split(' ')
                classes.forEach((classe) => {
                    elemento.classList.add(classe);
                });
            }
            return elemento;
        }

        function alterarSubtotal(tipo, valor) {
            if(tipo === "entrada") {
                subtotal += valor;
            }
            if(tipo === "saida") {
                subtotal -= valor;
            }
        }
 
        function mascaraDoisDigitos(valor) {
            const parseString = valor.toString();
            
            if(parseString.length === 1) {
                return "0" + parseString;
            } else {
                return parseString;
            }
        }

        function mostrarElementosHTML() {
            $(".resultado").removeClass("invisible");
            window.scroll(0, $(window).height());
        }

        function esconderElementosHTML() {
            $(".resultado").addClass("invisible");
            window.scroll(0, 0);
        }

        function chamarPopUp(tipo, mensagem) {
            if(tipo === "sucesso" || tipo === "falhou" || tipo === "excluido") {
                const popUpContainer = document.createElement("div");
                const novoPopUp = document.createElement("div");
                const identificador = moment().format("HHmmssSSS").toString();

                popUpContainer.classList.add("popup-container");
                popUpContainer.id = identificador;
                novoPopUp.classList.add("popup");
                novoPopUp.classList.add(tipo);
                novoPopUp.innerHTML = mensagem;
                popUpContainer.append(novoPopUp);
                $(".popup-calculo").append(popUpContainer);
                
                // TESTE
                setTimeout(function() {
                    $("#" + identificador).css('-webkit-animation', 'fadeOut 500ms');
                    $("#" + identificador).bind('webkitAnimationEnd', function() {
                        $("#" + identificador).remove();
                    });

                }, 3000);
                
                // Pop-up some da tela em 3 segundos.
                // setTimeout(function () {
                //     $("." + identificador).remove();
                // }, 3000);
            }
        }

        function estaVazio(input) {

            if($(input).val().length === 0) {
                return true;
            } else {
                return false;
            }
        }
    });
});
