import React from 'react';
import iNoBounce from '../../utils/inobounce';

import './KinerGuide.css'

class KinerGuide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bodyStyle: document.body.style,
            visible: this.props.visible,
            guidePosition: this.props.guidePosition,//指引文案位于目标区块上方还是下方，若为上方则传入'top',若为下方则为'bottom'
            offset: this.props.offset === undefined ? 15 : this.props.offset//有些时候，我们的指引框可能需要比目标区块稍微大一点，指定此偏移量，便可以调整指引框大小
        };
    }

    componentWillReceiveProps(nextProps) {
        let target = nextProps.target;
        if (nextProps.visible && target) {

            document.body.style.height = '100%';
            document.body.style.overflow = 'hidden';

            nextProps.guideBox.style.opacity = 0;
            nextProps.guideBox.style.transform = `translate3d(0,0,0)`;

            let react = target.getBoundingClientRect();



            let halfHeightOfWindow = window.innerHeight / 2;
            let centerPointYOfTarget = react.top + react.height / 2;


            if (centerPointYOfTarget > halfHeightOfWindow) {
                setTimeout( () => {

                    let y = -Math.abs(halfHeightOfWindow - centerPointYOfTarget);


                    if (Math.abs(y) >= document.documentElement.offsetHeight - window.innerHeight) {
                        y = -(document.documentElement.offsetHeight - window.innerHeight);
                    }



                    nextProps.guideBox.style.transform = `translate3d(0,${y}px,0)`;
                    nextProps.guideBox.style.opacity = 1;

                }, 0);

            }else{
                nextProps.guideBox.style.opacity = 1;
            }

        } else {
            document.body.style = this.state.bodyStyle;
            nextProps.guideBox.style.transform = `translate3d(0,0,0)`;
            nextProps.guideBox.style.opacity = 1;
        }
        this.setState({
            visible: nextProps.visible,
            guidePosition: nextProps.guidePosition,
            offset: nextProps.offset === undefined ? 15 : nextProps.offset
        });

    }

    componentDidMount() {

    }

    render() {
        let {target, offset, guidePosition, offsetX = 0, offsetY = 0, type='square'} = this.props;
        let {offsetWidth, offsetHeight} = document.documentElement;


        let react;
        if (target && this.state.visible) {
            iNoBounce.enable();
            react = target.getBoundingClientRect();
            let width = 0, height = 0, borderTop = 0, borderRight = 0, borderBottom = 0, borderLeft = 0, left = 0,
                top = 0;

            if (offset !== undefined) {
                width = react.width + offset;
                height = react.height + offset;

                borderTop = react.top;
                borderLeft = react.left;
                borderRight = offsetWidth - borderLeft - react.width;
                borderBottom = offsetHeight - borderTop - react.height;

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

                borderRight = offsetWidth - borderLeft - react.width;
                borderBottom = offsetHeight - borderTop - react.height;


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

            if(guidePosition==='auto'){

                if(react.top+react.height/2>window.innerHeight/2){
                    guidePosition = 'top';
                }else{
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
                    <div className={`target ${type}`}>
                    </div>
                </div>
                <div className="guide-content" style={{
                    left: 0,
                    top: `${guidePosition === 'top' ? react.top - (offset === undefined ? offsetY : offset) / 2 : react.bottom + (offset === undefined ? offsetY : offset) / 2}px`,
                    transform: `${guidePosition === 'top' ? 'translate3d(0,-100%,0)' : 'translate3d(0,0,0)'}`
                }}>
                    {this.props.children}
                </div>
            </div>);
        } else {
            iNoBounce.disable();
            return <div></div>
        }
    }
}

export default KinerGuide;
