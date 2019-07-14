let stepMove = {
    wheelDirection: '', touchDirection: '', scrollingFlag: false, addFirefox: 1,
    wheelCount: 0, wheelCount1: 0, changeCount: 0, touchCount: 0,
    startX: 0, startY: 0,
    /**
     * 这个方法可以让指定目标元素根据滚轮操作来移动位置。其移动的方式是步进式的，可以通过三个可选参数来调整手感。
     * 
     * 注意：动画请在css中添加transition属性进行插值。
     * @param {HTMLElement} targetElement 目标元素 应写css选择器
     * @param {Number} decisionCoefficient 判定严格度 默认值100 相对值 值越高阻尼越大
     * @param {String} axisDirection 移动轴向 默认Y 可选X
     * @param {Number} perDisplacement 位移路程 默认100 若单位参数不填写则是100px
     * @param {String} displacementUnit 位移单位 默认px 可以改成其他单位
     * @author 军喵
     */
    wheelStepByStep: function (targetElement, decisionCoefficient = 100, axisDirection = "y", perDisplacement = 100, displacementUnit = "px") {
        stepMove.decisionCoefficient = decisionCoefficient;
        stepMove.axisDirection = axisDirection;
        stepMove.perDisplacement = perDisplacement;
        stepMove.displacementUnit = displacementUnit;
        stepMove.targetElement = targetElement;
        if (navigator.userAgent.indexOf('Firefox') > 0) {
            stepMove.addFirefox = 50;
        }
        //TODO 暂停后的续接功能
        document.addEventListener("wheel", stepMove.getWheelDirection);
        document.querySelector(stepMove.targetElement).addEventListener("transitionend", () => {
            stepMove.wheelCount1 = stepMove.wheelCount = null;
            stepMove.scrollingFlag = false;
        });
    },
    /**
     * 获取滚动方向
     */
    getWheelDirection: function (event) {
        let yControll = event.deltaY;
        event.deltaY < 0 ? stepMove.wheelDirection = 'up' : stepMove.wheelDirection = 'down';
        stepMove.wheelCount++;
        stepMove.wheelCount1++;
        stepMove.getWheelCount(yControll);
    },
    /**
     * 获取滚动计数
     */
    getWheelCount: function (yControll) {
        if (stepMove.scrollingFlag == false) {
            yControll = Math.abs(event.deltaY * stepMove.addFirefox);
            //console.log("Count：" + wheelCount + ", Count1：" + wheelCount1 + ", deltaY：" + yControll);
            if (yControll > stepMove.wheelCount || yControll > stepMove.wheelCount - stepMove.wheelCount1 * yControll) {
                // if (navigator.userAgent.indexOf('Firefox') > 0) {
                //     wheelCount += (wheelCount + yControll) / wheelCount1; //同一火狐和chrome手感
                // } else {
                stepMove.wheelCount += (stepMove.wheelCount + yControll) / stepMove.wheelCount1;
                // }
                // console.log("Count：" + wheelCount + ", Count1：" + wheelCount1 + ", deltaY：" + yControll);
                if (Math.abs(stepMove.wheelCount) > stepMove.decisionCoefficient && stepMove.scrollingFlag === false) {
                    // console.log(wheelCount)
                    stepMove.scrollPage();
                }
            } else {
                stepMove.wheelCount1 = stepMove.wheelCount = null;
            }
        }
        //console.log(yControll);
        // console.log(stepMove.decisionCoefficient ==  stepMove.decisionCoefficient)
    },
    /**
     * 滚动指定元素
     */
    scrollPage: function () {
        stepMove.scrollingFlag = true;
        stepMove.wheelCount1 = stepMove.wheelCount = null;
        stepMove.touchCount = null;
        if (stepMove.touchDirection == "up" || stepMove.wheelDirection == "down" && stepMove.targetElement != null) {
            stepMove.changeCount = stepMove.changeCount - stepMove.perDisplacement; //用trasfrom要改变这里的正负(原本是+)
            document.querySelector(stepMove.targetElement).style.transform = "translate" + stepMove.axisDirection.toUpperCase() + "(" + stepMove.changeCount + stepMove.displacementUnit + ")";
        } else if (stepMove.touchDirection == "down" || stepMove.wheelDirection == 'up' && stepMove.targetElement != null) {
            stepMove.changeCount = stepMove.changeCount + stepMove.perDisplacement;
            document.querySelector(stepMove.targetElement).style.transform = "translate" + stepMove.axisDirection.toUpperCase() + "(" + stepMove.changeCount + stepMove.displacementUnit + ")";
        }
        // console.log(stepMove.changeCount);
        //console.log(stepMove.scrollingFlag);
    },
    getTouchStart: () => {
        stepMove.startY = event.targetTouches[0].clientY;
        stepMove.startX = event.targetTouches[0].clientX;
    },
    getTouchDirection: () => {
        let y = stepMove.startY - event.targetTouches[0].clientY;
        y > 0 ? stepMove.touchDirection = 'up' : stepMove.touchDirection = 'down';
        stepMove.touchCount++;
        stepMove.getTouchCount(y);
    },
    touchStepByStep: (targetElement, decisionCoefficient = 100, axisDirection = "y", perDisplacement = 100, displacementUnit = "px") => {
        stepMove.decisionCoefficient = decisionCoefficient;
        stepMove.axisDirection = axisDirection;
        stepMove.perDisplacement = perDisplacement;
        stepMove.displacementUnit = displacementUnit;
        stepMove.targetElement = targetElement;
        //TODO 暂停后的续接功能
        document.addEventListener('touchstart', stepMove.getTouchStart); //获取触点起始位置
        document.addEventListener('touchmove', stepMove.getTouchDirection); //判断移动方向
        document.querySelector(stepMove.targetElement).addEventListener("transitionend", () => {
            stepMove.touchCount = false;
            stepMove.scrollingFlag = false;
        });
    },
    getTouchCount: (y) => {
        // console.log("y:" + y + " Count:" + stepMove.touchCount)
        if (stepMove.scrollingFlag == false) {
            if (Math.abs(y) / stepMove.touchCount > 60 && Math.abs(y) / stepMove.touchCount < 100) {
                if (Math.abs(y) > stepMove.decisionCoefficient && stepMove.scrollingFlag === false) {
                    // document.querySelector('html').style.backgroundColor = "red"
                    stepMove.scrollPage();
                }
            } else {
                stepMove.touchCount = 1;
                // document.querySelector('html').style.backgroundColor = ""
            }
        }
    },
    /**
     * 可以让滚动失效
     */
    stop: function () {
        document.removeEventListener('wheel', stepMove.getWheelDirection);
        document.removeEventListener('touchstart', stepMove.getTouchStart);
        document.removeEventListener('touchmove', stepMove.getTouchDirection);
    },
    /**
     * 可以让滚动生效
     */
    start: function () {
        document.addEventListener('wheel', stepMove.getWheelDirection);
        document.addEventListener('touchstart', stepMove.getTouchStart);
        document.addEventListener('touchmove', stepMove.getTouchDirection);
    },
}

stepMove.wheelStepByStep("#container", 100, "y", 200, "px");
stepMove.touchStepByStep("#container", 100, "y", 200, "px");
// stepMove.wheelStepByStep("#second", 100, "y", 200, "px");

//事件测试
// document.ontouchstart = () =>{
//     console.log('touch start!')
// }
// document.onpointerdown = () =>{
//     console.log('point start!')
// }
// document.ondrag = () =>{
//     console.log('drag start!')
// }
// document.onscroll = () =>{
//     console.log('scroll!')
// }
// document.onmousedown = () =>{
//     console.log('mouse!')
// }
// document.oninput = () =>{
//     console.log('input!')
// }
