import type ComponentPanel from './ComponentPanel/index.vue'
import type FormPanel from './FormPanel/index.vue'
import type PreviewJson from './Toolbar/PreviewJson.vue'
import type Preview from './Toolbar/Preview.vue'

export type ComponentPanelInstance = InstanceType<typeof ComponentPanel>
export type FormPanelInstance = InstanceType<typeof FormPanel>
export type PreviewJsonInstance = InstanceType<typeof PreviewJson>
export type PreviewInstance = InstanceType<typeof Preview>
