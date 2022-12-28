import { makeAutoObservable } from "mobx";

export const storeWithObject=makeAutoObservable({
    // observable
    lines:[],
    get count(){
        return storeWithObject.lines.length
    },
    addLine(data){
        console.log(JSON.stringify(data))
        storeWithObject.lines.push(data)
    },
    getLines(){
        return  storeWithObject.lines
    }
})