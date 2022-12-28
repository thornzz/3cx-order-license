import { makeAutoObservable } from "mobx";

export const storeWithObject=makeAutoObservable({
    // observable
    lines:[],
    get count(){
        return storeWithObject.lines.length
    },
    addLine(data){
        console.log('store',storeWithObject)
        storeWithObject.lines.push(data)

    },
    getLines(){
        return  storeWithObject.lines
    }
})