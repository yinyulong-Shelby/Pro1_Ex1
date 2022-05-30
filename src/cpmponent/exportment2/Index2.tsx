import React from "react";
import {Link} from "react-router-dom"
import TargetVue from "./TargetVue"
interface Index2Props{
    theme: any,
    Themes: any
}
interface Index2State{
}
function Index2 (props: Index2Props, state: Index2State){
    let {theme, Themes} = props
    let TargetVueTheme = Themes.TargetVueTheme
    return(
        <div className="Index2" style={{position: "absolute", ...theme}}>
            {/* 转换按钮 */}
            <div style={{float: 'left', width: theme.width, height: 30, marginTop: 5}}>
                <button style={{float: 'left', fontSize: '10px', fontWeight: 600, width: 120, height: 30, marginLeft: 10}}>
                    <Link to="/index1">实验一:MAE折线图</Link>
                </button>
                <button style={{float: 'left', fontSize: '10px', fontWeight: 600, width: 120, height: 30, marginLeft: 10}}>
                    <Link to="/">实验二:Targetvue</Link>
                </button>
            </div>
            <TargetVue theme={TargetVueTheme}></TargetVue>
        </div>
    )
}
export default Index2