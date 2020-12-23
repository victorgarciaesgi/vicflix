import { promises } from 'fs';
import path from 'path';
import { Module } from '@nuxt/types';

const iconFolderPath = path.resolve(__dirname, '../../assets/icons');
const basePath = '';
const fileRegex = /(\w*)\.\w+$/;
type Dir = { name: string; files: FileTree };
type FileTree = Array<string | Dir>;

// Experimental ⚠️

async function getFiles(dir: string): Promise<FileTree> {
  const dirents = await promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        const dirFiles = await getFiles(res);
        return { name: dirent.name, files: dirFiles };
      } else return dirent.name;
    })
  );
  return files;
}

const iconsModule: Module<any> = function () {
  this.nuxt.hook('build:before', async () => {
    const paths = await getFiles(iconFolderPath);
    console.log(paths);
    let typedObj = 'interface IconPaths {\n';

    function recursiveParser(file: string | Dir) {
      if (typeof file === 'string') {
        typedObj += `${file};\n`;
      } else {
        typedObj += `{\n  `;
        file.files.forEach((f) => recursiveParser(f));
        typedObj += `}\n`;
      }
    }
    paths.forEach((p) => recursiveParser(p));
    console.log(typedObj);
  });
};

export default iconsModule;
