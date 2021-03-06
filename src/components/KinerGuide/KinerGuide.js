import React from 'react';
import iNoBounce from '../../utils/inobounce';

import './KinerGuide.css'

class KinerGuide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bodyStyle: document.body.style,//用于临时存放body的样式
            visible: this.props.visible,//是否显示操作指引
            offset: this.props.offset === undefined ? 15 : this.props.offset//有些时候，我们的指引框可能需要比目标区块稍微大一点，指定此偏移量，便可以调整指引框大小
        };
    }

    pageScroll(nextProps) {
        let {
            visible,//是否显示操作指引
            target,//需显示操作指引的目标元素
            guideBox,//页面容器，可对当前页面容器进行位移以便完全显示操作指引
        } = nextProps;

        if (visible && target) {

            //当显示操作指引时将body高度设置为100%并超出隐藏，防止页面滚动
            document.body.style.height = '100%';
            document.body.style.overflow = 'hidden';

            if (guideBox) {
                //多步骤操作指引切换时可能会出现断站的位移，用户体验不佳，故在下一次操作指引开始前先将容器透明度置为0，当切换至下一步骤后再显示
                guideBox.style.opacity = 0;
                //重置页面位置，以便重新计算
                guideBox.style.transform = `translate3d(0,0,0)`;
            }

            //获取带指引区块的react信息，用于定位显示操作指引
            let react = target.getBoundingClientRect();
            //浏览器窗口的一半
            let halfHeightOfWindow = window.innerHeight / 2;
            //目标区块中心点y坐标
            let centerPointYOfTarget = react.top + react.height / 2;

            //当目标区块中心点y坐标大于当前浏览器窗口一半时，需对页面进行位移操作，一遍操作指引能够完全展示
            if (centerPointYOfTarget > halfHeightOfWindow) {
                setTimeout(() => {

                    let y = -Math.abs(halfHeightOfWindow - centerPointYOfTarget);


                    //当元素位移超过页面底部时，固定位移量为页面底部的位移量
                    if (Math.abs(y) >= document.documentElement.offsetHeight - window.innerHeight) {
                        y = -Math.abs(window.innerHeight - react.bottom);
                    }
                    //对页面融进进行位移，并使其透明度变为1使其显示
                    if (guideBox) {
                        guideBox.style.transform = `translate3d(0,${y}px,0)`;
                        guideBox.style.opacity = 1;
                    }

                }, 0);

            } else {
                //若带指引元素无需位移，则直接显示
                if (guideBox) {
                    guideBox.style.opacity = 1;
                }

            }

        } else {
            //若操作指引框无需显示，则重置样式
            document.body.style = this.state.bodyStyle;
            if (guideBox) {
                guideBox.style.transform = `translate3d(0,0,0)`;
                guideBox.style.opacity = 1;
            }
        }
    }

    componentWillReceiveProps(nextProps) {


        let {
            visible,//是否显示操作指引
            offset,//有些时候，我们的指引框可能需要比目标区块稍微大一点，指定此偏移量，便可以调整指引框大小,该属性优先级高于offsetX和offsetY,若指定了offset,则offsetX和offsetY失效
        } = nextProps;
        this.pageScroll(nextProps);

        this.setState({
            visible: visible,
            offset: offset === undefined ? 15 : offset
        });

    }

    componentDidMount() {
        this.pageScroll(this.props);
    }

    render() {
        let {
            target, //需显示操作指引的目标元素
            offset,//有些时候，我们的指引框可能需要比目标区块稍微大一点，指定此偏移量，便可以调整指引框大小,该属性优先级高于offsetX和offsetY,若指定了offset,则offsetX和offsetY失效
            offsetX = 0,//水平偏移量
            offsetY = 0,//垂直偏移量
            guidePosition = 'auto', //指引文案位于目标区块上方还是下方，若为上方则传入'top',若为下方则为'bottom'，若传入'auto',则自动判断指引区块位置，默认为'auto'
            type = 'square'//指引框类型，可选项包括'square'，'circular'，默认为方形'square'，可选择圆形'circular'
        } = this.props;
        let {
            offsetWidth, //页面宽度
            offsetHeight //页面高度
        } = document.documentElement;


        let react;
        if (target && this.state.visible) {
            //在ios中，由于页面回弹和滚动，会导致一些奇怪的显示问题，故采用iNoBounce禁止页面回弹和滚动
            iNoBounce.enable();
            //获取目标元素的react对象
            react = target.getBoundingClientRect();

            //渲染页面指引
            let width = 0, height = 0, borderTop = 0, borderRight = 0, borderBottom = 0, borderLeft = 0, left = 0,
                top = 0;

            if (offset !== undefined) {
                width = react.width + offset;
                height = react.height + offset;

                borderTop = react.top;
                borderLeft = react.left;
                borderRight = offsetWidth - react.right;
                borderBottom = offsetHeight - react.bottom;

                if (offset < 0) {
                    borderLeft += Math.abs(offset);
                    borderRight += Math.abs(offset);
                    borderTop += Math.abs(offset);
                    borderBottom += Math.abs(offset);
                }

                left = react.left - offset / 2 - borderLeft;
                top = react.top - offset / 2 - borderTop;
            } else {


                borderTop = react.top;
                borderLeft = react.left;

                borderRight = offsetWidth - react.right;
                borderBottom = offsetHeight - react.bottom;


                //offsetX
                width = react.width + offsetX;


                if (offsetX < 0) {
                    borderLeft += Math.abs(offsetX);
                    borderRight += Math.abs(offsetX);
                }

                left = react.left - offsetX / 2 - borderLeft;

                //offsetY

                height = react.height + offsetY;

                if (offsetY < 0) {
                    borderTop += Math.abs(offsetY);
                    borderBottom += Math.abs(offsetY);
                }

                top = react.top - offsetY / 2 - borderTop;


            }

            //若为自动选择指引提示面板位置，则根据目标块距离屏幕中心点的位置判断应该显示在上方还是下方
            if (guidePosition === 'auto') {

                if (react.top + react.height / 2 > window.innerHeight / 2) {
                    guidePosition = 'top';
                } else {
                    guidePosition = 'bottom';
                }

            }


            return (<div className="guideModal-container" ref='guideContainer'
                         style={{width: document.documentElement.offsetWidth}}>
                <div className="mask" style={{
                    width: width,
                    height: height,
                    left: left,
                    top: top,
                    borderWidth: `${borderTop}px ${borderRight}px ${borderBottom}px ${borderLeft}px`
                }}>
                    {/*辅助元素，主要的目标是用来生成内圆角*/}
                    <div className={`target ${type}`}>
                    </div>
                </div>
                {/*操作指引提示面板*/}
                <div className="guide-content" style={{
                    left: 0,
                    top: `${guidePosition === 'top' ? react.top - (offset === undefined ? offsetY : offset) / 2 : react.bottom + (offset === undefined ? offsetY : offset) / 2}px`,
                    transform: `${guidePosition === 'top' ? 'translate3d(0,-100%,0)' : 'translate3d(0,0,0)'}`
                }}>
                    {this.props.children}
                </div>
            </div>);
        } else {
            //隐藏操作指引框时恢复页面滚动状态
            iNoBounce.disable();
            return <div></div>
        }
    }
}

export default KinerGuide;
