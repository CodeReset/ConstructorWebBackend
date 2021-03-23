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
          generate: ({ text }) => {
            return `<Heading marginTop={30}>${text}</Heading>`;
          },
          path: 'src/components/UI/Heading/Heading'
        },
        search: {
          name: 'search',
          generate: () => {
            return `<SearchPanel searchValue={valueSearch} handleChangeSearchValue={changeSearchValues}/>`;
          },
          path: 'components/UI/SearchPanel/SearchPanel'
        },
        loader: {
          name: 'loader',
          static: true,
          path: 'src/components/UI/Loader/Loader'
        },
        categoryList: {
          name: 'categoryList',
          generate: () => {
            return `
            <CategoryList
              list={allCategories || []}
              activeCategory={activeCategory}
              changeActiveCategory={changeActiveCategory}
            />`;
          },
          path: 'src/components/UI/Loader/Loader'
        },
        productList: {
          name: 'productList',
          generate: () => {
            return `
              <ProductList
                list={producetsItems}
                addToCart={addToCart}
                goToDetailInformation={goToDetailInformation}
              />`;
          },
          path: 'src/components/ProductList/ProductList.tsx',
          index: 'product-list',
          types: {
            default: {
              name: 'default',
              generate: () => {
                return `
                <ScrollView style={styles.productList}>
                {list.map((item: IProductList) => (
                  <ProductItem
                    key={item.id}
                    product={item}
                    addToCart={addToCart}
                    goToDetailInformation={goToDetailInformation}
                  />
                ))}
              </ScrollView>`;
              }
            },
            horizontal: {
              name: 'horizontal',
              generate: () => {
                return `
                <ScrollView style={styles.productList} horizontal={true}>
                {list.map((item: IProductList) => (
                  <ProductItem
                    key={item.id}
                    product={item}
                    addToCart={addToCart}
                    goToDetailInformation={goToDetailInformation}
                  />
                ))}
              </ScrollView>`;
              }
            }
          }
        }
      }
    }
  },
  fragments: {
    loaderLogic: {
      start: () => {
        return `
        {loaderMenu ? (
          <Loader />
        ) : (`;
      },
      end: () => {
        return `
        )}`;
      }
    },
    view: {
      name: 'view',
      start: () => {
        return `
        <View>`;
      },
      end: () => {
        return `
        </View>`;
      }
    }
  }
};
