// import fs from "fs";
import extract from 'extract-zip';
import child_process from 'child_process';
// import Log, { ErrorWithoutLogging } from "salger-logger";
import logger from './utils/logger';
import { promises as fsp } from 'fs';
import { INIT_APPLICATION_DIR, TEMPLATES_DIR, APK_DIR, TEMP_PAGES } from './config/constants';
import Mustache from 'mustache';

import DELIVERY_TEMPLATE from './sources/generators/food-delivery';

class SalgerBuilder {
  constructor(id, config) {
    this.id = id;
    this.config = config;
  }

  async init() {
    try {
      //Определяем директории для приложения и исходники для него
      const app_dir = `${__dirname}/${INIT_APPLICATION_DIR}/${this.id}`;
      const temp_dir = `${__dirname}/${TEMPLATES_DIR}/${this.config.type}.zip`;
      const apk_dir = `${process.cwd()}/${APK_DIR}/${this.id}.apk`;
      let start1 = new Date();
      //Извлекаем из архива шаблона файлы и копируем в директорию приложения
      // await extract(temp_dir, {
      //   dir: app_dir,
      // });
      let end1 = new Date();
      console.log(end1 - start1);
      //Определяем поля для package.json приложения
      const packageJsonFields = [
        { field: 'name', text: this.config.name },
        { field: 'version', text: this.config.version }
      ];
      //Парсим файл package.json и заполняем нужные поля
      // await this.buildJson(`${app_dir}/package.json`, packageJsonFields);
      const templateConfig = DELIVERY_TEMPLATE;
      //Определяем тему приложения
      const theme = templateConfig.themes[this.config.theme.name];
      await this.createThemeFile(app_dir, theme);
      //Вставляем компоненты в шаблон приложения
      this.config.view.forEach(async (page) => {
        await this.modifyTemplatePage(app_dir, page.name, page.components, templateConfig);
        await this.changeComponentsTypeIfNeeded(page.components, templateConfig, page.name, app_dir);
      });
      return;
      //Скачиваем все зависимости через npm
      let start2 = new Date();
      console.log(app_dir);
      const result = await this.execShellCommand(`cd ${app_dir} & npm i`);
      let end2 = new Date();
      console.log(end2 - start2);
      let start3 = new Date();
      //Генерируем файл apk
      await this.execShellCommand(`cd ${app_dir}/android & gradlew clean & gradlew assembleRelease`);
      await fsp.copyFile(`${app_dir}/android/app/build/outputs/apk/release/app-release.apk`, apk_dir);
      let end3 = new Date();
      console.log(end3 - start3);
      return;
    } catch (error) {
      console.log(error);
      logger.error(`Cannot init application ${error}`);
      throw Error('Cannot init application');
    }
  }

  async buildJson(fileName, content) {
    try {
      const file = require(fileName);
      content.forEach((item) => {
        file[item.field] = item.text;
      });
      await fsp.writeFile(fileName, JSON.stringify(file));
    } catch (e) {
      logger.error(`Cannot parse file ${fileName}`);
      throw Error(`Cannot parse file ${fileName}`);
    }
  }

  async modifyTemplatePage(app_dir, name, components, config) {
    try {
      const file = `${app_dir}/${config.pages[name].path}/index.tsx`;
      const data = await fsp.readFile(file, 'utf8');
      let newFile = this.clearContent(data);
      newFile = this.fillFragmentWithComponents(newFile, components, config, name);
      console.log(newFile);
      // newFile = this.fillPageDependencies(newFile, content, TEMP_PAGES[index].plugin);
      await fsp.writeFile(file, newFile);
      await this.execShellCommand(`prettier --write ${app_dir}/${config.pages[name].path}/index.tsx`);

    } catch (e) {
      console.log(e);
      logger.error(`Cannot modify template ${name}`);
      throw Error(`Cannot modify template ${name}`);
    }
  }

  clearContent(data) {
    const { start, end } = this.getFragment(data, 'content');
    const componentData = data.slice(start, end);
    return data.replace(componentData, '\n      ');
  }

  fillFragmentWithComponents(data, components, config, name) {
    const { start } = this.getFragment(data, 'content');
    return data.slice(0, start) + this.generateContentFromComponents(components, config, name) + data.slice(start);
  }

  fillFragmentWithText(data, text) {
    const { start } = this.getFragment(data, 'content');
    return data.slice(0, start) + text + data.slice(start);
  }

  fillPageDependencies(data, content, plugin) {
    const { startIndex } = this.getFragment(data, 'header');
    let componentNewData = '';
    content.forEach((field) => {
      componentNewData += `\nimport '${field.name}' from '${plugin}';`;
    });
    return data.slice(0, startIndex) + componentNewData + data.slice(startIndex);
  }

  getFragment(data, index) {
    return {
      start: data.search(`//${index}`) + `//${index}`.length,
      end: data.search(`//${index}-end`)
    };
  }

  generateContentFromComponents(components, config, name) {
    let newContent = '';
    components.forEach((field) => {
      let props = {};
      if (field.props) props = field.props;
      if (field.entity === 'fragment') {
        newContent += Mustache.render(config.fragments[field.name][field.type], props);
      } else if (!config.pages[name].components[field.name].static) {
        newContent += Mustache.render(config.pages[name].components[field.name].template, props);
      }
    });
    
    newContent = `\n ${config.pages[name].generate(newContent)}`;
    console.log(newContent)
    return newContent;
  }

  async changeComponentsTypeIfNeeded(components, config, name, app_dir) {
    components.forEach(async (field) => {
      if (field.entity != 'fragment' && field.type != 'default') {
        let props = {};
        if (field.props) props = field.props;
        const newComponentWithType = Mustache.render(config.pages[name].components[field.name].types[field.type].template, props);
        const path = `${app_dir}/${config.pages[name].components[field.name].path}`;
        let newFile = await fsp.readFile(path, 'utf8');
        newFile = this.clearContent(newFile);
        newFile = this.fillFragmentWithText(newFile, newComponentWithType);
        await fsp.writeFile(path, newFile);
      }
    });
    return;
  }

  async createThemeFile(app_dir, theme) {
    const themeContent = `export const Config = ${JSON.stringify(theme)};`;
    await fsp.writeFile(`${app_dir}/config_app.js`, themeContent);
  }

  async execShellCommand(cmd) {
    const exec = child_process.exec;
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    });
  }
}

module.exports = SalgerBuilder;
