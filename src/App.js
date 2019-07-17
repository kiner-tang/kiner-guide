import React from 'react';
import {List} from 'antd-mobile';
import KinerGuide from './components/KinerGuide/KinerGuide'
import './App.css'

const Item = List.Item;
const Brief = Item.Brief;


class App extends React.Component {

    guideList = [
        {position: 'auto', text: "第一步提示内容", offset: 15},
        {position: 'auto', text: "第二步提示内容", offset: 15},
        {position: 'auto', text: "第三步提示内容", offsetX: -15},
        {position: 'auto', text: "第四步提示内容", offsetX: -15},
        {position: 'auto', text: "第五步提示内容", offset: -15},
        {position: 'auto', text: "第六步提示内容", offsetX: -15},
        {position: 'auto', text: "第七步提示内容", offsetX: -15},
        {position: 'auto', text: "这是头像", offset: 15, type: 'circular'},
        {position: 'auto', text: "最后一步提示内容", offsetX: -15}
    ];

    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            isShowGuide: false,
            guideStep: 0
        };
    }

    componentDidMount() {
        this.setState({
            isShowGuide: true
        });
    }


    render() {

        return (<div className='container' ref='guideBox'>
            <div className="avator-box" style={{width: 'fit-content'}} ref='guideTarget7'>
                <div className="avator">辉</div>
            </div>
            <List renderHeader={() => 'Basic Style'} className="my-list">

                <Item extra={'extra content'}>
                    <div ref='guideTarget0' style={{width: 'fit-content'}}>
                        这是第一步
                    </div>
                </Item>
            </List>
            <List renderHeader={() => 'Subtitle'} className="my-list">
                <Item arrow="horizontal" multipleLine onClick={() => {
                }}>
                    Title <Brief>subtitle</Brief>
                </Item>

                <Item
                    arrow="horizontal"
                    multipleLine
                    onClick={() => {
                    }}
                    platform="android"
                >
                    ListItem （Android）<Brief>There may have water ripple effect of <br/> material if you set the click
                    event.</Brief>
                </Item>

                <Item
                    arrow="horizontal"
                    thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                    multipleLine
                    onClick={() => {
                    }}
                >

                    <div ref='guideTarget1' style={{width: 'fit-content'}}>
                        这是第二步 <Brief>subtitle</Brief>
                    </div>

                </Item>
            </List>

            <List renderHeader={() => 'Customized Right Side（Empty Content / Text / Image）'} className="my-list">
                <Item>Title</Item>
                <Item arrow="horizontal" onClick={() => {
                }}>Title</Item>
                <Item extra="extra content" arrow="horizontal" onClick={() => {
                }}>Title</Item>
                <div ref='guideTarget2' style={{width: '100%'}}>
                    <Item extra="10:30" align="top" thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                          multipleLine>
                        这是第三步 <Brief>的点点滴滴</Brief>
                    </Item>
                </div>

            </List>
            <div ref='guideTarget6' style={{width: '100%'}}>

                <List renderHeader={() => 'Align Vertical Center'} className="my-list">
                    <Item multipleLine extra="extra content">
                        第七步 <Brief>subtitle</Brief>
                    </Item>
                </List>
            </div>
            <List renderHeader={() => 'Icon in the left'}>
                <Item
                    thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                    arrow="horizontal"
                    onClick={() => {
                    }}
                >My wallet</Item>
                <div ref='guideTarget5' style={{width: '100%'}}>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"
                        onClick={() => {
                        }}
                        arrow="horizontal"
                    >
                        第六步
                    </Item>
                </div>
            </List>
            <List renderHeader={() => 'Text Wrapping'} className="my-list">
                <div ref='guideTarget3' style={{width: '100%'}}>
                    <Item data-seed="logId">这是第四步</Item>
                </div>
                <div ref='guideTarget8' style={{width: '100%'}}>
                    <Item wrap>第八步：Multiple line，long text will wrap；Long Text Long Text Long Text Long Text Long Text
                        Long
                        Text</Item>

                </div>
                <Item extra="extra content" multipleLine align="top" wrap>
                    Multiple line and long text will wrap. Long Text Long Text Long Text
                </Item>
                <Item extra="no arrow" arrow="empty" className="spe" wrap>
                    In rare cases, the text of right side will wrap in the single line with long text. long text long
                    text long text
                </Item>


            </List>
            <List renderHeader={() => 'Other'} className="my-list">
                <div ref='guideTarget4' style={{width: '100%'}}>
                    <Item disabled={this.state.disabled} extra="" onClick={() => {
                        console.log('click', this.state.disabled);
                        this.setState({disabled: true});
                    }}>第五步</Item>
                    <Item>
                        <select defaultValue="1">
                            <option value="1">Html select element</option>
                            <option value="2" disabled>Unable to select</option>
                            <option value="3">option 3</option>
                        </select>
                    </Item>
                </div>

            </List>
            <KinerGuide
                visible={this.state.isShowGuide}
                guideBox={this.refs.guideBox}
                target={this.refs[`guideTarget${this.state.guideStep}`]}
                type={this.guideList[this.state.guideStep].type}
                offset={this.guideList[this.state.guideStep].offset}
                offsetX={this.guideList[this.state.guideStep].offsetX}
                offsetY={this.guideList[this.state.guideStep].offsetY}
                guidePosition={this.guideList[this.state.guideStep].position}
            >
                <div className="guide-container">
                    <h1 className="title">{this.guideList[this.state.guideStep].text}</h1>
                    <div className="btn" onClick={e => {
                        if (this.state.guideStep !== this.guideList.length - 1) {
                            let {guideStep} = this.state;
                            this.setState({
                                guideStep: ++guideStep
                            });
                            console.log(guideStep);
                        } else {
                            this.setState({
                                isShowGuide: false
                            });
                        }

                    }}>{this.state.guideStep !== this.guideList.length - 1 ? '下一步' : '知道了'}</div>
                </div>
            </KinerGuide>
        </div>);
    }
}

export default App;