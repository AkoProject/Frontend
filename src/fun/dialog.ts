import {CSSProperties, Ref, ref, VNode} from "vue";

interface DialogOption {
    content: VNode | (() => VNode)
    style?: string | CSSProperties
    title?: string
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
    const d: RealDialog = {
        ...options,
        showRef: ref(true),
        close() {
            this.showRef.value = false
        }
    }
    // @ts-ignore
    dialogList.value.push(d)
    return d
}