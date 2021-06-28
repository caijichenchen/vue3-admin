export interface ThemeItemType {
  title: string
  name: string
  backgroundImage?: string
}

export interface ThemeType {
  default: string
  list: ThemeItemType[]
}

const theme: ThemeType = {
  list: [
    // {
    //   title: '经典',
    //   name: 'vd',
    // },
    {
      title: '线条',
      name: 'line',
      backgroundImage: 'image/theme/line/bg.jpg',
    },
    {
      title: '深灰',
      name: 'gray',
    },
    {
      title: '海岸',
      name: 'coastal',
      backgroundImage: 'image/theme/coastal/bg.jpg',
    },
    {
      title: '小镇',
      name: 'town',
      backgroundImage: 'image/theme/town/bg.jpg',
    },
    {
      title: '星空',
      name: 'star',
      backgroundImage: 'image/theme/star/bg.jpg',
    },
  ],
  // 默认主题
  default: 'gray',
}

export default theme
