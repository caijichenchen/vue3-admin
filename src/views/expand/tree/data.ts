const data = [
  {
    key: '0-0',
    value: '0-0',
    children: [
      {
        key: '0-0-0',
        value: '0-0-0',
        children: [
          {
            key: '0-0-0-0',
            value: '0-0-0-0',
          },
          {
            key: '0-0-0-1',
            value: '0-0-0-1',
            children: [
              {
                key: '0-0-0-1-0',
                value: '0-0-0-1-0',
              },
              {
                key: '0-0-0-1-1',
                value: '0-0-0-1-1',
              },
            ],
          },
          {
            key: '0-0-0-2',
            value: '0-0-0-2',
          },
        ],
      },
      {
        key: '0-0-1',
        value: '0-0-1',
      },
      {
        key: '0-0-2',
        value: '0-0-2',
      },
      {
        key: '0-0-3',
        value: '0-0-3',
      },
      {
        key: '0-0-4',
        value: '0-0-4',
      },
      {
        key: '0-0-5',
        value: '0-0-5',
      },
    ],
  },
  {
    key: '0-1',
    value: '0-1',
    children: [
      {
        key: '0-1-0',
        value: '0-1-0',
        children: [
          {
            key: '0-1-0-0',
            value: '0-1-0-0',
          },
        ],
      },
      {
        key: '0-1-1',
        value: '0-1-1',
      },
    ],
  },
  {
    key: '0-2',
    value: '0-2',
  },
  {
    key: '0-3',
    value: '0-3',
  },
  {
    key: '0-4',
    value: '0-4',
  },
  {
    key: '0-5',
    value: '0-5',
  },
]
// export default data
function plattenTreeData(treeData: any[]) {
  const map = {}
  const deepPlatten = (data: any[], level = '0') => {
    data.forEach((item: any, index: number) => {
      const _attrs = {
        _visible: level === '0' ? true : false,
        _expand: false,
        _level: `${level}-${index}`,
      }
      item._level = _attrs._level
      item._visible = _attrs._visible
      item._expand = _attrs._expand
      item._parentlevel = level
      item._isLeaf = Array.isArray(item.children) && item.children.length > 0

      map[item.key] = item
      if (item.isLeaf) {
        item._childs = item.children.length
        deepPlatten(item.children, `${level}-${index}`)
      }
    })
  }

  deepPlatten(treeData)
  return map
}

export default plattenTreeData(data)

// const a = plattenTreeData(data)
// console.log(1, a)
