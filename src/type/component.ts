import {Component} from "vue";


export type ComponentAble = Component | (() => Component)
export type ComponentAwaitAble = ComponentAble | (() => Promise<Component>)