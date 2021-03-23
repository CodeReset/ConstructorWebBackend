import Parser from './rnparser';

const test_id = '1112224';

const test_config = {
  name: 'test_app',
  version: '2.0.0',
  type: 'food-delivery_v2',
  theme: {
    name: 'dark'
  },
  view: [
    {
      name: 'main',
      components: [
        {
          name: 'head',
          type: 'default',
          props: { text: 'Деликиос фуд', margin: 30 }
          
        },
        {
          name: 'search',
          type: 'default'
        },
        {
          name: 'loaderLogic',
          entity: 'fragment',
          type: 'start'
        },
        {
          name: 'loader',
          type: 'default'
        },
        {
          name: 'view',
          entity: 'fragment',
          type: 'start'
        },
        {
          name: 'categoryList',
          type: 'default'
        },
        {
          name: 'productList',
          type: 'horizontal'
        },
        {
          name: 'view',
          entity: 'fragment',
          type: 'end'
        },
        {
          name: 'loaderLogic',
          entity: 'fragment',
          type: 'end'
        },
      ]
    }
  ]
};

const parser = new Parser(test_id, test_config);

parser.init();
