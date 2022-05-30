import React from "react";
import Case from "./Case"
import {Link} from "react-router-dom"
interface Index1Props{
    theme: any,
    themes: any
}
interface Index1State{
}
function Index1(props: Index1Props, state: Index1State){
    let {theme, themes} = props
    let themeLeft = themes.ThemeLeft
    let dataLeftName = "result3_1.csv"
    let dataRightName = "result2_1.csv"
    let themeRight = themes.ThemeRight
    return(
        <div className="Index1" style={{position: "absolute", ...theme}}>
            {/* 转换按钮 */}
            <div style={{float: 'left', width: theme.width, height: 30, marginTop: 5}}>
                <button style={{float: 'left', fontSize: '10px', fontWeight: 600, width: 120, height: 30, marginLeft: 10}}>
                    <Link to="/index1">实验一:MAE折线图</Link>
                </button>
                <button style={{float: 'left', fontSize: '10px', fontWeight: 600, width: 120, height: 30, marginLeft: 10}}>
                    <Link to="/">实验二:Targetvue</Link>
                </button>
            </div>
            <Case theme={themeLeft} dataName={dataLeftName} judge={"left"}></Case>
            <Case theme={themeRight} dataName={dataRightName} judge={'right'}></Case>
        </div>
    )
}
export default Index1