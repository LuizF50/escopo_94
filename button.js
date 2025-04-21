/**
 * Animação do botão com efeito "Goo" 
 * Versão atualizada para GSAP 3
 */
document.addEventListener('DOMContentLoaded', function () {
    $('.button--bubble').each(function () {
        const $button = $(this);
        const $container = $button.closest('.button--bubble__container');
        const $circlesTopLeft = $container.find('.circle.top-left');
        const $circlesBottomRight = $container.find('.circle.bottom-right');
        const $effectButton = $container.find('.effect-button');

        if ($circlesTopLeft.length === 0 || $circlesBottomRight.length === 0) return;

        // Configuração inicial
        gsap.set([$circlesTopLeft, $circlesBottomRight], {
            x: 0,
            y: 0,
            transformOrigin: "50% 50%"
        });

        // Animação para os círculos do canto superior esquerdo
        const tlTopLeft = gsap.timeline({ paused: true })
            .to($circlesTopLeft, {
                duration: 1.2,
                x: -25,
                y: -25,
                scaleY: 2,
                ease: "slow(0.1, 0.7, false)"
            })
            .to($circlesTopLeft.eq(0), {
                duration: 0.1,
                scale: 0.2,
                x: "+=6",
                y: "-=2"
            }, 0)
            .to($circlesTopLeft.eq(1), {
                duration: 0.1,
                scaleX: 1,
                scaleY: 0.8,
                x: "-=10",
                y: "-=7"
            }, "-=0.1")
            .to($circlesTopLeft.eq(2), {
                duration: 0.1,
                scale: 0.2,
                x: "-=15",
                y: "+=6"
            }, "-=0.1")
            .to($circlesTopLeft.eq(0), {
                duration: 1,
                scale: 0,
                x: "-=5",
                y: "-=15",
                opacity: 0
            })
            .to($circlesTopLeft.eq(1), {
                duration: 1,
                scaleX: 0.4,
                scaleY: 0.4,
                x: "-=10",
                y: "-=10",
                opacity: 0
            }, "-=1")
            .to($circlesTopLeft.eq(2), {
                duration: 1,
                scale: 0,
                x: "-=15",
                y: "+=5",
                opacity: 0
            }, "-=1");

        // Animação para os círculos do canto inferior direito
        const tlBottomRight = gsap.timeline({ paused: true })
            .to($circlesBottomRight, {
                duration: 1.1,
                x: 30,
                y: 30,
                ease: "slow(0.1, 0.7, false)"
            })
            .to($circlesBottomRight.eq(0), {
                duration: 0.1,
                scale: 0.2,
                x: "-=6",
                y: "+=3"
            })
            .to($circlesBottomRight.eq(1), {
                duration: 0.1,
                scale: 0.8,
                x: "+=7",
                y: "+=3"
            }, "-=0.1")
            .to($circlesBottomRight.eq(2), {
                duration: 0.1,
                scale: 0.2,
                x: "+=15",
                y: "-=6"
            }, "-=0.2")
            .to($circlesBottomRight.eq(0), {
                duration: 1,
                scale: 0,
                x: "+=5",
                y: "+=15",
                opacity: 0
            })
            .to($circlesBottomRight.eq(1), {
                duration: 1,
                scale: 0.4,
                x: "+=10",
                y: "+=10",
                opacity: 0
            });

        // Timeline principal combinada
        const mainTimeline = gsap.timeline({ paused: true })
            .add(tlTopLeft)
            .to($effectButton, {
                duration: 0.8,
                scaleY: 1.1
            }, 0.1)
            .add(tlBottomRight, 0.2)
            .to($effectButton, {
                duration: 1.8,
                scale: 1,
                ease: "elastic.out(1.2, 0.4)"
            }, 1.2)
            .timeScale(2.6);

        // Evento de hover
        $button.on('mouseenter', function () {
            mainTimeline.restart();
        });
    });
});