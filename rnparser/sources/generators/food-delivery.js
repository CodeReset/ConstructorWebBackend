export default {
    themes: {
      dark: {
        navigatorTypeFromJSON: 'tabs',
        theme: 'dark'
      }
    },
    pages: {
      main: {
        name: 'main_page',
        path: 'src/screens/MainMenu/Main',
        generate: (code) => {
            return `
          <View style={styles.containerWrapper}>
            <ScrollView style={styles.scrollContainer}>
              ${code}
            </ScrollView>
          </View>`;
          },
        components: {
          head: {
            name: 'head',
            template: `<Heading marginTop={ {{margin}} }>{{text}}</Heading>`,
            path: 'src/components/UI/Heading/Heading'
          },
          search: {
            name: 'search',
            template: `<SearchPanel searchValue={valueSearch} handleChangeSearchValue={changeSearchValues}/>`,
            path: 'components/UI/SearchPanel/SearchPanel'
          },
          loader: {
            name: 'loader',
            static: true,
            path: 'src/components/UI/Loader/Loader'
          },
          categoryList: {
            name: 'categoryList',
            template: `
              <CategoryList
                list={allCategories || []}
                activeCategory={activeCategory}
                changeActiveCategory={changeActiveCategory}
              />`,
            path: 'src/components/UI/Loader/Loader'
          },
          productList: {
            name: 'productList',
            template: `
                <ProductList
                  list={producetsItems}
                  addToCart={addToCart}
                  goToDetailInformation={goToDetailInformation}
                />`,
            path: 'src/components/ProductList/ProductList.tsx',
            index: 'product-list',
            types: {
              default: {
                name: 'default',
                template: `
                  <ScrollView style={styles.productList}>
                  {list.map((item: IProductList) => (
                    <ProductItem
                      key={item.id}
                      product={item}
                      addToCart={addToCart}
                      goToDetailInformation={goToDetailInformation}
                    />
                  ))}
                </ScrollView>`
              },
              horizontal: {
                name: 'horizontal',
                template: `
                  <ScrollView style={styles.productList} horizontal={true}>
                  {list.map((item: IProductList) => (
                    <ProductItem
                      key={item.id}
                      product={item}
                      addToCart={addToCart}
                      goToDetailInformation={goToDetailInformation}
                    />
                  ))}
                </ScrollView>`
              }
            }
          }
        }
      }
    },
    fragments: {
      loaderLogic: {
        start: `
          {loaderMenu ? (<Loader />) : (`,
        end: `
          )}`
      },
      view: {
        name: 'view',
        start: `
          <View>`,
        end: `
          </View>`
      }
    }
  };
  