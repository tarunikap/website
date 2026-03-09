import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXFile } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.mdx')) {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

export async function getAllContent(): Promise<MDXFile[]> {
    const filePaths = getAllFiles(contentDirectory);

    const allContent = await Promise.all(
        filePaths.map(async (filePath) => {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContents);

            // Extract folder name relative to 'content' directory
            const relativePath = path.relative(contentDirectory, filePath);
            const folder = path.dirname(relativePath);

            return {
                id: (data.id as string) || path.basename(filePath, '.mdx'),
                title: (data.title as string) || 'Untitled',
                fileName: (data.fileName as string) || path.basename(filePath),
                folder: (data.folder as string) || folder,
                content: content, // Raw content string
                ...data,
            };
        })
    );

    return allContent;
}
