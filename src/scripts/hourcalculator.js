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
            $(inputId).removeClass("invalid");
            $(inputId).addClass("valid");

        } else if(style === "invalid") {
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

        checarEDestacarCampos();
        chamandoValidacoes();
        
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

        function estaVazio(input) {
            if($(input).val().length === 0) {
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
                        const response = res;
                        registrarResultado(arquivoResultados, response);
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
            var bodyResponse = response;
            var arrayLength = array.length;
            bodyResponse["somar"] = false;

            if(arrayLength === 0) {
                bodyResponse["id"] = mascaraIdResultado(0); 
                array[0] = response;

            } else {
                bodyResponse["id"] = mascaraIdResultado(arrayLength - 1);
                array.push(response);
            }
        }

        function mascaraIdResultado(index) {
            return "resultado" + mascaraDoisDigitos(index);
        }

        function mostrarResultado() {
            // Limpar Elementos (?)
            // Limpa todos os elementos referete à resultados já exibidos,
            // o fato disso ser necessário é que a regra abaixo atualiza
            // todos os index do array de resultados, ordenando-os novamente.
            limparElementos();
            criarMostrarResultados(arquivoResultados);
            atribuirFuncaoBotoes();
            efeitoNovoResultado();
        }

        function criarMostrarResultados(resultados) {
            if(resultados.length > 0) {
                for(let i = 0; i < resultados.length; i++) {
                    const identificador = "resultado" + mascaraDoisDigitos(i.toString());
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
            removerCalculo(".btnRemover");
        }

        function removerCalculo(botao) {
            $(botao).click(function() {
                const classes = $(this).attr("class").split(" ");
                const idResultado = classes[(classes.length - 1)].slice("resultado");

                for(var i = 0; i < arquivoResultados.length; i++) {
                    if(arquivoResultados[i].id === idResultado) {
                        console.log(i);
                        console.log(arquivoResultados[i]);
                        arquivoResultado = arquivoResultados.splice(i, 1);
                    }
                }
                // Atualizando os resultados restantes:
                mostrarResultado();
            });
        }

        function efeitoMouseHoverBotao(botao, alvo, estiloHover, estiloNormal) {
            $(botao).mouseover(function() {
                if(estaVazio(estiloNormal)) {
                    $(this).parents(alvo).addClass(estiloHover);
                } else {
                    $(this).parents(alvo).removeClass(estiloNormal).addClass(estiloHover);
                }

            }).mouseout(function() {
                if(estaVazio(estiloNormal)) {
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

        function somarResultados(resultados) {
            for(var i = 0; i < arquivoResultados.length; i++) {
                if(arquivoResultados[i].somar) {
                    subtotal += arquivoResultados[i];
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
