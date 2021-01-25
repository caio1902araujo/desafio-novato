function iniciarMudarPessoa(){
    let indexs;
    let itensSlide;
    const container = document.querySelector('[data-container]');
    const slide = document.querySelector('[data-slide]');
    const textos = document.querySelector('[data-textos]');
    const botaoProximo = document.querySelector('[data-botao="proximo"]');
    const botaoAnterior = document.querySelector('[data-botao="anterior"]');
    const distancias = {
        posicaoFinal: 0,
        primeiroToque: 0,
        movimento: 0
    }

    function adicionarTransicao(ativo){
        slide.style.transition = ativo ? 'transform .3s' : '';
    }

    function mapearIndex(index){
        const ultimoItem = slide.children.length - 1;
        indexs = {
            anterior: index ? index - 1 : undefined,
            atual: index,
            proximo: (index === ultimoItem)? undefined : index + 1
        }
    }

    function configurarSlide(){
        itensSlide = [...slide.children].map((elemento)=>{
            const margin = (container.offsetWidth - elemento.offsetWidth) / 2;
            const posicao = -(elemento.offsetLeft - margin);
            return {
                elemento: elemento,
                posicao: posicao
            }
        });
    }

    function mudarBlockquote(index){
        const listaDeTextos = [...textos.children];
        listaDeTextos.forEach((elemento)=> elemento.classList.remove('ativo'));
        listaDeTextos[index].classList.add('ativo');
    }

    function moverImagem(moveX){
        
        distancias.posicaoMovimento = moveX;
        slide.style.transform = `translate3d(${moveX}px, 0, 0)`;
        
    }

    function atualizarPosicao(clientX){
        distancias.movimento = (distancias.primeiroToque - clientX) * 1.5;
        return distancias.posicaoFinal - distancias.movimento;
    }

    function mudarImagem(event){
        const clientX = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const moveX = atualizarPosicao(clientX);
        moverImagem(moveX);
    }

    function iniciarMudarImagem(event){
        let evento;
        if(event.type === 'mousedown'){
            event.preventDefault();
            distancias.primeiroToque = event.clientX;
            evento = 'mousemove';
        }
        else{
            distancias.primeiroToque = event.changedTouches[0].clientX;
            evento = 'touchmove';
        }
        slide.addEventListener(evento, mudarImagem);
        adicionarTransicao(false);
    }

    function passarImagem(index){
        const indexAtivo = itensSlide[index];
        adicionarTransicao(true);
        moverImagem(indexAtivo.posicao);
        mapearIndex(index);
        mudarBlockquote(indexs.atual);
        distancias.posicaoFinal = indexAtivo.posicao;
        
    }

    function ativarSlideProximo(){
        if(indexs.proximo !== undefined) {
            passarImagem(indexs.proximo);
        }
    }

    function ativarSlideAnterior(){
        if(indexs.anterior !== undefined){
            passarImagem(indexs.anterior);
        }
    }

    function mudarSlideFinal(){
        if((distancias.movimento > 50) && (indexs.proximo !== undefined)){
            ativarSlideProximo();
        }else if((distancias.movimento < -50) && (indexs.anterior !== undefined)){
            ativarSlideAnterior();
        }else{
            passarImagem(indexs.atual);
        }
    }

    function finalizarMudarImagem(event){
        const tipoMovimento = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
        slide.removeEventListener(tipoMovimento, mudarImagem);
        distancias.posicaoFinal = distancias.posicaoMovimento;
        mudarSlideFinal();
        adicionarTransicao(true);
    }

    function onResize(){
        setTimeout(()=>{
            configurarSlide();
            passarImagem(indexs.atual);
        }, 300);
    }

    function passarImagemTeclado(event){
        if(event.keyCode === 37) ativarSlideAnterior();
        else if(event.keyCode === 39) ativarSlideProximo();
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('keyup', passarImagemTeclado);
    slide.addEventListener('mousedown', iniciarMudarImagem);
    slide.addEventListener('touchstart', iniciarMudarImagem);
    slide.addEventListener('mouseup', finalizarMudarImagem);
    slide.addEventListener('touchend', finalizarMudarImagem);
    botaoProximo.addEventListener('click', ativarSlideProximo);
    botaoAnterior.addEventListener('click', ativarSlideAnterior);

    mapearIndex(0);
    mudarBlockquote(0);
    configurarSlide();
}

window.addEventListener('load', iniciarMudarPessoa);
