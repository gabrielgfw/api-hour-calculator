$(document).ready(() => {
    // Variáveis globais:
    const HOST_NAME = "http://localhost:9999";
    const PATH = "/api/calc/";
    var arquivoResultados = [];

    inicializarBotoes();
    inicializarValidacaoCampos();

    
    function inicializarBotoes() {
        // Botão Alterar Datas.
        $("#btnAlterarDatas").click(() => {
            $("#dataIni").val(moment().format("yyyy-MM-DD"));
            $("#dataFim").val(moment().format("yyyy-MM-DD"));
            validacaoDatas("#dataIni");
            validacaoDatas("#dataFim");
            moverPagina(".titulo");
            chamarPopUp("sucesso", "Datas atualizadas.");
        });

        // Botão Limpar.
        $("#opcaolimpar").click(() => {
            chamarConfirmBox("limpar", "Deseja resetar a página?");
        });

        // Botão Info.
        $("#opcaoinfo").click(() => {
            // em breve.
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

    function moverPagina(alvo) {
        window.scroll(0, $(alvo).offset().top);
    }

    function chamarPopUp(tipo, mensagem) {
        if (tipo === "sucesso" 
         || tipo === "falhou" 
         || tipo === "excluido"
         || tipo === "adicionadoSoma" 
         || tipo === "removidoSoma") {

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
        }
    }

    function chamarConfirmBox(tipo, mensagem) {
        const divConfirmBox = criarElemento("div", "confirmBox centered");
        const containerConfirmBox = criarElemento("div", "confirmBoxContainer");
        const divTextContainer = criarElemento("div", "textContainer");
        const textarea = criarElemento("textarea", "textConfirmBox");
        const divButtonContainer = criarElemento("div", "buttonContainer");
        const btnConfirmBox = criarElemento("div");
        const btnCancelBox = criarElemento("div");
        const btnConfirm = criarElemento("button", "confirmBtn");
        const btnCancel = criarElemento("button", "cancelBtn");

        textarea.innerHTML = mensagem;
        btnConfirm.innerHTML = "Confirmar";
        btnCancel.innerHTML = "Cancelar";
        
        divTextContainer.append(textarea);
        containerConfirmBox.append(divTextContainer);
        btnConfirmBox.append(btnConfirm);
        btnCancelBox.append(btnCancel);
        divButtonContainer.append(btnConfirmBox, btnCancelBox);
        containerConfirmBox.append(divButtonContainer);
        divConfirmBox.append(containerConfirmBox);
        $(divConfirmBox).insertAfter(".popup-calculo").removeClass("invisible");
        $(".confirmBox .textConfirmBox").prop("readonly", true);
        congelarPagina(true);

        $(".confirmBox .confirmBtn").click(function() {
            $(".confirmBox").remove();
            $(".confirm").addClass("invisible");
            // Tipo de confirm box:
            // Configurar aqui as possibilidades de ações do Confirm Box.
            // Neste caso está recebendo um array, que repassa os valores
            // a serem invertidos, mas poderia simplesmente ser uma string
            // para outra determinada ação.
            if(tipo[0] === "inverterValores") {
                inverterValores(tipo[1], tipo[2]);

            } else if(tipo === "limpar") {
                resetarPagina();
            }

            congelarPagina(false);
        });
        $(".confirmBox .cancelBtn").click(function() {
            $(".confirmBox").remove();
            $(".confirm").addClass("invisible");

            congelarPagina(false);
        });
    }

    function congelarPagina(boolean) {
        if(boolean) {
            $(".cabecalho, .labelsInputs, .resultado, .divBotoes").addClass("congelar")
        } else {
            $(".cabecalho, .labelsInputs, .resultado, .divBotoes").removeClass("congelar");
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

    function inverterValores(primeiro, segundo) {
        const aux = $(primeiro).val();
        $(primeiro).val($(segundo).val()).change();
        $(segundo).val(aux).change();
        chamarPopUp("sucesso", "Valores foram invertidos.");
        moverPagina(".titulo");
    }

    function resetarPagina() {
        document.location.reload();
    }

    /*
      Botão Calcular:
         Preparar a requisição;
         Chamar a API de cálculo;
         Montar elementos e apresentar na página;
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
                chamarPopUp("falhou", "Verifique os campos.");
                moverPagina(".titulo");

            } else if(dataInvertida()) {
                chamarConfirmBox(["inverterValores", "#dataIni", "#dataFim"], "A data inicial informada é maior que a data final, deseja inverter?");

            } else if(horarioInvertido()) {
                chamarConfirmBox(["inverterValores", "#horaIni", "#horaFim"], "Horário inicial é menor que o horário final, deseja inverter os horários?");
           
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
                        chamarPopUp("sucesso", "Cálculo realizado.");
                },

                error: (error) => {
                    alert("Erro ao tentar realizar o cálculo.");
                    chamarPopUp("falhou", "Requisição com o servidor falhou.");
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
            checarSomaResultado(arquivoResultados);
        }

        function criarMostrarResultados(resultados) {
            if(resultados.length > 0) {
                for(let i = 0; i < resultados.length; i++) {
                    const identificador = resultados[i].id;
                    const contornoDiv = criarElemento("div", "contornoDiv");                
                    const resultadoText = criarElemento("textarea", "resultadoText resultadoTextoNormal");
                    const divBtn = criarElemento("div", "resultadoBtnDiv");
                    const copiarBtn = criarElemento("button", "resultadoBtn btnCopiar " + identificador);
                    const deletarBtn = criarElemento("button", "resultadoBtn btnRemover " + identificador);
                    const somarBtn = criarElemento("button", "resultadoBtn btnSomar " + identificador);
                    const resultadoDiv = criarElemento("div", "resultadoContainer resultadoNormal");

                    resultadoText.innerHTML = 
                    "Resultado: " + mascaraDoisDigitos(resultados[i].result.diffHours) + "h " + mascaraDoisDigitos(resultados[i].result.diffMinutes) + "m" + "\n" +
                    "-----------------------------------" + "\n" +
                    resultados[i].input.startHour + " - Hora Inicial" + "\n" +
                    resultados[i].input.finalHour + " - Hora Final";
                    copiarBtn.innerHTML = "Copiar";
                    somarBtn.innerHTML = !resultados[i].somar ?  "Somar" : "Parar Soma";
                    deletarBtn.innerHTML = "Remover";
    
                    // Append ao html principal:
                    resultadoDiv.append(resultadoText);
                    divBtn.append(copiarBtn, somarBtn, deletarBtn);
                    resultadoDiv.append(divBtn);
                    contornoDiv.append(resultadoDiv);
                    $(".resultado").append(contornoDiv);
                    $(".resultado textarea").prop("readonly", true);
                }
                // Apenas exibe a div principal dos resultados;
                mostrarElementosHTML(true);
            } else {
                // Caso não haja resultados a serem exibidos, a div volta a ser invisível.
                // Necessário caso exista um único resultado e ele seja removido.
                mostrarElementosHTML(false);
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
            adicionarEfeitoHoverBotoes();
            copiarCalculo(".btnCopiar", "resultado");
            copiarCalculo("#somadorBtnCopiar", "somador");
            somarCalculo(".btnSomar");
            removerCalculo(".btnRemover");
            copiarTodosResultados("#somadorBtnCopiarTudo");
        }

        function somarCalculo(button) {
            $(button).click(function() {
                const idCalculo = retornarUltimaClasse($(this));

                for(var i = 0; i < arquivoResultados.length; i++) {
                    if(arquivoResultados[i].id === idCalculo) {
                        if(arquivoResultados[i].somar) {
                            arquivoResultados[i].somar = false;
                            $(this).html("Somar");
                            chamarPopUp("removidoSoma", "Soma removida.");
                        } else {
                            arquivoResultados[i].somar = true;
                            $(this).html("Parar Soma");
                            chamarPopUp("adicionadoSoma", "Resultado somado.");
                            moverPagina(".resultado");
                        }
                    }
                }
                checarSomaResultado(arquivoResultados);
            });
        }

        function copiarTodosResultados(button) {    
            if(!$(button).hasClass("atribuido")) {
                $(button).click(function() {
                    // Evitando duplicidade de função no mesmo botão.
                    var todosTextAreas = $(".resultado textarea");
                    var quebraLinha = "\n";
                    var resultadosConcatenados = "";
                    var momentoCopia = "Copiado em - " + moment().format("DD/MM/YYYY - HH:mm:ss");
    
                    for(var i = 0; i < todosTextAreas.length; i++) {
                        resultadosConcatenados += todosTextAreas[i].innerHTML + quebraLinha + quebraLinha + quebraLinha;
                    }
                    resultadosConcatenados += quebraLinha + quebraLinha + momentoCopia;

                    const divTodosResultados = criarElemento("div", "divTodosResultados");
                    const textareaResultados = criarElemento("textarea", "resultadosText");
                    textareaResultados.innerHTML = resultadosConcatenados;
                    divTodosResultados.append(textareaResultados);
                    $(".resultado").append(divTodosResultados);
                    $(".resultado .divTodosResultados textarea").select();
                    document.execCommand("copy");
                    $(".resultado .divTodosResultados").remove();
                    chamarPopUp("sucesso", "Todos resultados copiados.");
                });
            }

            $(button).addClass("atribuido");
        }

        function checarSomaResultado(array) {
            let   somaTotal = 0;
            let qtdCalculos = 0;

            for(let i = 0; i < array.length; i++) {
                if(array[i].somar) {
                    let soma = parseInt(array[i].rawResult.diffInMinutes);
                    somaTotal += soma;
                    qtdCalculos++;
                }
            }

            if(qtdCalculos > 0) {
                let somaHoras;
                let horasFinal;
                let minutosFinal;
                let retornoCalculo;

                somaHoras = somaTotal / 60;
                horasFinal = parseInt(somaHoras);
                minutosFinal = parseFloat((somaHoras - horasFinal)) * 60;

                retornoCalculo = mascaraDoisDigitos(horasFinal) + "h " + mascaraDoisDigitos(minutosFinal.toFixed(0)) + "m";
                alterarSubtotal(retornoCalculo, qtdCalculos);
                toggleExibirTotalizador(true);
            } else {
                toggleExibirTotalizador(false);
            }
        }

        function toggleExibirTotalizador(boolean) {
            if(boolean) {
                $(".totalizador").removeClass("invisible");
            }
            if(!boolean) {
                $(".totalizador").addClass("invisible");
            }
        }

        function adicionarEfeitoHoverBotoes() {
            efeitoMouseHoverBotao(".btnRemover", ".resultadoContainer", "resultadoExcluir", "resultadoNormal");
            efeitoMouseHoverBotao(".btnSomar", ".resultadoContainer", "resultadoSomar", "resultadoNormal");
            efeitoMouseHoverBotao(".btnCopiar", ".resultadoText", "resultadoTextoCopiar", "resultadoTextoNormal");
        }

        function alterarSubtotal(resultado, qtdCalc) {            
            const exibicaoResultado =
            "Soma Total: " + resultado + "\n" +
            "--------------------------" + "\n" +
            mascaraDoisDigitos(qtdCalc) + " selecionado(s)";

            console.log(exibicaoResultado);
            $("#total-geral").html(exibicaoResultado);
        }

        function copiarCalculo(button, tipo) {
            if(tipo === "resultado") {
                $(button).click(function() {
                        var $textarea = $(this).parent().parent().children("textarea");
                        $textarea.select();
                        document.execCommand("copy");
                        chamarPopUp("sucesso", "Resultado copiado.");
                });
            }
            
            if(tipo === "somador" && !$(button).hasClass("atribuido")) {
                $(button).click(function() {
                    var $textarea = $("#total-geral");
                    $textarea.select();
                    document.execCommand("copy");
                    chamarPopUp("sucesso", "Somador copiado.");
                });
                $(button).addClass("atribuido");
            }
        }

        function removerCalculo(button) {
            $(button).click(function() {
                const idResultado = retornarUltimaClasse($(this));

                for(var i = 0; i < arquivoResultados.length; i++) {
                    if(arquivoResultados[i].id === idResultado) {
                        arquivoResultados.splice(i, 1);
                    }
                }
                chamarPopUp("falhou", "Resultado excluído.");
                enumerarResultado(arquivoResultados);
                mostrarResultado();
            });
        }

        function retornarUltimaClasse(elementoThis) {
            const classes = elementoThis.attr("class").split(" ");
            const resultado = classes[(classes.length - 1)];
            return resultado;
        }

        function efeitoMouseHoverBotao(button, alvo, estiloHover, estiloNormal) {
            $(button).mouseover(function() {
                if(estiloNormal.length === 0) {
                    $(this).parents(alvo).addClass(estiloHover);
                } else if(alvo === ".resultadoText") {
                    $(this).parent().parent().children(alvo).removeClass(estiloNormal).addClass(estiloHover);
                } else {
                    $(this).parents(alvo).removeClass(estiloNormal).addClass(estiloHover);
                }

            }).mouseout(function() {
                if(estiloNormal.length === 0) {
                    $(this).parents(alvo).removeClass(estiloNormal);
                } else if(alvo === ".resultadoText") {
                    $(this).parent().parent().children(alvo).removeClass(estiloHover).addClass(estiloNormal);
                } else {
                    $(this).parents(alvo).removeClass(estiloHover).addClass(estiloNormal);
                }
            });
        }

        function limparElementos() {
            $(".contornoDiv").remove();
        }        
 
        function mascaraDoisDigitos(valor) {
            const parseString = valor.toString();
            
            if(parseString.length === 1) {
                return "0" + parseString;
            } else {
                return parseString;
            }
        }

        function mostrarElementosHTML(boolean) {
            if(boolean) {
                $(".resultado").removeClass("invisible");
                moverPagina(".contornoDiv:last");
                
            } else {
                $(".resultado").addClass("invisible");
                moverPagina(".titulo");
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
