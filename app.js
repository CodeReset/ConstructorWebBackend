import express from 'express';
import Parser from './rnparser';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 7000;

app.use(express.json({ extended: true }));
app.use(cors());
app.use('/static', express.static('public'));

app.post('/add', (req, res) => {
  console.log(req.body);
  //   const parser = new Parser(req.body.id, req.body.config);
  res.send(200);
});

app.post('/getThemes', (req, res) => {
  console.log(req.body);
  const themes = [];
  res.status(200).json(themes);
});

app.post('/getPages', (req, res) => {
  const pages = [
    {
      name: 'Main',
      id: 'main',
      icon: 'main.png',
      components: [
        {
          name: 'head',
          entity: 'component',
          text: 'Headline',
          type: 'default',
          props: { text: 'Деликиос фуд' }
        },
        {
          name: 'search',
          entity: 'component',
          text: 'Search',
          type: 'default'
        },
        // {
        //   name: 'loaderLogic',
        //   entity: 'fragment',
        //   type: 'start'
        // },
        {
          name: 'loader',
          entity: 'component',
          text: 'Loader',
          type: 'default'
        },
        // {
        //   name: 'view',
        //   entity: 'fragment',
        //   type: 'start'
        // },
        {
          name: 'categoryList',
          entity: 'component',
          text: 'Category List',
          type: 'vertical'
        },
        {
          name: 'productList',
          entity: 'component',
          text: 'Product List',
          type: 'horizontal'
        }
        // {
        //   name: 'view',
        //   entity: 'fragment',
        //   type: 'end'
        // },
        // {
        //   name: 'loaderLogic',
        //   entity: 'fragment',
        //   type: 'end'
        // }
      ]
    }
  ];
  res.status(200).json(pages);
});

app.post('/getComponent', (req, res) => {
  console.log(req.body);
  const component = {
    main: {
      head: {
        text: 'Headline',
        types: [
          {
            id: 'oneline',
            name: 'oneline',
            componentScreen: `http://localhost:${port}/static/components/oneline.PNG`,
            pageScreen: `http://localhost:${port}/static/pages/onelinepage.PNG`
          },
          {
            id: 'multiline',
            name: 'multiline',
            componentScreen: `http://localhost:${port}/static/components/multiline.PNG`,
            pageScreen: `http://localhost:${port}/static/pages/multiplelinepage.PNG`
          }
        ],
        props: [{ name: 'text', type: 'text' }]
      },
      categoryList: {
        text: 'Category list',
        types: [
          {
            id: 'vertical',
            name: 'Vartical',
            componentScreen: `http://localhost:${port}/static/components/horizontal.png`,
            pageScreen: `http://localhost:${port}/static/pages/main.png`
          },
          {
            id: 'horizontal',
            name: 'Horizontal',
            componentScreen: `http://localhost:${port}/static/components/horizontal.png`,
            pageScreen: `http://localhost:${port}/static/components/horizontal.png`
          }
        ],
        props: []
      }
    }
  };
  res.status(200).json(component[req.body.page][req.body.name]);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
