import React from "react";
import {Select} from "antd"
import "antd/dist/antd.css"
import * as d3 from "d3"
interface TargetVueProps{
    theme: any
}
interface TargetVueState{
    // 当前时间段
    time_period: String
}
let {Option} = Select
// dataset 的 数据格式
type Dataset = {
    data: {[key: string]: {
        MAE: {[date: string]: string[]}, // 每段日期的MAE列表字典
        weight: {[date: string]: number}, // 每段日期的平均权重
        err_number: number // 异常数据的个数
    }},
    link: string[][]
}
// 要导入的数据
let data_mrcj = require("../../data/mrcj.csv")
let data_result = require("../../data/result2_1.csv")
function TargetVue (props: TargetVueProps, state: TargetVueState){
    let {theme} = props
    let [time_period, setTime] = React.useState("")
    // dateList: 时间序列
    let dateList: string[] = []
    // dataset: 数据
    let dataset: Dataset = {
        data: {},
        link: []
    }
    // time_step: 时间步长(就是隔几天)
    let time_step: number = 30
    // time_list: 时间段列表
    let time_list: string[] = []

    React.useEffect(() => {
        // 初始化时，加载数据
        if(time_period === "") {
            d3.csv(data_mrcj).then(value_mrcj => {
                d3.csv(data_result).then(value_result => {
                    // 储存id，用于后面的链接获取
                    let id_list: string[] = []
                    // 获取日期 ———— 数据
                    let date_data: {[key: string]: {[key: string]: string}[]} = {}
                    for(let i = 0; i < value_result.length; i++){
                        let v = value_result[i]
                        if(date_data[v['date'] as any] === undefined){
                            date_data[v['date'] as any] = []
                        }
                        date_data[v['date'] as any].push({
                            id: (v['id'] as any),
                            diff: (v['diff'] as any),
                            result: (v['result'] as any),
                            MAE: (v['MAE'] as any)
                        })
                    }
                    // 获取时间列表
                    dateList = Object.keys(date_data)
                    // 排序时间列表
                    dateList = dateList.sort(function(a, b){
                        return (new Date(a) as any) - (new Date(b) as any)
                    })
                    // 获取dataset 的 data部分数据
                    for(let i = 0; i < dateList.length; i += time_step){
                        console.log(i)
                    }
                })
            })
        } else {
            console.log("err")
        }
    })
    return (
        <div className="TargetVue" style={{position: 'absolute', ...theme}}>
        </div>
    )
}
export default TargetVue