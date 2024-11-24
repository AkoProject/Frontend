import {CSSProperties, Ref, ref, VNode} from "vue";

interface DialogOption {
    content: VNode | (() => VNode)
    close: () => void,
    style?: string | CSSProperties
}

interface Dialog {
    close: () => void,
}

interface RealDialog extends Dialog, DialogOption {
    showRef: Ref<boolean>
}

export const dialogList = ref<RealDialog[]>([])

export function dialog(
    options: DialogOption
): Dialog {
    console.log("dialog")
    const d = {
        ...options,
        showRef: ref(true),
        close() {
            this.showRef.value = false
        }
    }
    dialogList.value.push(d)
    return d
}