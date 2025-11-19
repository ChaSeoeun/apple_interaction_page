(()=> {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
	let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고 있는) 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작되는 순간 true

    const sceneInfo = [
       {
        type: 'sticky',
        heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
        scrollHeight: 0,
        objs: {
            container: document.querySelector("#scroll-sec-0"),
            messageA: document.querySelector('#scroll-sec-0 .main-message.message1'),
            messageB: document.querySelector('#scroll-sec-0 .main-message.message2'),
            messageC: document.querySelector('#scroll-sec-0 .main-message.message3'),
            messageD: document.querySelector('#scroll-sec-0 .main-message.message4'),
            canvas: document.querySelector('#video-canvas-0'),
            context: document.querySelector('#video-canvas-0').getContext('2d'),
            videoImages: []
        },
        values: {
            videoImageCount: 479,
            imageSequence: [1, 479],
            canvas_opacity: [1, 0, { start: 0.9, end: 1}],
            messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
            messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
            messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
            messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],

            messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
            messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
            messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
            messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],

            messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
            messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
            messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
            messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],

            messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
            messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
            messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
            messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
        }
       },
       {
        type: 'normal',
        // heightNum: 5,
        scrollHeight: 0,
        objs: {
            container: document.querySelector("#scroll-sec-1"),
            content: document.querySelector('#scroll-sec-1 .description')
        }
       },
       {
        type: 'sticky',
        heightNum: 5, 
        scrollHeight: 0,
        objs: {
            container: document.querySelector('#scroll-sec-2'),
            messageA: document.querySelector('#scroll-sec-2 .message1'),
            messageB: document.querySelector('#scroll-sec-2 .message2'),
            messageC: document.querySelector('#scroll-sec-2 .message3'),
            pinB: document.querySelector('#scroll-sec-2 .message2 .pin'),
            pinC: document.querySelector('#scroll-sec-2 .message3 .pin'),
            canvas: document.querySelector('#video-canvas-1'),
            context: document.querySelector('#video-canvas-1').getContext('2d'),
            videoImages: []
        },
        values: {
            videoImageCount: 299,
            imageSequence: [1, 299],
            canvas_opacity: [1, 0, { start: 0.9, end: 1}],
            messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
            messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
            messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
            messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],

            messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
            messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
            messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
            messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],

            messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
            messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
            messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
            messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],

            pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
            pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
            pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],

            pinC_width: [0, 100, { start: 0.72, end: 0.77 }],
            pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
            pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
            pinC_translateX_in: [-50, 0, { start: 0.72, end: 0.77 }],
            pinC_translateX_out: [0, 50, { start: 0.85, end: 0.9 }]
        }
       },
       {
        type: 'sticky',
        heightNum: 5,
        scrollHeight: 0,
        objs: {
            container: document.querySelector("#scroll-sec-3"),
            canvasCaption: document.querySelector('.canvas-caption')
        }
       } 
    ];

    function setCanvasImages(){
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./video/img/003/frame_${String(i + 1).padStart(6, '0')}.jpg`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }

        let imgElem2;
        for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image();
            imgElem2.src = `./video/img/002/frame_${String(i + 1).padStart(6, '0')}.jpg`;
            sceneInfo[2].objs.videoImages.push(imgElem2);
        }
    }

    function setLayout() {
        // 각 스크롤 섹션 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++){

            if(sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if(sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
                sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for(let i = 0; i < sceneInfo.length; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset){
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

        const heightRatio = window.innerHeight / 1080;
        // sceneInfo[0].objs.canvas.style.transform = `scale(${heightRatio})`;
        sceneInfo[0].objs.canvas.style.transform = `scale(1)`;
        sceneInfo[2].objs.canvas.style.transform = `scale(1)`;
    }

    function calcValues(values, currentYOffset) {
        let returnV;
        // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight
        let scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
                returnV = ( currentYOffset - partScrollStart ) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if(currentYOffset < partScrollStart) {
                returnV = values[0]
            } else if(currentYOffset > partScrollEnd) {
                returnV = values [1]
            }

        } else {
            returnV = scrollRatio * (values[1] - values[0]) + values[0];
        }

        return returnV;
    }

    function setInitialValues() {
        if (sceneInfo[2] && sceneInfo[2].objs) {
            const objs2 = sceneInfo[2].objs;
            if (objs2.messageA) {
                objs2.messageA.style.opacity = '0';
            }
            if (objs2.messageB) {
                objs2.messageB.style.opacity = '0';
            }
            if (objs2.messageC) {
                objs2.messageC.style.opacity = '0';
            }
            if (objs2.pinB) {
                objs2.pinB.style.opacity = '0';
            }
            if (objs2.pinC) {
                objs2.pinC.style.opacity = '0';
            }
            
            if (objs2.canvas && objs2.context) {
                objs2.context.clearRect(0, 0, objs2.canvas.width, objs2.canvas.height);
                objs2.canvas.style.opacity = '0';
            }
        }
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio =  currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                // console.log('0 play');

                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.clearRect(0, 0, objs.canvas.width, objs.canvas.height);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                
                // 모바일에서 이미지 위치 조정 (오른쪽이 잘리지 않도록)
                const canvasWidth = objs.canvas.width; // 1920
                const canvasHeight = objs.canvas.height; // 1080
                const windowWidth = window.innerWidth;
                
                if (windowWidth < 820 && objs.videoImages[sequence] && objs.videoImages[sequence].complete) {
                    // 모바일
                    const img = objs.videoImages[sequence];
                    const imageWidth = img.naturalWidth || img.width || canvasWidth;
                    const imageHeight = img.naturalHeight || img.height || canvasHeight;
                    
                    const imageAspectRatio = imageWidth / imageHeight;
                    const canvasAspectRatio = canvasWidth / canvasHeight;
                    
                    if (canvasAspectRatio < imageAspectRatio) {
                        const sourceWidth = imageHeight * canvasAspectRatio;
                        const sourceX = imageWidth - sourceWidth;
                        
                        objs.context.drawImage(
                            img,
                            sourceX, 0, sourceWidth, imageHeight,
                            0, 0, canvasWidth, canvasHeight 
                        );
                    } else {
                        // 이미지 중앙 정렬
                        const drawWidth = canvasHeight * imageAspectRatio;
                        const drawX = (canvasWidth - drawWidth) / 2;
                        
                        objs.context.drawImage(
                            img,
                            0, 0, imageWidth, imageHeight,
                            drawX, 0, drawWidth, canvasHeight
                        );
                    }
                } else if (objs.videoImages[sequence]) {
                    // PC
                    objs.context.drawImage(objs.videoImages[sequence], 0, 0, canvasWidth, canvasHeight);
                }

                // const messageA_Opacity_in = calcValues(values.messageA_Opacity_in, currentYOffset);
                // const messageA_Opacity_out = calcValues(values.messageA_Opacity_out, currentYOffset);
                // const messageA_translateY_in = calcValues(values.messageA_translateY_in, currentYOffset);
                // const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);

                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }

                break;
            case 1:
                // console.log('1 play');
                break;
            case 2:
                let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.clearRect(0, 0, objs.canvas.width, objs.canvas.height);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                
                // 모바일에서 이미지 위치 조정 (오른쪽이 잘리지 않도록)
                const canvasWidth2 = objs.canvas.width; // 1920
                const canvasHeight2 = objs.canvas.height; // 1080
                const windowWidth2 = window.innerWidth;
                
                if (windowWidth2 < 820 && objs.videoImages[sequence2] && objs.videoImages[sequence2].complete) {
                    // 모바일
                    const img = objs.videoImages[sequence2];
                    const imageWidth = img.naturalWidth || img.width || canvasWidth2;
                    const imageHeight = img.naturalHeight || img.height || canvasHeight2;
                    
                    const imageAspectRatio = imageWidth / imageHeight;
                    const canvasAspectRatio = canvasWidth2 / canvasHeight2;
                    
                    if (canvasAspectRatio < imageAspectRatio) {
                        const sourceWidth = imageHeight * canvasAspectRatio;
                        const sourceX = imageWidth - sourceWidth;
                        
                        objs.context.drawImage(
                            img,
                            sourceX, 0, sourceWidth, imageHeight,
                            0, 0, canvasWidth2, canvasHeight2 
                        );
                    } else {
                        // 이미지 중앙 정렬
                        const drawWidth = canvasHeight2 * imageAspectRatio;
                        const drawX = (canvasWidth2 - drawWidth) / 2;
                        
                        objs.context.drawImage(
                            img,
                            0, 0, imageWidth, imageHeight,
                            drawX, 0, drawWidth, canvasHeight2
                        );
                    }
                } else if (objs.videoImages[sequence2]) {
                    // PC
                    objs.context.drawImage(objs.videoImages[sequence2], 0, 0, canvasWidth2, canvasHeight2);
                }

                
                if (scrollRatio <= 0.25) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.57) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                    objs.pinB.style.opacity = calcValues(values.pinB_opacity_in, currentYOffset);
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                    objs.pinB.style.opacity = calcValues(values.pinB_opacity_out, currentYOffset);
                }
    
                if (scrollRatio <= 0.83) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `translate3d(${calcValues(values.pinC_translateX_in, currentYOffset)}px, 0, 0)`;
                    objs.pinC.style.width = `${calcValues(values.pinC_width, currentYOffset)}px`;
                    objs.pinC.style.height = `1px`;
                    objs.pinC.style.transformOrigin = `left center`;
                    objs.pinC.style.opacity = calcValues(values.pinC_opacity_in, currentYOffset);
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `translate3d(${calcValues(values.pinC_translateX_out, currentYOffset)}px, 0, 0)`;
                    objs.pinC.style.width = `${calcValues(values.pinC_width, currentYOffset)}px`;
                    objs.pinC.style.height = `1px`;
                    objs.pinC.style.transformOrigin = `left center`;
                    objs.pinC.style.opacity = calcValues(values.pinC_opacity_out, currentYOffset);
                }
    
                break;
            case 3:
                // console.log('3 play');
                break;
        }

    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
            return;
        }

        if (yOffset < prevScrollHeight){
            enterNewScene = true;
            if(currentScene === 0) return; // 브라우저 바운스 효과로 마이너스 처리 방지(mo)
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
            return;
        }

        playAnimation();
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    // window.addEventListener('DOMContentLoaded', setLayout);
    window.addEventListener('load', () =>{
        if (sceneInfo[0].objs.videoImages[0] && sceneInfo[0].objs.videoImages[0].complete) {
            sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
        }
        scrollLoop(); 
    });
    window.addEventListener('resize', setLayout);
    
    
    setLayout();
    setCanvasImages();
    setInitialValues();
    scrollLoop(); 
})();