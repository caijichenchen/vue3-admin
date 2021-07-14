import { getLanguage } from '@/utils/db'
import { createI18n } from 'vue-i18n'
import China from './ch'
import EN from './en'

const language = createI18n({
  locale: getLanguage(),
  messages: {
    ch: China,
    en: EN,
  },
})

export default language
