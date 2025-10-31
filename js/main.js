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
        },
        values: {
            messageA_Opacity: [0, 1]
        }
       },
       {
        type: 'normal',
        heightNum: 5,
        scrollHeight: 0,
        objs: {
            container: document.querySelector("#scroll-sec-1"),
        }
       },
       {
        type: 'sticky',
        heightNum: 5, 
        scrollHeight: 0,
        objs: {
            container: document.querySelector("#scroll-sec-2"),
        }
       },
       {
        type: 'sticky',
        heightNum: 5,
        scrollHeight: 0,
        objs: {
            container: document.querySelector("#scroll-sec-3"),
        }
       } 
    ];

    function setLayout() {
        // 각 스크롤 섹션 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++){
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
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
    }

    function calcValues(values, currentYOffset) {
        let returnV;
        // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;

        returnV = scrollRatio * (values[1] - values[0]) + values[0];

        console.log(returnV);

        return returnV;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;

        switch (currentScene) {
            case 0:
                // console.log('0 play');
                let messageA_Opacity_in = calcValues(values.messageA_Opacity, currentYOffset)
                objs.messageA.style.opacity = messageA_Opacity_in;

                break;
            case 1:
                // console.log('1 play');
                break;
            case 2:
                // console.log('2 play');
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
    window.addEventListener('load', setLayout);
    window.addEventListener('resize', setLayout);
    
    setLayout();
})();