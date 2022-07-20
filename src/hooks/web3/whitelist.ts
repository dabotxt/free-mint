import { computed } from 'vue'

const whitelist = [
  '0x93CFfAF883bFdb964c5E66d7b599f8020D919d65',
  '0x7B6E90855E0cc9c9121da9E7F440D202aa549074',
  '0xf95632B317E70C75C0D56fe056507eBA15238094',
  '0x008659610263205Ab3E9Ab0Fb64c8C838Db73493'
]
const whiteToLowerCase = computed(() => {
  const newList = whitelist.map((item, index) => {
    return whitelist[index].toLowerCase()
  })
  return newList
})
export {
  whiteToLowerCase
}
