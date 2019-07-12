/**
 * 这个方法可以让指定目标元素根据滚轮操作来移动位置。其移动的方式是步进式的，可以通过三个可选参数来调整手感。
 * 
 * 注意：动画请在css中添加transition属性进行插值。
 * @param {HTMLElement} targetElement 目标元素
 * @param {Number} decisionCoefficient 判定严格度
 * @param {String} axisDirection 移动轴向
 * @param {Number} perDisplacement 位移路程
 * @param {String} displacementUnit 位移单位
 * @author 军喵
 */
function moveStepByStep(targetElement, decisionCoefficient = 60, axisDirection = "y", perDisplacement = 100, displacementUnit = "px") {
    let wheelCount = 0;
    let wheelDirection = '';
    let scrollingFlag = false;
    let changeCount = 0;
    document.querySelector('html').addEventListener("wheel", getWheelDirection);
    document.querySelector(targetElement).addEventListener("transitionend", () => {
        wheelCount = null;
        scrollingFlag = false;
    });
    function getWheelDirection(event) {
        let yControll = event.deltaY;
        event.deltaY < 0 ? wheelDirection = 'up' : wheelDirection = 'down';
        getWheelCount(yControll);
        //console.log("event.deltaY："+event.deltaY);
        //console.log("wheelDirection："+wheelDirection);
    }
    function getWheelCount(yControll) {
        yControll = null;
        if (scrollingFlag == false) {
            yControll = event.deltaY;
            //wheelCount = wheelCount + parseInt(event.deltaY);
            wheelCount++;
            wheelCount += parseInt((wheelCount + parseInt(yControll)) * 0.25 + 3); //同一火狐和chrome手感
        }
        //console.log(wheelCount)
        if (Math.abs(wheelCount) > decisionCoefficient && scrollingFlag === false) {
            scrollPage();
        }
        //console.log("wheelCount："+wheelCount);
    }
    function scrollPage() {
        scrollingFlag = true;
        wheelCount = null;
        if (wheelDirection == "down") {
            changeCount = changeCount - perDisplacement; //用trasfrom要改变这里的正负(原本是+)
            document.querySelector(targetElement).style.transform = "translate" + axisDirection.toUpperCase() + "(" + changeCount + displacementUnit + ")";
        } else if (wheelDirection == 'up') {
            changeCount = changeCount + perDisplacement;
            document.querySelector(targetElement).style.transform = "translate" + axisDirection.toUpperCase() + "(" + changeCount + displacementUnit + ")";
        }
        //console.log(changeCount);
        //console.log(scrollingFlag);
    }
}
moveStepByStep("#container", 60, "y", 200, "px");


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
