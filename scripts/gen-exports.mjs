import fs from 'fs';
import path from 'path';

/**
 * 递归读取指定目录下的所有文件（含子目录），返回相对路径数组
 * @param {string} dir 要读取的目录
 * @param {string[]} extList 要匹配的文件扩展名
 * @param {string} baseDir 基础目录（用于计算相对路径）
 * @returns {string[]} 相对路径文件列表
 */
function walk(dir, extList, baseDir = dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...walk(fullPath, extList, baseDir));
        } else if (extList.some(ext => entry.name.endsWith(ext))) {
            files.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
        }
    }

    return files;
}

/**
 * 生成 index.ts 文件内容
 * @param {string[]} fileList 文件路径列表（相对于 fromPath）
 * @param {{ fromPath: string, defaultAs?: boolean }} options 配置项
 */
function generateExports(fileList, options) {
    return fileList.map(file => {
        const importPath = options.fromPath + '/' + file

        if (options.defaultAs) {
            // 默认导出形式（用于 Vue 组件）
            const baseName = path.basename(file, '.vue');
            const componentName = baseName.replace(/[^a-zA-Z0-9]/g, '_'); // 简单处理非法变量名字符
            return `export { default as ${componentName} } from '${importPath}';`;
        } else {
            return `export * from '${importPath}';`;
        }
    })
}

// === 执行导出生成 ===

// src/index.ts
const srcFiles = walk('./src', ['.ts', '.tsx'])
    .filter(f => !f.endsWith('index.ts'))
    .filter(f => !f.endsWith('web.ts'))
const viewFiles = walk('./view', ['.vue'])

const lines = [
    ...generateExports(srcFiles, {fromPath: './src'}),
    ...generateExports(viewFiles, {fromPath: './view', defaultAs: true,})
]
fs.writeFileSync('./export.ts', lines.join('\n') + '\n', 'utf8');


// view/index.ts


console.log('✅ 导出文件已生成');
