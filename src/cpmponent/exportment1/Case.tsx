import React from "react";
import * as d3 from "d3";
import "antd/dist/antd.css"
import {Select} from "antd"
import $ from "jquery"
interface CaseProps{
    theme: any,
    dataName: string,
    judge: string
}
interface CaseState{
    dataset: {
        date: Date,
        MAE: number
    }[][], // 数据
    drawGeo: string, // 要绘制的东东
    picName: string,
    Id_list: string
}
const {Option} = Select
function Case (props: CaseProps, state: CaseState){
    let {dataName, judge} = props
    let data_ = require("../../data/" + dataName)
    let {theme} = props
    let [dataset, SetDataset] = React.useState([])
    let display = false
    let draw = true
    let [Id_list, SetId_list] = React.useState([]) // 各层字符串顺序列表
    // function clgDataset(){
    //     console.log(dataset)
    // }
    let [picName, SetPicName] = React.useState("折线图")
    React.useEffect(() => {
        if(display === false){
            display = true
            d3.csv(data_).then(d => {
                let id_list: string[] = []
                let id_list_set = new Set()
                // console.log(d)
                for(let i = 0; i < d.length; i++){
                    id_list_set.add(String(d[i]['id']))
                }
                id_list = Array.from(id_list_set) as any
                // 排序id列表
                id_list = id_list.sort(function(a, b){
                    return Number(a) - Number(b)
                })
                // 初始化dataList
                let dataList: {
                    date: Date,
                    MAE: number
                }[][] = []
                for(let i = 0; i < id_list.length; i++){
                    dataList.push([])
                }
                // 向dataList里面添加数据
                for(let i = 0; i < d.length; i++){
                    let index = id_list.indexOf(String(d[i]['id']))
                    dataList[index].push({
                        date: new Date(String(d[i]['date'])),
                        MAE: Number(d[i]['MAE'])
                    })
                }
                // console.log(dataList)
                // console.log(id_list)
                for(let i = 0; i < id_list.length; i++){
                    dataList[i] = dataList[i].sort(function(a, b){
                        return (a.date as any) - (b.date as any)
                    })
                }
                SetId_list(id_list as any)
                SetDataset(dataList as any)
            })
        }
    }, [])
    // 绘制折线的函数
    function drawLine(){
        // console.log(dataset)
        let margin = {top: 10, left: 40, right: 10, bottom: 20}
        let width = theme.width - 4 - 17
        let height_l = (theme.height - 34) / 5 - 20
        for(let i = 0; i < Id_list.length; i++){
            let data: {
                date: Date,
                MAE: number
            }[] = dataset[i]
            let id = Id_list[i]
            d3.select("#line" + judge + Id_list[i]).selectAll('g').remove()
            let svg = d3.select("#line" + judge + Id_list[i])
            .append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            // 创建坐标轴(x轴)
            let xScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, width - margin.left - margin.right])
            let xAxis = d3.axisBottom(xScale)
            .tickValues([0, data.length])
            svg.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${height_l - margin.top - margin.bottom})`)
            // y轴
            let max_mae = d3.max(data, function(a){return a.MAE})
            let yScale = d3.scaleLinear()
            .domain([Number(max_mae), 0])
            .range([0, height_l - margin.top - margin.bottom])
            let yAxis = d3.axisLeft(yScale)
            .tickValues([0, Number(max_mae)])
            svg.append('g')
            .call(yAxis)
            // 绘制折线
            let line_make = d3.line()
            .x((d, i) => xScale(i))
            .y((d: any) => yScale(d.MAE))
            let lines = svg.append('g')
            lines.append('path')
            .datum(data)
            .attr('d', line_make as any)
            .attr('stroke', 'green')
            .attr('fill', 'none')
        }
    }
    // 绘制散点图的函数
    function Scatter(){
        let height_l = (theme.height - 34) / 5 - 20
        let margin = {top: 10, left: 30, right: 10, bottom: height_l / 2}
        let width = theme.width - 4 - 17
        for(let i = 0; i < Id_list.length; i++){
            let data: {
                date: Date,
                MAE: number
            }[] = dataset[i]
            let id = Id_list[i]
            d3.select("#circle" + judge + Id_list[i]).selectAll('g').remove()
            let svg = d3.select("#circle" + judge + Id_list[i])
            .append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            // 绘制x轴
            let max_mae = d3.max(data, function(a){return a.MAE})
            let xScale = d3.scaleLinear()
            .domain([0, Number(max_mae)])
            .range([0, width - margin.left - margin.right])
            let xAxis = d3.axisBottom(xScale)
            .tickValues([0, Number(max_mae)])
            svg.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${height_l - margin.top - margin.bottom})`)
            // 绘制散点
            let scatter = svg.append('g')
            scatter.selectAll("circle")
            .data(data)
            .join('circle')
            .attr('cx', (d, i) => xScale(d.MAE))
            .attr('cy', height_l - margin.top - margin.bottom - 5)
            .attr('r', 1)
            .attr('fill', 'green')
        }
    }
    // dataset 数据变化才能触发的函数
    React.useEffect(() => {
        if (dataset.length !== 0 && draw === true){
            draw = false
            drawLine()
            Scatter()
        }
    }, [dataset])
    // 选择
    let select = ["折线图", "散点图"].map((v, index) => {
        return(
            <Option key={"select" + judge + index} value={v} children={undefined}></Option>
        )
    })
    // 选择函数
    function onChangeName(value: string){
        let id = value === "折线图" ? "line" : "circle"
        let id_other = value !== "折线图" ? "line" : "circle"
        $("#" + id_other + judge).css("display", 'none')
        $("#" + id + judge).css('display', "inline")
        SetPicName(value)
    }
    // 主题
    let title = ["title_" + dataName].map((v) => {
        return(
            <div key={judge + v} style={{float: "left", width: theme.width, height: 30, fontSize: "14px", fontWeight: 600, lineHeight: '30px', color:'green'}}>
                <div style={{float: "left", width: 200, height: 30}}>&nbsp;{dataName === "result2_1.csv" ? "当前算法的MAE数据分布" : "之前算法的MAE数据分布"}</div>
                <div style={{float: "left", width: 100, height: 30, marginLeft: '280px'}}>
                    <Select size={"small"} defaultValue={picName} style={{width: 100, height:"28px"}} onChange={onChangeName}>
                        {select}
                    </Select>
                </div>
            </div>
        )
    })
    if(dataset.length === 0){
        return(
            <div className="Case" style={{position: 'absolute', ...theme}}>
                {title}
            </div>
        )
    } else {
        let each_height = (theme.height - 34) / 5
        // 折线图
        let line = dataset.map((v, index) => {
            return(
                <div key={'line' + judge + index} style={{float: 'left', width: theme.width - 4 - 17, height: each_height, borderTop: '2px solid rgb(220, 220, 220)', background: index % 2 === 0 ? "rgb(220, 220, 220)" : "white"}}>
                <div style={{float: 'left', marginLeft: '5px', width: 230, height: 20, lineHeight: '20px'}}>{Id_list[index]}层</div>
                    <svg id={"line" + judge + Id_list[index]} style={{float: 'left', width: theme.width - 4 - 17, height: each_height - 2 - 20}}></svg>
                </div>
            )
        })
        // 散点图
        let circle = dataset.map((v, index) => {
            return(
                <div key={'circle' + judge + index} style={{float: 'left', width: theme.width - 4 - 17, height: each_height, borderTop: '2px solid rgb(220, 220, 220)', background: index % 2 === 0 ? "rgb(220, 220, 220)" : "white"}}>
                <div style={{float: 'left', marginLeft: '5px', width: 230, height: 20, lineHeight: '20px'}}>{Id_list[index]}层</div>
                    <svg id={"circle" + judge + Id_list[index]} style={{float: 'left', width: theme.width - 4 - 17, height: each_height - 2 - 20}}></svg>
                </div>
            )
        })
        return(
            <div className="Case" style={{position:"absolute", ...theme}}>
                {title}
                {/* 折线图 */}
                <div id={'line' + judge} style={{float: 'left', width: theme.width - 4, height: theme.height - 34, overflow: 'auto', display:"inline"}}>
                    {line}
                </div>
                {/* 散点图 */}
                <div id={"circle" + judge} style={{float: 'left', width: theme.width - 4, height: theme.height - 34, overflow: 'auto', display:"none"}}>
                    {circle}
                </div>
            </div>
        )
    }
}
export default Case;