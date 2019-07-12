/**
 * 这个方法可以让指定目标元素根据滚轮操作来移动位置。其移动的方式是步进式的，可以通过三个可选参数来调整手感。
 * 
 * 注意：动画请在css中添加transition属性进行插值。
 * @param {HTMLElement} targetElement 目标元素
 * @param {Number} decisionCoefficient 判定严格度
 * @param {String} displacementUnit 位移单位
 * @param {Number} perDisplacement 位移路程
 * @author 军喵
 */
function moveStepByStep(targetElement, decisionCoefficient = 60, displacementUnit = "px", perDisplacement = 100) {
    let wheelCount = 0;
    let wheelDeraction = '';
    let scrollingFlag = false;
    let changeCount = 0;
    document.querySelector('html').addEventListener("wheel", getWheelDeraction);
    document.querySelector(targetElement).addEventListener("transitionend", () => {
        scrollingFlag = false;
        //wheelCount = null;
    })
    function getWheelDeraction(event) {
        event.deltaY < 0 ? wheelDeraction = 'up' : wheelDeraction = 'down';
        getWheelCount();
        //console.log("event.deltaY："+event.deltaY);
        //console.log("wheelDeraction："+wheelDeraction);
    }
    function getWheelCount() {
        wheelCount = wheelCount + parseInt(event.deltaY);
        if (Math.abs(wheelCount) > decisionCoefficient && scrollingFlag === false) {
            wheelCount = null;
            scrollPage();
            scrollingFlag = true;
        }
        wheelCount = null;
        //console.log("wheelCount："+wheelCount);
    }
    function scrollPage() {
        if (wheelDeraction == "down") {
            changeCount = changeCount - perDisplacement; //用trasfrom要改变这里的正负(原本是+)
            document.querySelector(targetElement).style.transform = "translateY(" + changeCount + displacementUnit + ")";
        } else if (wheelDeraction == 'up') {
            changeCount = changeCount + perDisplacement;
            document.querySelector(targetElement).style.transform = "translateY(" + changeCount + displacementUnit + ")";
        }
        //console.log(changeCount);
        //console.log(scrollingFlag);
    }
}
moveStepByStep("#container");