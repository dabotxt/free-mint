import { ref } from 'vue'

const nameSpace = ref('primal')

export function useNamespace(scope: string) {
  return {
    mobilePrefixCls: `${nameSpace.value}-m-${scope}`,
    prefixCls: `${nameSpace.value}-${scope}`,
    multiPrefixCls: [
      `${nameSpace.value}-${scope}`,
      `${nameSpace.value}-m-${scope}`
    ]
  }
}
